# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/25 09:23:02 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Game import Game

async def start(socket, content):
	if(socket.game != None):
		socket.sendError("Game already started", 9102)
		return;
	Game(socket, content.get("with_bot", False), content.get("skinId", 0))

