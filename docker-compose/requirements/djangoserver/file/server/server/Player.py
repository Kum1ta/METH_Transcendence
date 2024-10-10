# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Player.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 03:22:32 by tomoron           #+#    #+#              #
#    Updated: 2024/10/10 03:52:40 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class Player():
	def __init__(self, socket, game):
		self.socket = socket 
		socket.game = game
		self.ready = False
		self.pos = {"pos":0, "up": False}
		self.skin = 0
		self.goal = 0

	def __del__(self):
		print("player destroy")
