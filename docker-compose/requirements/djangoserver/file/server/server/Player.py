# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Player.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 03:22:32 by tomoron           #+#    #+#              #
#    Updated: 2024/10/20 15:37:20 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class Player():
	def __init__(self, socket):
		self.socket = socket 
		self.ready = False
		self.tournamentReady = False;
		self.pos = {"pos":0, "up": False}
		self.skin = 0
		self.goal = 0

	def __del__(self):
		print("player destroy")

	def isTournamentReady(self):
		return(self.tournamentReady)
	
	def setGame(self, game):
		self.ready = False;
		self.tournamentReady = False;
		self.game = game
		self.socket.game = game
