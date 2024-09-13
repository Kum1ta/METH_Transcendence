# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Game.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 16:20:58 by tomoron           #+#    #+#              #
#    Updated: 2024/09/14 00:40:30 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import time
import json

class Game:
	waitingForPlayerLock = False
	waitingForPlayer = None
	def __init__(self, socket, withBot):
		self.p1 = None;
		self.p2 = None
		self.p1Ready = False
		self.p2Ready = False
		self.bot = withBot
		print("new game start")

		if(not withBot):
			print("no bot")
			while(Game.WaitingForPlayerLock):
				time.sleep(0.05)
			Game.waitingForPlayerLock = True
			if(Game.waitingForPlayer == None):
				print("no player waiting")
				Game.waitingForPlayer = self
				self.join(socket)
			else:
				print("player waiting")
				Game.waitingForPlayer.join(socket)
				Game.waitingForPlayer = None;
			Game.waitingForPlayerLock = False

	def join(self, socket):
		try:
			if(self.p1 == None):
				self.p1 = socket
			else:
				self.p2 = socket
			socket.game = self
			data = json.dumps({"type":"game", "content":{
				"action" : 0,
				"id": socket.id,
				"username": socket.username
			}})
			self.p1.send(text_data=data)
			if(self.p2 != None):
				self.p2.send(text_data=data)
		except Exception as e:
			socket.sendError("invalid request", 9005, e)

	def setReady(self, socket):
		print("ready request")
		if(socket == self.p1):
			self.p1Ready = True
			print("p1 ready")
		elif (socket == self.p2):
			self.p2Ready = True
			print("p2 ready")
		else:
			return(0)
		if(self.p1Ready and self.p2Ready):
			print("both ready, start game loop")
			self.game_loop();
		return(1)

	def game_loop(self):
		print("AAAAAAAAAAAAAAAAAAA")
