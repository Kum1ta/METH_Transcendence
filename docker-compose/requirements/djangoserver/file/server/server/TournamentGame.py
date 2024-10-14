# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    TournamentGame.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/12 22:49:00 by tomoron           #+#    #+#              #
#    Updated: 2024/10/14 20:10:13 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #
import asyncio
from .Game import Game

class TournamentGame:
	def __init__(self, left, right):
		self.game = None
		self.winner = None
		self.right = right
		self.left = left
		asyncio.create_task(self.loop())

	def startGame(self):
		l = None
		r = None
		if(isinstance(self.left,TournamentGame)):
			self.game = Game(self.left.winner, self.right.winner, True)
			l = self.left.winner.socket
			r = self.right.winner.socket
		else:
			self.game = Game(self.left, self.right, True)
			l = self.left.socket
			r = self.right.socket
		l.sync_send("tournament", {
			"action":4,
			"id": r.id,
			"username":r.username,
			"skin" : r.skin,
			"goal": r.goal,
			"pfp": r.pfp
		})
		r.sync_send("tournament", {
			"action":4,
			"id": l.id,
			"username": l.username,
			"skin" : l.skin,
			"goal": l.goal,
			"pfp": l.pfp
		})

	async def loop(self):
		while self.winner == None:
			if(self.game == None):
				if(isinstance(self.left, TournamentGame)):
					if(self.left.winner != None and self.right.winner != None):
						await asyncio.sleep(3)
						self.startGame()	
				else:
					await asyncio.sleep(3)
					self.startGame()
			else:
				if(self.game.winner != None):
					self.winner = self.game.pWinner
			await asyncio.sleep(1)
