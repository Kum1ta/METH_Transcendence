# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Player.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 03:22:32 by tomoron           #+#    #+#              #
#    Updated: 2024/11/19 16:53:31 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import time
from .GameSettings import GameSettings

class Player():
	def __init__(self, socket):
		self.socket = socket 
		self.ready = False
		self.tournamentReady = False;
		self.lastMovement = time.time()
		self.pos = {"pos":0, "up": False}
		self.skin = 0
		self.goal = 0

	def __del__(self):

	def isTournamentReady(self):
		return(self.tournamentReady)

	def checkMovement(self, newPos):
		deltaTime = (time.time() - self.lastMovement)
		self.lastMovement = time.time()

		leftLimit = GameSettings.mapLimits["left"] + (GameSettings.playerLength / 2)
		rightLimit = GameSettings.mapLimits["right"] - (GameSettings.playerLength / 2)
		if(newPos < leftLimit - GameSettings.OOBTolerance or newPos > rightLimit + GameSettings.OOBTolerance):
			newPos = leftLimit if newPos < 0 else rightLimit
			return(newPos)

		if(abs(newPos - self.pos["pos"]) * (1 / deltaTime) > GameSettings.maxPlayerSpeed + GameSettings.playerSpeedTolerance):
			newMove = GameSettings.maxPlayerSpeed * deltaTime
			if(newPos - self.pos["pos"] < 0):
				newMove = -newMove
			newPos = self.pos["pos"] + newMove
			return(newPos)
		return(newPos)
			
	
	def setGame(self, game):
		self.ready = False;
		self.tournamentReady = False;
		self.game = game
		self.socket.game = game
