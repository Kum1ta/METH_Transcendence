# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    DummySocket.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/08 07:33:29 by tomoron           #+#    #+#              #
#    Updated: 2024/10/11 10:47:53 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class DummySocket:
	def __init__(self, game):
		self.id = 0
		self.username = "bot"
		self.game = game
		self.pfp = "/static/img/robot_pfp.jpg"

	def sync_send(*args):
		pass

	def sendError(*args):
		pass
