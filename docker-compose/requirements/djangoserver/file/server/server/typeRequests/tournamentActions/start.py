# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 17:16:02 by tomoron           #+#    #+#              #
#    Updated: 2024/10/14 20:25:16 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Tournament import Tournament
from ...GameSettings import GameSettings

async def tournamentStart(socket, content):
	skinId = content.get("skinId", 0)
	if(skinId < 0 or skinId >= GameSettings.nbSkins):
		socket.sendError("Skin id out of range", 9033)
		return;
	goalId = content.get("goalId",0)
	if(goalId < 0 or goalId >= GameSettings.nbGoals):
		socket.sendError("Goal id out of range", 9039)
		return;
	if("code" in content and len(content["code"])):
		if(content["code"] in Tournament.currentTournaments):
			Tournament.currentTournaments[content["code"]].join(socket, skin, goal)
		else:
			socket.sync_send("tournament",{"action":0, "exist":False})
	else:
		nbBot = content.get("nbBot", 0)
		if(nbBot < 0 or nbBot > 7):
			socket.sendError("invalid number of bots", 9040)
			return;
		Tournament(socket, nbBot, skinId, goalId)
