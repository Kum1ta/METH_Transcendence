# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Tournament.py                                      :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 17:17:07 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 02:58:08 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import string
import asyncio
from .utils import genString

class Tournament:
	currentTournamentsLock = False
	currentTournaments = {}

	playerLimit = 8
	def __init__(self, socket):
		self.messages = []
		self.players = []
		while(Tournament.currentTournamentsLock):
			continue;
		Tournament.currentTournamentsLock = True
		self.genCode()
		Tournament.currentTournaments[self.code] = self
		Tournament.currentTournamentsLock = False
		self.join(socket)

	def genCode(self):
		nbChar = 4
		self.code = genString(nbChar, string.ascii_uppercase)
		nbIter = 0
		while(self.code in Tournament.currentTournaments):
			if(nbIter == 100):
				nbInter = 0
				nbChar += 1
			self.code = genString(nbChar, string.ascii_uppercase)
			nbIter += 1

	def broadcast(self, content):
		for x in self.players:
			x.sync_send("tournament",content)
	
	def sendAllInfo(self, socket):
		players = []
		for x in self.players:
			players.append({"id":x.id,"username":x.username, "pfp":x.pfp})
		socket.sync_send("tournament",{"action":5, "players":players, "messages" : self.messages})
		
	def sendMessage(self, socket, message):
		messages.append({"username":socket.username, "message":message})		
		if(len(messages) > 20):
			messages.pop(0)
		self.broadcast({"action":3, "username":socket.username, "message":socket.message})

	def leave(self, socket):
		if(socket not in self.players):
			return;
		index = self.players.index(socket)
		self.players.pop(index)
		socket.tournament = None
		self.broadcast({"action":2,"id":socket.id})

	def join(self, socket):
		if(socket.tournament != None):
			socket.sendError("already in a tournament", 9036)
			return
		if(len(self.players) == Tournament.playerLimit):
			socket.sync_send("tournament",{"action":0, "isFull":True})
			return
		socket.tournament = self 
		self.players.append(socket)
		socket.sync_send("tournament",{"action":0,"isFull":False, "isStarted":False,"exist":True, "code":self.code})
		self.broadcast({"action":1, "id":socket.id, "username": socket.username,"pfp":socket.pfp})
