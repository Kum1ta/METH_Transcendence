# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Bot.py                                             :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 03:54:20 by tomoron           #+#    #+#              #
#    Updated: 2024/10/08 10:20:50 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .Ball import Ball
from .Player import Player
from .DummySocket import DummySocket
from .GameSettings import GameSettings
import asyncio

class Bot(Player):
	def __init__(self, game):
		self.socket = DummySocket(game)
		self.game = game
		self.ready = True
		self.pos = {"pos":0, "up": False}
		self.skin = 0
		asyncio.create_task(self.updateLoop())
		print("I am a bot, boop boop beep boop")

	def createTempBall(self):
		res = Ball()
		res.setObstacles(self.game.obstacles)
		res.vel = self.game.ball.vel.copy()
		res.pos = self.game.ball.pos.copy()
		res.up = self.game.ball.up
		res.speed = self.game.ball.speed
		return(res)

	async def getExpectedPos(self):
		tempBall = self.createTempBall()
		hit = 0
		i = 0
		while(not hit):
			sleepTime = tempBall.getSleepTime()
			hit = await tempBall.update(sleepTime, self, self.game.p2, True)
			i += 1
			if(i == 50):
				print("too many bounces")
				return;
		print("p1 hit at :", tempBall.pos[0])
		self.game.move(self.socket, tempBall.pos[0], tempBall.up)

	async def updateLoop(self):
		while not self.game.end:
			pos = await self.getExpectedPos()
			await asyncio.sleep(1)

