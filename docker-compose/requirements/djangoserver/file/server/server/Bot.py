# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Bot.py                                             :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42angouleme.fr>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/19 18:29:36 by tomoron           #+#    #+#              #
#    Updated: 2024/10/19 22:41:25 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .Ball import Ball
from .Player import Player
from .DummySocket import DummySocket
from .GameSettings import GameSettings
import random
import asyncio
import time


class Bot(Player):
	def __init__(self, game=None, tournament=None):
		self.socket = DummySocket(game)
		self.game = game
		self.tournament = tournament
		self.ready = True
		self.pos = {"pos":0, "up": False}
		self.lastCalculated = {"pos":0, "up":False}
		self.objective = {"pos":0, "up": False}
		self.skin = 0
		self.goal = 0
		if(GameSettings.BotMovement):
			asyncio.create_task(self.updateLoop())
			asyncio.create_task(self.goToObjectiveLoop())
		print("I am a bot, boop boop beep boop")

	def createTempBall(self):
		res = Ball()
		res.setObstacles(self.game.obstacles)
		res.vel = self.game.ball.vel.copy()
		res.pos = self.game.ball.pos.copy()
		res.up = self.game.ball.up
		res.speed = self.game.ball.speed
		return(res)

	def genRandomBallDirection(self, pos, up, center):
		if(self.lastCalculated["pos"] == pos and self.lastCalculated["up"] == up):
			return(self.objective)
		self.lastCalculated = {"pos":pos, "up" : up}
		if(not center):
			offset = random.randint(-99, 99) / 100
			if(offset == 0):
				offset = 0.1
			pos += offset * (GameSettings.playerLength / 2)
		return({"pos":pos, "up":up})


	async def getExpectedPos(self):
		tempBall = self.createTempBall()
		hit = 0
		i = 0
		while(not hit):
			sleepTime = tempBall.getSleepTime()
			hit = await tempBall.update(sleepTime, self, self.game.p2, True)
			i += 1
			if(i == 50):
				self.objective = self.genRandomBallDirection(0, 0, True) 
				return
		self.objective = self.genRandomBallDirection(tempBall.pos[0], tempBall.up, False)
	
	def isEnd(self):
		if(self.tournament != None):
			return(self.tournament.end)
		elif(self.game != None):
			return(self.game.end)
		else:
			return(False)

	async def updateLoop(self):
		while not self.isEnd():
			if(self.game):
				await self.getExpectedPos()
			await asyncio.sleep(1)

	async def goToObjectiveLoop(self):
		lastUpdate = time.time()
		while not self.isEnd():
			if(self.pos["pos"] != self.objective["pos"] or self.pos["up"] != self.objective["up"]):
				self.pos["up"] = self.objective["up"]

				maxDistance = GameSettings.maxPlayerSpeed * (time.time() - lastUpdate)
				print("maxDistance :", maxDistance)
				travel = self.objective["pos"] - self.pos["pos"]
				if(travel >= 0):
					travel = min(self.objective["pos"] - self.pos["pos"], maxDistance)
				else:
					travel = max(self.objective["pos"] - self.pos["pos"], -maxDistance)
				print("travel :", travel)
				self.game.move(self.socket, self.pos["pos"] + travel, self.pos["up"])
			lastUpdate = time.time()
			await asyncio.sleep(1 / 20)

	def setGame(self, game):
		self.game = game
		self.socket.game = game
