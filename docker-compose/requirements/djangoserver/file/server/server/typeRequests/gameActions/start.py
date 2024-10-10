# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/10/10 03:52:54 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Game import Game
from ...GameSettings import GameSettings

async def start(socket, content):
	if(socket.game != None):
		socket.sendError("Game already started", 9102)
		return;
	opponent = content.get("opponent", None)
	if(opponent != None and opponent not in socket.onlinePlayers):
		socket.sendError("Your opponent isn't online",9032)
		return;
	skinId = content.get("skinId", 0)
	if(skinId < 0 or skinId >= len(GameSettings.skins)):
		socket.sendError("Skin id out of range", 9033)
		return;
	goalId = content.get("goalId",0)
	if(goalId < 0 or goalId >= GameSettings.nbGoals):
		socket.sendError("Goal id out of range", 9039)
		return;
	Game(socket, False,skinId, goalId,opponent)

