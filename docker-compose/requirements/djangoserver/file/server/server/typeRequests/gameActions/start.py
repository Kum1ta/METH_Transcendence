# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/15 13:33:53 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Game import Game

async def start(socket, content):
	if(socket.game != None):
		socket.sendError("Game already started", 9102)
		return;
	Game(socket, content.get("with_bot", False))

