# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    gameRequest.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/09 16:10:26 by tomoron           #+#    #+#              #
#    Updated: 2024/09/14 12:43:14 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .gameActions.start import start
from .gameActions.ready import ready

# game request format : {"type":"game", "content":{"action": 1, ...}}

#server actions (actions sent by the server):
#	0 : wait : tell the client to wait for an opponent 
#
#	1 : opponent : tell the client the name of the opponent
#		- id
#		- username
#
#	2 : go : the game started

#client actions (actions sent by the client) :
#	0 : start : starts a game
#		- with_bot : true/false, is the second player a bot
#
#	1 : ready : tell the server the game is ready to start
#
#	2 : leave : leave the game (or waiting screen)

action_list = [start, ready]
def gameRequest(socket, content):
	action = content["action"]
	if(action < 0 or action > len(action_list)):
		socket.sendError("Action out of range", 9100)	
		return;
	action_list[action](socket,content)

