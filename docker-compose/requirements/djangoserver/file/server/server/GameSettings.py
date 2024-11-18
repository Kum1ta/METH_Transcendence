# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    GameSettings.py                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/06 16:33:56 by tomoron           #+#    #+#              #
#    Updated: 2024/11/18 19:14:37 by hubourge         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class GameSettings:
	ballRadius = 0.15
	playerLength = 1
	ballPlayerLength = playerLength + (ballRadius * 4)
	mapLimits = {
		"left" : -3.5,
		"right" : 3.5,
		"back" : -6.25,
		"front" : 6.25
	}
	mapLength = 13
	startSpeed = 6
	jumperRadius = 0.2
	wallsPos = [
			{ "type":2, "pos": {"x": 1, "y": 0, "z": 1}, "isUp": False},
			{ "type":2, "pos": {"x": 1, "y": 0, "z": 1}, "isUp": True},
   			{ "type":2, "pos": {"x": -1, "y": 0, "z": 1}, "isUp": False},
			{ "type":2, "pos": {"x": -1, "y": 0, "z": 1}, "isUp": True}
	]
	jumpersPos = [
			{ "type":1, "name":"J0", "pos":{"x": -1.5, "y": 0.2, "z":mapLength/4}, "isUp": False },
			{ "type":1, "name":"J1", "pos":{"x": -1.5, "y": 3.2, "z": mapLength / 4}, "isUp": True },
			{ "type":1, "name":"J2", "pos":{"x": 1.5, "y": 0.2, "z": mapLength / 4}, "isUp": False },
			{ "type":1, "name":"J3", "pos":{"x": 1.5, "y": 3.2, "z": mapLength / 4}, "isUp": True },
			{ "type":1, "name":"J4", "pos":{"x": -1.5, "y": 0.2, "z": -mapLength / 4}, "isUp": False },
			{ "type":1, "name":"J5", "pos":{"x": -1.5, "y": 3.2, "z": -mapLength / 4}, "isUp": True },
			{ "type":1, "name":"J6", "pos":{"x": 1.5, "y": 0.2, "z": -mapLength / 4}, "isUp": False },
			{ "type":1, "name":"J7", "pos":{"x": 1.5, "y": 3.2, "z": -mapLength / 4}, "isUp": True }
	]
	# jumpersPos = [{"type":1, "name":"J"+str(i), "pos":{"x": 1.5 if i & 2 else -1.5, "y": 3.2 if i & 1 else 0.2, "z": -mapLength/4 if i & 4 else mapLength/4}, "isUp": True if i & 1 else False} for i in range(8)]
	nbSkins = 8
	nbGoals = 4
	wallLength = 1
	wallWidth = 0.05
	bounceSpeedIncrease = 0.2
	maxScore = 3

	maxPlayerSpeed = 4
	playerSpeedTolerance = 0.5
	BotMovement = True 
	maxTimePlayerWait = 10

	OOBTolerance = 0.01

	maxEloDiff = 100
	ratingAdjustmentHigh = 30 
	ratingAdjustmentLow = 10
	experiencedThreshold = 500 
