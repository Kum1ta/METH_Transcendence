# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    gameRequest.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/09 16:10:26 by tomoron           #+#    #+#              #
#    Updated: 2024/10/01 16:35:10 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .gameActions.start import start
from .gameActions.ready import ready
from .gameActions.leave import leave
from .gameActions.move import move
from .gameActions.ping import ping

# game request format : {"type":"game", "content":{"action": 1, ...}}

#server actions (actions sent by the server):
#	0 : wait : tell the client to wait for an opponent 
#
#	1 : opponent : tell the client the name of the opponent
#		- id : 0 if it's a bot
#		- username
#
#	2 : go : the game started
# 
#	3 : move : when the oponnent moves or the client did an illegal move
#		- is_opponent
#		- pos
#		- up
#
#	4: player hit
#		is_opponent
#
#	5 : ball_move : send new directtion/movement to the client
#		- pos : [x, z]
#		- velocity : [x, z]
#		- game_time : ms since start of game
#
#	6 : goal : someone scored a goal
#		- is_opponent
#
#	7 : place object : place generated objects on the map
#		- pos (x, y , z)
#		- isUp
#		- type
#
#	8 : jumper colision:
#		name : name of the jumper
#
#	9: pong
#
#	10: game end
#		- won : true/false
#		- opponentLeft : true/false

#client actions (actions sent by the client) :
#	0 : start : starts a game
#		- with_bot : true/false (default : false), is the second player a bot
#
#	1 : ready : tell the server the game is ready to start
#
#	2 : leave : leave the game (or waiting screen)
#
#	3 : move : when the client moves
#		- pos :  
#		- up : True/False(default : False) is the player up
#
#	4: ping : test the latency with the server

action_list = [start, ready, leave, move, ping]
async def gameRequest(socket, content):
	action = content["action"]
	if(action < 0 or action > len(action_list)):
		socket.sendError("Action out of range", 9100)	
		return;
	if(action != 0 and socket.game == None):
		socket.sendError("No game started",9101)
		return ;
	await action_list[action](socket,content)

