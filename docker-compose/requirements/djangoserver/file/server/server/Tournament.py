# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Tournament.py                                      :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 17:17:07 by tomoron           #+#    #+#              #
#    Updated: 2024/10/15 19:01:39 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import string
import asyncio
from .Bot import Bot
from .Player import Player
from .utils import genString
from .TournamentGame import TournamentGame

class Tournament:
	currentTournaments = {}

	playerLimit = 8
	levels = 3 
	def __init__(self, socket, nbBot, skin, goal):
		self.messages = []
		self.players = []
		self.nbBot = nbBot
		self.end = False
		self.genCode()
		Tournament.currentTournaments[self.code] = self
		self.join(socket, skin, goal)

	def genCode(self):
		nbChar = 4
		self.code = genString(nbChar, string.ascii_uppercase)
		nbIter = 0
		while(self.code in Tournament.currentTournaments):
			if(nbIter == 100):
				nbIter = 0
				nbChar += 1
			self.code = genString(nbChar, string.ascii_uppercase)
			nbIter += 1

	def broadcast(self, content):
		for x in self.players:
			x.socket.sync_send("tournament",content)
	
	def sendAllInfo(self, socket):
		players = []
		for x in range(len(self.players)):
			players.append({"id":x,"username":self.players[x].socket.username, "pfp":self.players[x].socket.pfp})
		socket.sync_send("tournament",{"action":5, "players":players, "messages" : self.messages})
		
	def sendMessage(self, socket, message):
		self.messages.append({"username":socket.username, "message":message})
		if(len(self.messages) > 20):
			self.messages.pop(0)
		self.broadcast({"action":3, "username":socket.username, "message":message})

	def playerFromSocket(self, socket):
		for x in range(len(self.players)):
			if(self.players[x].socket == socket):
				return(x)
		return(-1)

	def leave(self, socket):
		index = self.playerFromSocket(socket)
		if(index == -1):
			return;
		self.players.pop(index)
		socket.tournament = None
		self.broadcast({"action":2,"id":index})

	def join(self, socket, skin=0, goal=0, isBot=False):
		if(not isBot and socket.tournament != None):
			socket.sendError("already in a tournament", 9036)
			return
		if(not isBot and len(self.players) == Tournament.playerLimit):
			socket.sync_send("tournament",{"action":0, "isFull":True})
			return
		if(isBot):
			player = Bot(None, self)
			socket = player.socket
		else:
			player = Player(socket)
		player.skin = skin
		player.goal = goal
		socket.tournament = self 
		self.players.append(player)
		socket.sync_send("tournament",{"action":0, "code":self.code})
		self.broadcast({"action":1, "id":len(self.players) - 1, "username": socket.username,"pfp":socket.pfp})
		if(len(self.players) == Tournament.playerLimit):
			self.start()
		if(len(self.players) == Tournament.playerLimit - self.nbBot):
			for x in range(self.nbBot):
				self.join(None, 0, 0, True)

	def createGames(self, players, level=1):
		left = None
		right = None
		if(level == Tournament.levels):
			try:
				right = players.pop(0)
				left = players.pop(0)
			except IndexError:
				pass
		else:
			right = self.createGames(players, level + 1)
			left = self.createGames(players, level + 1)
		return(TournamentGame(left, right, self.code))

	def start(self):
		self.started = True
		self.finalGame = self.createGames(self.players.copy())
		asyncio.create_task(self.tournamentLoop())

	async def tournamentLoop(self):
		while self.finalGame.winner == None:
			await asyncio.sleep(1)
		print("tournament done, winner is ", self.finalGame.winner.socket.username)
		


