# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    DummySocket.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <marvin@42.fr>                     +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/08 07:33:29 by tomoron           #+#    #+#              #
#    Updated: 2024/10/08 08:25:06 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

class DummySocket:
	def __init__(self, game):
		self.id = 0
		self.username = "bot"
		self.game = game

	def sync_send(*args):
		pass

	def sendError(*args):
		pass
