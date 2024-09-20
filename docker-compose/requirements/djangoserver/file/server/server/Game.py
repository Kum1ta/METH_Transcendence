# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 16:20:58 by tomoron           #+#    #+#              #
#    Updated: 2024/09/20 12:53:09 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import time
import json
import asyncio

class Game:
	waitingForPlayerLock = False
	waitingForPlayer = None
	ballWidth = 0.15
	playerLength = 1
	limits = {
		"left" : -3.5 + ballWidth,
		"right" : 3.5 - ballWidth,
		"back" : -6.25 + ballWidth,
		"front" : 6.25 - ballWidth
	}
	startSpeed = 4
	def __init__(self, socket, withBot):
		self.p1 = None
		self.p2 = None
		self.p1Ready = False
		self.p2Ready = False
		self.bot = withBot
		self.started = False
		self.end = False

		self.p1Pos = {"pos":0, "up": False}
		self.p2Pos = {"pos":0, "up": False}
		
		self.ballPos = {"pos":(0, 0), "up": False}
		self.speed = Game.startSpeed
		self.ballVel = (self.speed, 0)

		if(withBot):
			self.join(socket)
		else:
			while(Game.waitingForPlayerLock):
				time.sleep(0.05)
			Game.waitingForPlayerLock = True
			if(Game.waitingForPlayer == None):
				Game.waitingForPlayer = self
				socket.sync_send({"type":"game","content":{"action":0}})
				self.join(socket)
			else:
				Game.waitingForPlayer.join(socket)
				Game.waitingForPlayer = None
			Game.waitingForPlayerLock = False

	def join(self, socket):
		try:
			if(self.p1 == None):
				self.p1 = socket
			else:
				self.p2 = socket
			socket.game = self
			if(self.p2 != None and self.p1 != None):
				self.p1.sync_send({"type":"game", "content":{"action":1,"id":self.p2.id,"username":self.p2.username}})
				self.p2.sync_send({"type":"game", "content":{"action":1,"id":self.p1.id,"username":self.p1.username}})
		except Exception as e:
			socket.sendError("invalid request", 9005, e)

	async def setReady(self, socket):
		if(socket == self.p1):
			self.p1Ready = True
		elif (socket == self.p2):
			self.p2Ready = True
		else:
			return(0)
		if(self.p1Ready and self.p2Ready):
			print("both players are ready, starting game")
			asyncio.create_task(self.gameLoop())
		return(1)
	
	def leave(self, socket):
		socket.game = None
		if (socket == self.p1):
			self.p1 = None
		else:
			self.p2 = None
		if(self.p1 != None):
			self.p1.sync_send({"type":"game","content":{"action":4}})
			self.leave(self.p1)
		if(self.p2 != None):
			self.p2.sync_send({"type":"game","content":{"action":4}})
			self.leave(self.p2)
		while(Game.waitingForPlayerLock):
			time.sleeep(0.05)
		Game.waitingForPlayerLock = True
		if(Game.waitingForPlayerLock == socket):
			Game.waitingForPlayerLock = False;
		Game.waitingForPlayerLock = False 
		self.end=True

	def sendPlayers(self, data):
		data_raw = json.dumps({"type":"game","content":data})
		self.p1.sync_send(data_raw)
		self.p2.sync_send(data_raw)

	def move(self, socket, pos, up):
		opponent = self.p1 if socket != self.p1 else self.p2
		if(socket == self.p1):
			self.p1Pos["pos"] = pos
			self.p1Pos["up"] = up;
		else:
			self.p2Pos["pos"] = -pos;
			self.p2Pos["up"] = up
		if(opponent != None):
			opponent.sync_send({"type":"game","content":{"action":3, "pos":-pos, "up":up, "is_opponent":True}})

	def sendNewBallInfo(self):
		print("send new ball info")
		if(self.p1):
			self.p1.sync_send({"type":"game", "content":{"action":5,
				"pos" : [self.ballPos["pos"][0],self.ballPos["pos"][1]],
				"velocity":[self.ballVel[0], self.ballVel[1]]
			}})
		if(self.p2):
			self.p2.sync_send({"type":"game","content":{"action":5,
				"pos" : [-self.ballPos["pos"][0],-self.ballPos["pos"][1]],
				"velocity":[-self.ballVel[0], -self.ballVel[1]]
			}})
	def getTimeUntilColision(self, limitNeg, limitPos, position, velocity):
		if(not velocity):
			return(-1)
		limit = Game.limits[limitNeg] if velocity < 0 else Game.limits[limitPos] 
		distance = max(limit, position) - min(limit, position)
		colision_time = distance / abs(velocity)
		return(colision_time)


	def getSleepTime(self):
		time_x = self.getTimeUntilColision("left","right", self.ballPos["pos"][0], self.ballVel[0])
		time_z = self.getTimeUntilColision("back","front", self.ballPos["pos"][1], self.ballVel[1])
		if(time_x == -1):
			return(time_z)
		if(time_z == -1):
			return(time_x)
		return(min(time_x, time_z))

	def getPlayerDistance(self, ballPos):
		playerPos = self.p2Pos["pos"] if ballPos[1] < 0 else self.p1Pos["pos"]
		print("Player pos : ", playerPos)
		print("chose player :", 2 if ballPos[1] < 0 else 1)
		print("ball position :", ballPos[0])
		return(playerPos - ballPos[0])

	async def updateBall(self):
		now = time.time()
		delta = now - self.lastUpdate
		currentBallPos = self.ballPos["pos"]
		velX = self.ballVel[0]
		velZ = self.ballVel[1]
		newBallPos = (round(currentBallPos[0] + (delta * velX), 5),
		round(currentBallPos[1] + (delta * velZ), 5))
		if(newBallPos[1] <= Game.limits["back"] or newBallPos[1] >= Game.limits["front"]):
			playerDistance = self.getPlayerDistance(newBallPos)
			print("player distance :", playerDistance)
			if(playerDistance >= -1 and playerDistance <= 1):
				print("colided")
				velX = -((self.speed * 0.80) * playerDistance)
				velZ = self.speed - abs(velX)
				print("velocity : " , velX , ", ", velZ)
				
				if(newBallPos[1] > 0):
					velZ = -velZ
			else:
				print("a player suffured from a major skill issue")
				self.p1.sync_send({"type":"game","content":{"action":6, "is_opponent": newBallPos[1] < 0}})
				self.p2.sync_send({"type":"game","content":{"action":6, "is_opponent": newBallPos[1] > 0}})
				await asyncio.sleep(3)
				self.prepareGame(True)
				await asyncio.sleep(3)
				self.prepareGame()
				return;
		elif(newBallPos[0] <= Game.limits["left"] or newBallPos[0] >= Game.limits["right"]):
			velX = -velX
		self.ballVel = (velX, velZ)
		self.lastUpdate = now
		self.ballPos["pos"] = newBallPos
		self.sendNewBallInfo()
	
	def prepareGame(self, stop = False):
		self.ballPos = {"pos":(0, 0), "up": False}
		if(stop):
			self.ballVel = (0, 0)
		else:
			self.ballVel = (self.speed/2, self.speed/2)
		self.sendNewBallInfo()
		self.lastUpdate = time.time()

	async def gameLoop(self):
		self.started = True
		self.sendPlayers({"action":2})
		await asyncio.sleep(3)
		self.prepareGame()
		while(not self.end):
			await self.updateBall()
			sleep_time = self.getSleepTime()
			await asyncio.sleep(sleep_time)
		print("game end")
