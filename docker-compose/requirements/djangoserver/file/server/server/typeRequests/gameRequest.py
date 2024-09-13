# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    gameRequest.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/09 16:10:26 by tomoron           #+#    #+#              #
#    Updated: 2024/09/13 23:41:52 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .gameActions.start import start
from .gameActions.ready import ready

# game request format : {"type":"game", "content":{"action": 1, ...}}

#client actions :
#	0 : player join : a player joins the game
#		- id : id of the player who joined
#		- username : username of the player who joined
#
#	1 : ...

#server actions :
#	0 : start : starts a game
#		- with_bot : true/false, is the second player a bot
#
#	1 : ready : tell the server the game is ready to start (after count down)

action_list = [start, ready]
def gameRequest(socket, content):
	action = content["action"]
	if(action < 0 or action > len(action_list)):
		socket.sendError("Action out of range", 9100)	
		return;
	action_list[action](socket,content)

