# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Player.py                                          :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 03:22:32 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 03:46:24 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class Player():
	def __init__(self):
		self.socket = None 
		self.ready = False
		self.pos = {"pos":0, "up": False}
		self.skin = 0
