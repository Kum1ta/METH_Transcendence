# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Ball.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/06 03:24:10 by tomoron           #+#    #+#              #
#    Updated: 2024/10/06 17:22:46 by tomoron          ###   ########.fr        #
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
		if(inv == 2):
			self.vel[1] = -self.vel[1]

	def default(self):
		self.pos = [0, 0]
		self.up = False
		self.vel = [0, 0]
		self.speed = GameSettings.startSpeed

	def setObstacles(self, obstacles):
		self.obstacles = obstacles

	def solve_quadratic(self, a, b, c):
		disc = (b ** 2) - (4 * a * c)
		if(disc < 0):
			return None
		res = (((-b) + math.sqrt(disc)) / ( 2 * a )) + (((-b) - math.sqrt(disc)) / ( 2 * a ))
		return(res / 2)

	def check_jumper_colision(self, jumper):
		jpos = (jumper["pos"]["x"], jumper["pos"]["z"])
		pos1 = self.pos
		pos2 = self.pos[0] + self.vel[0], self.pos[1] + self.vel[1]
		slope = 0
		if(pos1[0] - pos2[0] == 0):
			slope=100
		else:
			slope = (pos1[1] - pos2[1])/(pos1[0] - pos2[0])
		offset = pos1[1] - (slope * pos1[0])

		#salagadou la menchikabou la bibidi bobidi bou
		a = 1 + (slope ** 2) 
		b = ((-jpos[0]) * 2) + (2 * (slope * (-jpos[1] + offset)))
		c = (((-jpos[0]) ** 2) + (((-jpos[1]) + offset) ** 2)) - (GameSettings.jumperRadius ** 2)
		return(self.solve_quadratic(a, b ,c))

	def check_wall_colision(self, wall):
		wpos = wall["pos"]["x"]
		pos1 = self.pos
		pos2 = self.pos[0] +self.vel[0], self.pos[1] + self.vel[1]
		slope = 0
		if(abs(pos1[1]) <= (GameSettings.wallWidth / 2) + GameSettings.ballRadius):
			print("inside")
			return(None)
		if(pos1[0] - pos2[0] == 0):
			slope=100
		else:
			slope = (pos1[1] - pos2[1])/(pos1[0] - pos2[0])
		offset = pos1[1] - (slope * pos1[0])
		
		if(slope == 0):
			return(None)

		wallSide = (GameSettings.wallWidth / 2) + GameSettings.ballRadius
		if(pos1[1] < 0):
			wallSide *= -1	
		hitPos = (wallSide - offset) / slope
		print(f'{hitPos=}')
		relPos = wpos - hitPos
		print("relative position : ", relPos)
		print("max colision : ", (GameSettings.wallLength / 2) + GameSettings.ballRadius)
		if(abs(relPos) < (GameSettings.wallLength / 2) + GameSettings.ballRadius):
			return(hitPos)
		print("not in wall 1")
		return(None)

	def check_collision_obstacles(self):
		min_time = -1
		for x in self.obstacles:
			if x["isUp"] != self.up:
				continue
			pos = None
			if x["type"] == 1:
				pos = self.check_jumper_colision(x)
			elif x["type"] == 2:
				pos = self.check_wall_colision(x)
			if(pos == None):
				continue
			dist = pos - self.pos[0]
			time = 0
			if(self.vel[0] != 0):
				time = dist / self.vel[0]
			else:
				time = -1
			if(time > 0):
				if(min_time == -1):
					min_time = time
				else:
					min_time = (min(min_time, time))
		return(min_time)

	def getTimeUntilColision(self, limitNeg, limitPos, position, velocity):
		if(not velocity):
			return(-1)
		limit = GameSettings.limits[limitNeg] if velocity < 0 else GameSettings.limits[limitPos] 
		wallDistance = max(limit, position) - min(limit, position)
		colision_time = wallDistance / abs(velocity)
		return(colision_time)

	def getSleepTime(self):
		time_x = self.getTimeUntilColision("left","right", self.pos[0], self.vel[0])
		time_z = self.getTimeUntilColision("back","front", self.pos[1], self.vel[1])
		time_objects = self.check_collision_obstacles()
		if(time_objects != -1):
			time_x = min(time_x, time_objects)
		if(time_x == -1):
			return(time_z)
		if(time_z == -1):
			return(time_x)
		return(min(time_x, time_z))

	def getPlayerDistance(self, player, ballPos):
		playerPos = player["pos"]
		return(playerPos - ballPos[0])

	def twoPointsDistance(self, pos1, pos2):
		return(math.sqrt(((pos2[0] - pos1[0]) ** 2) + ((pos2[1] - pos1[1]) ** 2)))

	def checkJumpersDistance(self, ballPos, p1, p2):
		for i in range(0, len(self.obstacles)):
			if(self.obstacles[i]["type"] != 1):
				continue;
			if(self.obstacles[i]["isUp"] != self.up):
				continue	
			if(self.twoPointsDistance((self.obstacles[i]["pos"]["x"], self.obstacles[i]["pos"]["z"]), ballPos) < GameSettings.jumperRadius):
				p1.socket.sync_send({"type":"game", "content":{"action":8,"name":self.obstacles[i]["name"]}})	
				p2.socket.sync_send({"type":"game", "content":{"action":8,"name":self.obstacles[i]["name"]}})	
				self.up = not self.up
	
	def checkWallsColision(self, ballPos):
		for i in range(0, len(self.obstacles)):
			if(self.obstacles[i]["type"] != 2):
				continue;
			if(self.obstacles[i]["isUp"] != self.up):
				continue;
			if(abs(ballPos[1]) <= (GameSettings.wallWidth / 2) + GameSettings.ballRadius):
				if(abs(self.obstacles[i]["pos"]["x"] - ballPos[0]) < (GameSettings.wallLength / 2) + GameSettings.ballRadius):
					return(True)
		return(False)
	
	def increaseSpeed(self):
		self.vel[0] += (GameSettings.bounceSpeedIncrease * (self.vel[0] / self.speed))
		self.vel[1] += (GameSettings.bounceSpeedIncrease * (self.vel[1] / self.speed))
		self.speed += GameSettings.bounceSpeedIncrease 

	async def update(self, delta, p1, p2):
		print("AAAAAAAAAAAAAAAAAAAAAAA update")
		self.pos[0] += (delta * self.vel[0])
		self.pos[1] += (delta * self.vel[1])
		if(self.pos[1] <= GameSettings.limits["back"] or self.pos[1] >= GameSettings.limits["front"]):
			player = p2.pos if self.pos[1] < 0 else p1.pos
			playerDistance = self.getPlayerDistance(player, self.pos)
			if(playerDistance >= -(GameSettings.playerLength / 2) and playerDistance <= GameSettings.playerLength / 2 and player["up"] == self.up):
				self.vel[0] = -((self.speed * 0.80) * (playerDistance / (GameSettings.playerLength / 2)))
				self.vel[1] = self.speed - abs(self.vel[0])
				if(self.pos[1] > 0):
					self.vel[1] = -self.vel[1]
				p1.socket.sync_send({"type":"game","content":{"action":4, "is_opponent": self.pos[1] < 0}})
				p2.socket.sync_send({"type":"game","content":{"action":4, "is_opponent": self.pos[1] > 0}})
			else:
				return(1 if self.pos[1] < 0 else 2)
		elif(self.pos[0] <= GameSettings.limits["left"] or self.pos[0] >= GameSettings.limits["right"]):
			self.vel[0] = -self.vel[0]
		elif(self.checkWallsColision(self.pos)):
			self.vel[1] = -self.vel[1]
		self.checkJumpersDistance(self.pos, p1, p2)
		self.increaseSpeed()
		return(0)

#AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa
