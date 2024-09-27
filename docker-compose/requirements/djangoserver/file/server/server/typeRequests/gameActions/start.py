# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/27 16:33:32 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Game import Game

async def start(socket, content):
	if(socket.game != None):
		socket.sendError("Game already started", 9102)
		return;
	opponent = content.get("opponent", None)
	if(opponent != None and opponent not in socket.onlinePlayers):
		socket.sendError("Your opponent isn't online",9032)
		return;
	Game(socket, content.get("with_bot", False), content.get("skinId", 0),opponent)

