# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 16:20:58 by tomoron           #+#    #+#              #
#    Updated: 2024/09/22 16:10:51 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import time
import json
import asyncio
import random

class Game:
	waitingForPlayerLock = False
	waitingForPlayer = None
	ballWidth = 0.15
	playerLength = 1 + (ballWidth * 2)
	limits = {
		"left" : -3.5 + ballWidth,
		"right" : 3.5 - ballWidth,
		"back" : -6.25 + ballWidth,
		"front" : 6.25 - ballWidth
	}
	mapLength = 13
	startSpeed = 4
	wallsPos = [
			{ "type":2, "pos": {"x": 1, "y": 0, "z": 1}, "isUp": False},
			{ "type":2, "pos": {"x": 1, "y": 0, "z": 1}, "isUp": True},
			{ "type":2, "pos": {"x": -1, "y": 0, "z": 1}, "isUp": False},
			{ "type":2, "pos": {"x": -1, "y": 0, "z": 1}, "isUp": True}
	]
	jumpersPos = [
			{ "type":1, "pos":{"x": -1.5, "y": 0.2, "z":mapLength/4}, "isUp": False },
			{ "type":1, "pos":{"x": -1.5, "y": 3.2, "z": mapLength / 4}, "isUp": True },
			{ "type":1, "pos":{"x": 1.5, "y": 0.2, "z": mapLength / 4}, "isUp": False },
			{ "type":1, "pos":{"x": 1.5, "y": 3.2, "z": mapLength / 4}, "isUp": True },
			{ "type":1, "pos":{"x": -1.5, "y": 0.2, "z": -mapLength / 4}, "isUp": False },
			{ "type":1, "pos":{"x": -1.5, "y": 3.2, "z": -mapLength / 4}, "isUp": True },
			{ "type":1, "pos":{"x": 1.5, "y": 0.2, "z": -mapLength / 4}, "isUp": False },
			{ "type":1, "pos":{"x": 1.5, "y": 3.2, "z": -mapLength / 4}, "isUp": True }
	]

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
		self.score = [0, 0]
		self.obstacles = []

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

	def obstaclesInvLength(self):
		for x in self.obstacles:
			x["pos"]["z"] = -x["pos"]["z"]

	def genObstacles(self):
		for x in Game.wallsPos:
			if random.randint(1, 100) < 50:
				self.obstacles.append(x)
		i = 0
		while(i <  len(Game.jumpersPos)):
			if(random.randint(1, 100) < 50):
				self.obstacles.append(Game.jumpersPos[i])
				i+=1
			i+=1
		self.p1.sync_send({"type":"game", "content":{"action":7, "content":self.obstacles}})
		self.obstaclesInvLength()
		self.p2.sync_send({"type":"game", "content":{"action":7, "content":self.obstacles}})
		self.obstaclesInvLength()

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
			self.genObstacles()
			print("obstacles generated :", self.obstacles)
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
	
	async def scoreGoal(self, player):
		print("a player suffured from a major skill issue")
		self.score[player-1] += 1
		print("new score :", self.score)
		self.p1.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 2}})
		self.p2.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 1}})
		await asyncio.sleep(4.5)
		self.prepareGame(True)
		await asyncio.sleep(3)
		self.prepareGame()
		return;

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
			if(playerDistance >= -(Game.playerLength / 2) and playerDistance <= Game.playerLength / 2):
				velX = -((self.speed * 0.80) * (playerDistance / (Game.playerLength / 2)))
				velZ = self.speed - abs(velX)
				if(newBallPos[1] > 0):
					velZ = -velZ
			else:
				print("distance :", playerDistance)
				await self.scoreGoal(1 if newBallPos[1] < 0 else 2)
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
