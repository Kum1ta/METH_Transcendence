# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    GameSettings.py                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/06 16:33:56 by tomoron           #+#    #+#              #
#    Updated: 2024/10/16 14:12:50 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class GameSettings:
	ballRadius = 0.15
	playerLength = 1 + (ballRadius * 4)
	limits = {
		"left" : -3.5 + ballRadius,
		"right" : 3.5 - ballRadius,
		"back" : -6.25 + ballRadius,
		"front" : 6.25 - ballRadius
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
	nbSkins = 8
	nbGoals = 4
	wallLength = 1
	wallWidth = 0.05
	bounceSpeedIncrease = 0.2
	maxScore = 2

	maxPlayerSpeed = 6
	noBotMovement = False
