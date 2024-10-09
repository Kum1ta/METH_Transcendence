# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 16:20:58 by tomoron           #+#    #+#              #
#    Updated: 2024/10/09 07:06:00 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from .Player import Player
from .models import GameResults, User
from .GameSettings import GameSettings
from .Bot import Bot
from .Ball import Ball
import time
import json
import asyncio
import random
import math

class Game:
	waitingForPlayer = None

	def __init__(self, socket, withBot, skinId = 0, opponent = None):
		self.p1 = None
		self.p2 = None
		self.started = False
		self.end = False
		self.left = None
		self.winner = None
		self.gameStart = 0
		self.gameTime = 0

		self.ball = Ball()
		self.speed = GameSettings.startSpeed
		self.score = [0, 0]
		self.obstacles = []
		self.lastWin = 2

		self.opponentLock = opponent
		if(1 or withBot):
			self.p1 = Bot(self)
			self.join(socket, skinId)
		elif(opponent != None):
			if(opponent not in socket.onlinePlayers):
				return
			opponentGame = socket.onlinePlayers[opponent].game
			if (opponentGame != None and opponentGame.opponentLock != None and opponentGame.opponentLock == socket.id):
				socket.onlinePlayers[opponent].game.join(socket, skinId)
			else:
				self.join(socket, skinId)
				socket.onlinePlayers[opponent].sync_send({"type":"invitation","content":{"invitor":socket.id, "username":socket.username}})
		else:
			if(Game.waitingForPlayer == None):
				Game.waitingForPlayer = self
				socket.sync_send({"type":"game","content":{"action":0}})
				self.join(socket, skinId)
			else:
				Game.waitingForPlayer.join(socket, skinId)
				Game.waitingForPlayer = None

	def __del__(self):
		print("game destroy")

	def obstaclesInvLength(self):
		for x in self.obstacles:
			x["pos"]["z"] = -x["pos"]["z"]
			x["pos"]["x"] = -x["pos"]["x"]

	def genObstacles(self):
		for x in GameSettings.wallsPos:
			if random.randint(1, 100) < 100:
				self.obstacles.append(x)
		i = 0
		down = False
		while(i < len(GameSettings.jumpersPos) - 2):
			if(random.randint(1, 100) < 50):
				self.obstacles.append(GameSettings.jumpersPos[i])
				down = True
			else:
				self.obstacles.append(GameSettings.jumpersPos[i + 1])
			i+=2
		if not down:
			self.obstacles.append(GameSettings.jumpersPos[i])
		else:
			self.obstacles.append(GameSettings.jumpersPos[i + 1])

		self.ball.setObstacles(self.obstacles)
		self.p1.socket.sync_send({"type":"game", "content":{"action":7, "content":self.obstacles}})
		self.obstaclesInvLength()
		self.p2.socket.sync_send({"type":"game", "content":{"action":7, "content":self.obstacles}})
		self.obstaclesInvLength()

	def join(self, socket, skin = 0):
		try:
			if(self.p1 == None):
				print("game created, set as player 1")
				self.p1 = Player(socket, self)
				self.p1.skin = skin
			else:
				if(self.opponentLock != None and self.opponentLock != socket.id):
					socket.sendError("You are not invited to this game", 9103)
					return
				print("joined game, set as player 2")
				self.p2 = Player(socket, self)
				self.p2.skin = skin
			if(self.p2 != None and self.p1 != None):
				print("both players here, send opponent to both players")
				self.p1.socket.sync_send({"type":"game", "content":{"action":1,"id":self.p2.socket.id,"username":self.p2.socket.username, "skin":self.p2.skin, 'pfpOpponent':self.p2.socket.pfp, 'pfpSelf':self.p1.socket.pfp}})
				self.p2.socket.sync_send({"type":"game", "content":{"action":1,"id":self.p1.socket.id,"username":self.p1.socket.username, "skin":self.p1.skin, 'pfpOpponent':self.p1.socket.pfp, 'pfpSelf':self.p2.socket.pfp}})
		except Exception as e:
			socket.sendError("invalid request", 9005, e)

	async def setReady(self, socket):
		if(socket == self.p1.socket):
			self.p1.ready = True
		elif (socket == self.p2.socket):
			self.p2.ready = True
		else:
			return(0)
		if(self.p1.ready and self.p2.ready):
			print("both players are ready, starting game")
			self.genObstacles()
			print("obstacles generated :", self.obstacles)
			asyncio.create_task(self.gameLoop())
		return(1)

	def endGame(self, winner):
		if(self.end):
			return
		self.p1.socket.sync_send({"type":"game","content":{"action":10,"won":winner==1, "opponentLeft":self.left == 2}})
		self.p2.socket.sync_send({"type":"game","content":{"action":10,"won":winner==2, "opponentLeft":self.left == 1}})
		self.winner = winner
		self.end = True

	def leave(self, socket):
		socket.game = None
		if (socket == self.p1.socket):
			self.left = 1
		else:
			self.left = 2
		if(Game.waitingForPlayer == self):
			Game.waitingForPlayer = None
		if(self.p2 != None):
			self.endGame(1 if self.left == 2 else 2)
		self.end=True

	def sendPlayers(self, data):
		data_raw = json.dumps({"type":"game","content":data})
		self.p1.socket.sync_send(data_raw)
		self.p2.socket.sync_send(data_raw)

	def move(self, socket, pos, up):
		opponent = self.p1.socket if socket != self.p1.socket else self.p2.socket
		if(socket == self.p1.socket):
			self.p1.pos["pos"] = pos
			self.p1.pos["up"] = up
		else:
			self.p2.pos["pos"] = -pos
			self.p2.pos["up"] = up
		if(opponent != None):
			opponent.sync_send({"type":"game","content":{"action":3, "pos":-pos, "up":up, "is_opponent":True}})

	def sendNewBallInfo(self, reset = False):
		print("send new ball info")
		if(reset):
			self.gameTime = 0
		if(self.p1.socket):
			self.p1.socket.sync_send({"type":"game", "content":{"action":5,
				"pos" : [self.ball.pos[0],self.ball.pos[1]],
				"velocity":[self.ball.vel[0], self.ball.vel[1]],
				"game_time":self.gameTime * 1000
			}})
		if(self.p2.socket):
			self.p2.socket.sync_send({"type":"game","content":{"action":5,
				"pos" : [-self.ball.pos[0],-self.ball.pos[1]],
				"velocity":[-self.ball.vel[0], -self.ball.vel[1]],
				"game_time":self.gameTime * 1000
			}})

	def checkGameEndGoal(self):
		if(self.score[0] < GameSettings.maxScore and self.score[1] < GameSettings.maxScore):
			return(False)
		print("someone won the game")
		winner = 1 if self.score[0] == GameSettings.maxScore else 2
		print("player", winner,"won the game")
		self.endGame(winner)
		return(True)

	async def scoreGoal(self, player):
		self.lastWin = player
		print("a player suffured from a major skill issue")
		self.score[player-1] += 1
		print("new score :", self.score)
		self.p1.socket.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 2}})
		self.p2.socket.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 1}})
		await asyncio.sleep(4.5)
		if(self.checkGameEndGoal()):
			return
		self.prepareGame(True)
		await asyncio.sleep(3)
		self.prepareGame()
		return

	def prepareGame(self, stop = False):
		self.speed = GameSettings.startSpeed
		self.ball.default()
		if(stop):
			self.ball.vel = [0, 0]
		else:
			self.ball.setStartVel(self.lastWin == 2)
		self.sendNewBallInfo(True)
		self.gameStart = time.time()

	async def gameLoop(self):
		self.started = True
		self.sendPlayers({"action":2})
		self.prepareGame(True)
		await asyncio.sleep(3)
		self.prepareGame()
		while(not self.end):
			sleep_time = self.ball.getSleepTime()
			print("sleep time : " , sleep_time)
			if((time.time() - self.gameStart) - self.gameTime < sleep_time):
				await asyncio.sleep(sleep_time - ((time.time() - self.gameStart) - self.gameTime))
			self.gameTime += sleep_time
			goal = await self.ball.update(sleep_time, self.p1, self.p2)
			if(goal):
				await self.scoreGoal(goal)
			else:
				self.sendNewBallInfo()
		print("game end")
		if(self.p1.socket.game == self):
			self.p1.socket.game = None
		if(self.p2.socket.game == self):
			self.p2.socket.game = None
		await self.saveResults()
		del self

	@sync_to_async
	def saveResults(self):
		try:
			if(self.winner == None):
				print("unkown winner, setting to 1")
				self.winner = 1
			print("saving results")
			p1DbUser = User.objects.get(id=self.p1.socket.id)
			p2DbUser = User.objects.get(id=self.p2.socket.id)
			results = GameResults.objects.create(
				player1 = p1DbUser,
				player2 = p2DbUser,
				p1Score = self.score[0],
				p2Score = self.score[1],
				winner = p1DbUser if self.winner == 1 else p2DbUser,
				forfeit = self.left != None
			)
			results.save()
			print("results saved")
		except Exception as e:
			self.p1.socket.sendError("Couldn't save last game results", 9104, e)
			self.p2.socket.sendError("Couldn't save last game results", 9104, e)
