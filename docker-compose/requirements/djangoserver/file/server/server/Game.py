# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 16:20:58 by tomoron           #+#    #+#              #
#    Updated: 2024/09/14 21:30:54 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import time
import json
import asyncio

class Game:
	waitingForPlayerLock = False
	waitingForPlayer = None
	def __init__(self, socket, withBot):
		self.p1 = None
		self.p2 = None
		self.p1Ready = False
		self.p2Ready = False
		self.bot = withBot
		self.started = False
		self.playerLeft = False
		self.end = False

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

	def join(self, socket):
		try:
			if(self.p1 == None):
				self.p1 = socket
			else:
				self.p2 = socket
			socket.game = self
			if(self.p2 != None and self.p1 != None):
				data = json.dumps({"type":"game", "content":{
					"action" : 1,
					"id": socket.id,
					"username": socket.username
				}})
				self.p1.sync_send(data)
				self.p2.sync_send(data)
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
			asyncio.create_task(self.gameLoop())
		return(1)
	
	def leave(self, socket):
		socket.game = None
		if(socket == self.p1):
			self.p1 = None
			self.p1Ready =False
		elif(socket == self.p2):
			self.p2 = None
			self.p2Ready =False
		if(not self.started):
			while(Game.waitingForPlayerLock):
				time.sleep(0.05)
			Game.waitingForPlayerLock = True
			if(Game.waitingForPlayer == self):
				Game.waitingForPlayer = None
			if(self.p1 != None or self.p2 != None):
				Game.waitingForPlayer = self
			Game.waitingForPlayerLock = False
		self.playerLeft = True

	def sendPlayers(self, data):
		data_raw = json.dumps({"type":"game","content":data})
		self.p1.sync_send(data_raw)
		self.p2.sync_send(data_raw)

	async def gameLoop(self):
		self.started = True
		self.sendPlayers({"action":2})
		while(not self.end):
			print("AAAAAAAAAAAAAAAAAAA")
			await asyncio.sleep(1)
			if(self.playerLeft):
				self.end = True
				print("A player left, stopping the game. (i know it's a very beautiful and complete game)")
