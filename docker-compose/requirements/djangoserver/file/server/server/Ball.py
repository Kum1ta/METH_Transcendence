# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Ball.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/06 03:24:10 by tomoron           #+#    #+#              #
#    Updated: 2024/11/19 16:38:30 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .GameSettings import GameSettings
import random
import math

class Ball:
	def __init__(self):
		self.default()
		self.obstacles = []

	def setStartVel(self, inv):
		self.speed = GameSettings.startSpeed
		self.vel[0] = self.speed * (random.randint(-50, 50) / 100)
		self.vel[1] = self.speed - abs(self.vel[0])
		if(inv):
			self.vel[1] = -self.vel[1]

	def default(self):
		self.pos = [0, 0]
		self.up = False
		self.vel = [0, 0]
		self.speed = GameSettings.startSpeed

	def setObstacles(self, obstacles):
		self.obstacles = obstacles


	def jumperCollisionDistanceX(self, jumper):
		jpos = (jumper["pos"]["x"], jumper["pos"]["z"])
		pos1 = self.pos
		pos2 = self.pos[0] + self.vel[0], self.pos[1] + self.vel[1]
		slope = 0
		slope = (pos1[1] - pos2[1])/(pos1[0] - pos2[0])
		offset = pos1[1] - (slope * pos1[0])

		#salagadou la menchikabou la bibidi bobidi bou
		a = 1 + (slope ** 2)
		b = ((-jpos[0]) * 2) + (2 * (slope * (-jpos[1] + offset)))
		c = (((-jpos[0]) ** 2) + (((-jpos[1]) + offset) ** 2)) - (GameSettings.jumperRadius ** 2)

		disc = (b ** 2) - (4 * a * c)
		if(disc < 0):
			return None
		res = (((-b) + math.sqrt(disc)) / ( 2 * a )) + (((-b) - math.sqrt(disc)) / ( 2 * a ))
		return(res / 2)

	def wallColisionDistanceX(self, wall):
		wpos = wall["pos"]["x"]
		pos1 = self.pos
		pos2 = self.pos[0] +self.vel[0], self.pos[1] + self.vel[1]
		slope = 0
		if(abs(pos1[1]) <= (GameSettings.wallWidth / 2) + GameSettings.ballRadius):
			return(None)
		slope = (pos1[1] - pos2[1])/(pos1[0] - pos2[0])
		offset = pos1[1] - (slope * pos1[0])

		if(slope == 0):
			return(None)

		wallSide = (GameSettings.wallWidth / 2) + GameSettings.ballRadius
		if(self.pos[1] < 0):
			wallSide *= -1
		hitPos = (wallSide - offset) / slope
		relPos = wpos - hitPos
		if(abs(relPos) < (GameSettings.wallLength / 2) + GameSettings.ballRadius):
			return(hitPos)
		return(None)

	def colisionTimeX(self):
		min_time = -1
		for x in self.obstacles:
			if x["isUp"] != self.up:
				continue
			pos = None
			if x["type"] == 1:
				pos = self.jumperCollisionDistanceX(x)
			elif x["type"] == 2:
				pos = self.wallColisionDistanceX(x)
			if(pos == None):
				continue
			dist = pos - self.pos[0]
			time = 0
			if(self.vel[0] != 0):
				time = dist / self.vel[0]
			else:
				time = -1
			if(time > 0):
				if(min_time < 0):
					min_time = time
				else:
					min_time = (min(min_time, time))

		wallsTime = self.getTimeUntilWallColision("left","right", self.pos[0], self.vel[0])
		if(wallsTime < 0):
			return(min_time)
		if(min_time < 0):
			return(wallsTime)
		return(min(min_time, wallsTime))

	def getTimeUntilWallColision(self, limitNeg, limitPos, position, velocity):
		if(not velocity):
			return(-1)
		limit = GameSettings.mapLimits[limitNeg] + GameSettings.ballRadius if velocity < 0 else GameSettings.mapLimits[limitPos] - GameSettings.ballRadius
		wallDistance = max(limit, position) - min(limit, position)
		colision_time = wallDistance / abs(velocity)
		return(colision_time)

	def wallColisionDistanceY(self, wall):
		wallSide = (GameSettings.wallWidth / 2) + GameSettings.ballRadius
		if(self.vel[1] > 0):
			wallSide *= -1
		relPos = wall["pos"]["x"] - self.pos[0] 
		if(abs(relPos) < (GameSettings.wallLength / 2) + GameSettings.ballRadius):
			return(wallSide)
		return(None)

	def jumperColisionDistanceY(self, jumper):
		relPos = jumper["pos"]["x"] - self.pos[0] 
		if(abs(relPos) <= GameSettings.jumperRadius):
			return(jumper["pos"]["z"])
		return(None)

	def colisionTimeY(self, checkObstacles):
		wallsTime = self.getTimeUntilWallColision("back","front", self.pos[1], self.vel[1])
		if(not checkObstacles):
			return(wallsTime)

		min_time = -1
		for x in self.obstacles:
			if x["isUp"] != self.up:
				continue
			pos = None
			if x["type"] == 1:
				pos = self.jumperColisionDistanceY(x)
			elif x["type"] == 2:
				pos = self.wallColisionDistanceY(x)
			if(pos == None):
				continue
			dist = pos - self.pos[1]
			time = 0
			if(self.vel[1] != 0):
				time = dist / self.vel[1]
			else:
				time = -1
			if(time > 0):
				if(min_time < 0):
					min_time = time
				else:
					min_time = (min(min_time, time))
		if(min_time < 0):
			return(wallsTime)
		if(wallsTime < 0):
			return(min_time)
		return(min(wallsTime, min_time))

	def getSleepTime(self):
		try:
			timeX = self.colisionTimeX()
		except ZeroDivisionError:
			timeX = -1
		timeY = self.colisionTimeY(timeX < 0)
		if(timeX < 0):
			return(timeY)
		if(timeY < 0):
			return(timeX)
		return(min(timeX, timeY))

	def getPlayerDistance(self, player, ballPos):
		playerPos = player["pos"]
		return(playerPos - ballPos[0])

	def twoPointsDistance(self, pos1, pos2):
		return(math.sqrt(((pos2[0] - pos1[0]) ** 2) + ((pos2[1] - pos1[1]) ** 2)))

	def checkJumpersDistance(self, ballPos, p1, p2, noMsg):
		for i in range(0, len(self.obstacles)):
			if(self.obstacles[i]["type"] != 1):
				continue
			if(self.obstacles[i]["isUp"] != self.up):
				continue
			if(self.twoPointsDistance((self.obstacles[i]["pos"]["x"], self.obstacles[i]["pos"]["z"]), ballPos) < GameSettings.jumperRadius):
				if(p1.socket != None and not noMsg):
					p1.socket.sync_send({"type":"game", "content":{"action":8,"name":self.obstacles[i]["name"]}})
				if(p2.socket != None and not noMsg):
					p2.socket.sync_send({"type":"game", "content":{"action":8,"name":self.obstacles[i]["name"]}})
				self.up = not self.up

	def checkWallsColision(self, ballPos):
		for i in range(0, len(self.obstacles)):
			if(self.obstacles[i]["type"] != 2):
				continue
			if(self.obstacles[i]["isUp"] != self.up):
				continue
			if(abs(ballPos[1]) <= (GameSettings.wallWidth / 2) + GameSettings.ballRadius + 0.001):
				if(abs(self.obstacles[i]["pos"]["x"] - ballPos[0]) < (GameSettings.wallLength / 2) + GameSettings.ballRadius):
					return(True)
		return(False)

	def increaseSpeed(self):
		self.vel[0] += (GameSettings.bounceSpeedIncrease * (self.vel[0] / self.speed))
		self.vel[1] += (GameSettings.bounceSpeedIncrease * (self.vel[1] / self.speed))
		self.speed += GameSettings.bounceSpeedIncrease

	async def update(self, delta, p1, p2, p1Hit = False):
		self.pos[0] += (delta * self.vel[0])
		self.pos[1] += (delta * self.vel[1])
		if(self.pos[1] <= GameSettings.mapLimits["back"] + GameSettings.ballRadius + 0.001 or self.pos[1] >= (GameSettings.mapLimits["front"] - GameSettings.ballRadius) - 0.001):
			player = p2.pos if self.pos[1] < 0 else p1.pos
			if(self.pos[1] > 0 and p1Hit):
				return(1)
			playerDistance = self.getPlayerDistance(player, self.pos)
			if(playerDistance >= -(GameSettings.ballPlayerLength / 2) and playerDistance <= GameSettings.ballPlayerLength / 2 and player["up"] == self.up):
				self.vel[0] = -((self.speed * 0.80) * (playerDistance / (GameSettings.ballPlayerLength / 2)))
				self.vel[1] = self.speed - abs(self.vel[0])
				if(self.pos[1] > 0):
					self.vel[1] = -self.vel[1]
				if(p1.socket != None and not p1Hit):
					p1.socket.sync_send({"type":"game","content":{"action":4, "is_opponent": self.pos[1] < 0}})
				if(p2.socket != None and not p1Hit):
					p2.socket.sync_send({"type":"game","content":{"action":4, "is_opponent": self.pos[1] > 0}})
			elif(not p1Hit):
				return(1 if self.pos[1] < 0 else 2)
			else:
				return(0)
		elif(self.pos[0] <= GameSettings.mapLimits["left"] + GameSettings.ballRadius + 0.001 or self.pos[0] >= (GameSettings.mapLimits["right"] - GameSettings.ballRadius) - 0.001):
			self.vel[0] = -self.vel[0]
		elif(self.checkWallsColision(self.pos)):
			self.vel[1] = -self.vel[1]
		self.checkJumpersDistance(self.pos, p1, p2, p1Hit)
		self.increaseSpeed()
		return(0)
