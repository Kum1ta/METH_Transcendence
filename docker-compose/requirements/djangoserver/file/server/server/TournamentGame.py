# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    TournamentGame.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42angouleme.fr>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/22 01:37:00 by tomoron           #+#    #+#              #
#    Updated: 2024/11/14 13:59:35 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .Game import Game
from .GameSettings import GameSettings
import asyncio

class TournamentGame:
	def __init__(self, left, right, tournament):
		self.game = None
		self.winner = None
		self.tournament = tournament 
		self.right = right
		self.left = left
		asyncio.create_task(self.loop())

	async def startGame(self):
		l = None
		r = None
		print("start new game")
		if(isinstance(self.left,TournamentGame)):
			l = self.left.winner
			r = self.right.winner
		else:
			l = self.left
			r = self.right
		nbLoop = 0
		while (not l.isTournamentReady() or not r.isTournamentReady()) and nbLoop < GameSettings.maxTimePlayerWait * 10:
			print("waiting for player")
			nbLoop += 1
			await asyncio.sleep(0.1)
		if(not l.socket.tournament == self.tournament  or not r.socket.tournament == self.tournament):
			print("player is not online, opponent is winner")
			self.winner = l if l.socket.online else r
			return;
		await asyncio.sleep(3)
		self.game = Game(l, r, self.tournament.code)
		l.socket.sync_send("tournament", {
			"action":4,
			"id": r.socket.id,
			"pfp": r.socket.pfp,
			"username":r.socket.username,
			"skin" : r.skin,
			"goal": r.goal,
			"selfPfp": l.socket.pfp,
		})
		r.socket.sync_send("tournament", {
			"action":4,
			"id": l.socket.id,
			"pfp": l.socket.pfp,
			"username": l.socket.username,
			"skin" : l.skin,
			"goal": l.goal,
			"selfPfp": r.socket.pfp,
		})

	async def loop(self):
		while self.winner == None:
			if(self.game == None):
				if(isinstance(self.left, TournamentGame)):
					if(self.left.winner != None and self.right.winner != None):
						await self.startGame()	
				else:
					await self.startGame()
			else:
				if(self.game.winner != None):
					print("game ended, winner is", self.game.pWinner.socket.username)
					p1Id = self.tournament.playerFromSocket(self.game.p1.socket)
					p2Id = self.tournament.playerFromSocket(self.game.p2.socket)
					self.tournament.addHistory(p1Id, p2Id, self.game.winner == 1)
					self.winner = self.game.pWinner
			await asyncio.sleep(1)
