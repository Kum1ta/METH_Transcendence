# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/27 17:39:59 by tomoron          ###   ########.fr        #
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
	skinId = content.get("skinId", 0)
	if(skinId < 0 or skinId >= len(Game.skins)):
		socket.sendError("Skin id out of range", 9033)
		return;
	Game(socket, content.get("with_bot", False),skinId ,opponent)

