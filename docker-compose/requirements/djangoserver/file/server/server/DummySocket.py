# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    DummySocket.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: hubourge <hubourge@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/08 07:33:29 by tomoron           #+#    #+#              #
#    Updated: 2024/11/18 19:07:29 by hubourge         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from random import randint

class DummySocket:
	def __init__(self, game):
		self.id = 0
		self.online = True
		self.username = "bot"
		self.game = game
		pfpList = ["/static/img/robot_pfp1.jpg", "/static/img/robot_pfp2.jpg", "/static/img/robot_pfp3.jpg", "/static/img/robot_pfp4.jpg"]
		self.pfp = pfpList[randint(0, 3)]

	def sync_send(*args):
		pass

	def sendError(*args):
		pass
