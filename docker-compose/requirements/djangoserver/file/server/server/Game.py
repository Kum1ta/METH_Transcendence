# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42angouleme.fr>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/11/13 16:21:18 by tomoron           #+#    #+#              #
#    Updated: 2024/11/19 16:38:26 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from .Player import Player
from .models import GameResults, User
from .GameSettings import GameSettings
from .Bot import Bot
from .Ball import Ball
from typing import Union
import time
import json
import asyncio
import random
import math
from multimethod import multimethod

class Game:
	waitingForPlayer = None
	rankedWaitingForPlayer = []

	@multimethod
	def __init__(self, p1 , p2 , tournamentCode):
		self.initAttributes()
		self.p1 = p1
		self.p2 = p2
		if(isinstance(p1, Bot) and isinstance(p2, Bot)):
			self.winner=1
			self.pWinner=p1
			return
		elif(isinstance(p2,Bot)):
			self.p2,self.p1 = self.p1, self.p2
		self.withBot = isinstance(self.p1,Bot) 
		self.tournamentCode = tournamentCode
		p1.setGame(self)
		p2.setGame(self)
	
	def lookForRankedGame(self, socket):
		for x in Game.rankedWaitingForPlayer:
			if(abs(x.p1.socket.elo - socket.elo) < GameSettings.maxEloDiff):
				return(x)
		return(None)


	def rankedInit(self, socket, skinId, goalId):
		existingGame = self.lookForRankedGame(socket)
		self.ranked = True
		if(existingGame != None):
			existingGame.join(socket, skinId, goalId)
		else:
			self.join(socket, skinId, goalId)
			Game.rankedWaitingForPlayer.append(self)

	@multimethod
	def __init__(self, socket, withBot : bool, skinId : int, goalId :int , ranked = False, opponent = None):
		self.initAttributes()
		if(ranked):
			self.rankedInit(socket, skinId, goalId)
			return;
		self.withBot = withBot

		self.opponentLock = opponent
		if(withBot):
			self.p1 = Bot(self)
			self.join(socket, skinId, goalId)
		elif(opponent != None):
			if(opponent not in socket.onlinePlayers):
				return
			opponentGame = socket.onlinePlayers[opponent].game
			if (opponentGame != None and opponentGame.opponentLock != None and opponentGame.opponentLock == socket.id):
				socket.onlinePlayers[opponent].game.join(socket, skinId)
			else:
				self.join(socket, skinId, goalId)
				socket.onlinePlayers[opponent].sync_send({"type":"invitation","content":{"invitor":socket.id, "username":socket.username}})
		else:
			if(Game.waitingForPlayer == None):
				Game.waitingForPlayer = self
				socket.sync_send({"type":"game","content":{"action":0}})
				self.join(socket, skinId, goalId)
			else:
				Game.waitingForPlayer.join(socket, skinId, goalId)
				Game.waitingForPlayer = None

	def initAttributes(self):
		self.p1 = None
		self.p2 = None
		self.ranked = False
		self.tournamentCode = None
		self.started = False
		self.end = False
		self.left = None
		self.winner = None
		self.pWinner = None
		self.withBot = False
		self.gameStart = 0
		self.gameTime = 0
		self.opponentLock = None

		self.ball = Ball()
		self.speed = GameSettings.startSpeed
		self.score = [0, 0]
		self.obstacles = []
		self.lastWin = 2

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

	def join(self, socket, skin = 0, goal = 0):
		try:
			if(self.p1 == None):
				self.p1 = Player(socket)
				self.p1.setGame(self)
				self.p1.skin = skin
				self.p1.goal = goal
			else:
				if(self.opponentLock != None and self.opponentLock != socket.id):
					socket.sendError("You are not invited to this game", 9103)
					return
				self.p2 = Player(socket)
				self.p2.setGame(self)
				self.p2.skin = skin
				self.p2.goal = goal
			if(self.p2 != None and self.p1 != None):
				self.p1.socket.sync_send({"type":"game", "content":{"action":1,"id":self.p2.socket.id,"username":self.p2.socket.username, "skin":self.p2.skin, "goal":self.p2.goal, 'pfpOpponent':self.p2.socket.pfp, 'pfpSelf':self.p1.socket.pfp}})
				self.p2.socket.sync_send({"type":"game", "content":{"action":1,"id":self.p1.socket.id,"username":self.p1.socket.username, "skin":self.p1.skin, "goal":self.p1.goal, 'pfpOpponent':self.p1.socket.pfp, 'pfpSelf':self.p2.socket.pfp}})
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
			self.genObstacles()
			asyncio.create_task(self.gameLoop())
		return(1)

	def endGame(self, winner):
		if(self.end):
			return
		self.p1.socket.sync_send({"type":"game","content":{"action":10,"won":winner==1, "opponentLeft":self.left == 2, "tournamentCode":self.tournamentCode}})
		self.p2.socket.sync_send({"type":"game","content":{"action":10,"won":winner==2, "opponentLeft":self.left == 1, "tournamentCode":self.tournamentCode}})
		self.winner = winner
		self.pWinner = self.p1 if winner == 1 else self.p2
		self.end = True

	def leave(self, socket):
		if (self.p1 != None and socket == self.p1.socket):
			self.left = 1
			self.p1.setGame(None)
		else:
			self.left = 2
			if(self.p2 != None):
				self.p2.setGame(None)
		if(Game.waitingForPlayer == self):
			Game.waitingForPlayer = None
		if(self in Game.rankedWaitingForPlayer):
			Game.rankedWaitingForPlayer.remove(self)
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
			self.p1.pos["pos"] = self.p1.checkMovement(pos)
			if(self.p1.pos["pos"] != pos):
				self.p1.socket.sync_send("game",{"action":3, "pos":self.p1.pos["pos"], "up":up, "is_opponent":False})
			self.p1.pos["up"] = up
		else:
			self.p2.pos["pos"] = self.p2.checkMovement(-pos)
			if(self.p2.pos["pos"] != -pos):
				self.p2.socket.sync_send("game",{"action":3, "pos":-self.p2.pos["pos"], "up":up, "is_opponent":False})
			self.p2.pos["up"] = up
		if(opponent != None):
			opponent.sync_send({"type":"game","content":{"action":3, "pos":-pos, "up":up, "is_opponent":True}})

	def sendNewBallInfo(self, reset = False):
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
		winner = 1 if self.score[0] == GameSettings.maxScore else 2
		self.endGame(winner)
		return(True)

	async def scoreGoal(self, player):
		self.lastWin = player
		self.score[player-1] += 1
		self.p1.socket.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 2}})
		self.p2.socket.sync_send({"type":"game","content":{"action":6, "is_opponent": player == 1}})
		self.prepareGame(True);
		self.sendNewBallInfo(True);
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
			self.ball.setStartVel(self.lastWin == 1)
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
			if(sleep_time <= 0):
				self.prepareGame(True)
				await asyncio.sleep(3)
				self.prepareGame()
				continue
			if((time.time() - self.gameStart) - self.gameTime < sleep_time):
				await asyncio.sleep(sleep_time - ((time.time() - self.gameStart) - self.gameTime))
			self.gameTime += sleep_time
			goal = await self.ball.update(sleep_time, self.p1, self.p2)
			if(goal):
				await self.scoreGoal(goal)
			else:
				self.sendNewBallInfo()
		if(self.p1.socket.game == self):
			self.p1.setGame(None)
		if(self.p2.socket.game == self):
			self.p2.setGame(None)
		if(not self.withBot):
			await self.saveResults()
		if(self.ranked):
			await self.updateElo()
		del self


	def calcElo(self, playerElo, opponentElo, playerScore):
		expectedScore = 1 / 1 + (10**((opponentElo - playerElo) / 400))
		k = GameSettings.ratingAdjustmentHigh if playerElo < GameSettings.experiencedThreshold else GameSettings.ratingAdjustmentLow
		playerElo = playerElo + k * ((playerScore / GameSettings.maxScore) - expectedScore)
		return(playerElo)

	@sync_to_async
	def updateElo(self):
		try:
			if(self.winner == None):
				self.winner = 1
			if(self.left != None):
				self.score[self.left - 1] = 0
				self.score[1 if self.left == 2 else 2] = 5

			p1Elo = self.calcElo(self.p1.socket.elo, self.p2.socket.elo, self.score[0])
			p2Elo = self.calcElo(self.p2.socket.elo, self.p1.socket.elo, self.score[1])	
			
			p1DbUser = User.objects.get(id=self.p1.socket.id)
			p1DbUser.elo = p1Elo
			p1DbUser.save()
			self.p1.socket.elo = p1Elo
			self.p1.socket.scope["session"].elo = p1Elo
			self.p1.socket.scope["session"].save()

			p2DbUser = User.objects.get(id=self.p2.socket.id)
			p2DbUser.elo = p2Elo
			p2DbUser.save()
			self.p2.socket.elo = p2Elo
			self.p2.socket.scope["session"].elo = p2Elo
			self.p2.socket.scope["session"].save()
		except Exception as e:
			self.p1.socket.sendError("Couldn't update elo", 9104, e)
			self.p2.socket.sendError("Couldn't update elo", 9104, e)



	@sync_to_async
	def saveResults(self):
		try:
			if(self.winner == None):
				self.winner = 1
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
		except Exception as e:
			self.p1.socket.sendError("Couldn't save last game results", 9104, e)
			self.p2.socket.sendError("Couldn't save last game results", 9104, e)
