# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    TournamentGame.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         # +#+#+#+#+#+   +#+            #
#    Created: 2024/10/12 22:49:00 by tomoron           #+#    #+#              #
#    Updated: 2024/10/15 13:36:34 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .Game import Game
import asyncio

class TournamentGame:
	def __init__(self, left, right, tournament):
		self.game = None
		self.winner = None
		self.tournament = tournament 
		self.right = right
		self.left = left
		asyncio.create_task(self.loop())

	def startGame(self):
		l = None
		r = None
		print("start new game")
		if(isinstance(self.left,TournamentGame)):
			self.game = Game(self.left.winner, self.right.winner, self.tournament.code)
			l = self.left.winner
			r = self.right.winner
		else:
			self.game = Game(self.left, self.right, self.tournament.code)
			l = self.left
			r = self.right
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
						await asyncio.sleep(3)
						self.startGame()	
				else:
					await asyncio.sleep(3)
					self.startGame()
			else:
				if(self.game.winner != None):
					print("game ended, winner is", self.game.pWinner.socket.username)
					p1Id = self.tournament.playerFromSocket(self.game.p1.socket)
					p2Id = self.tournament.playerFromSocket(self.game.p2.socket)
					self.tournament.addHistory(p1Id, p2Id, self.game.winner == 1)
					self.winner = self.game.pWinner
			await asyncio.sleep(1)
