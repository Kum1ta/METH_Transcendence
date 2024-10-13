# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 17:16:02 by tomoron           #+#    #+#              #
#    Updated: 2024/10/11 21:14:54 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Tournament import Tournament

async def tournamentStart(socket, content):
	if("code" in content and len(content["code"])):
		if(content["code"] in Tournament.currentTournaments):
			Tournament.currentTournaments[content["code"]].join(socket)
		else:
			socket.sync_send("tournament",{"action":0, "exist":False})
	else:
		nbBot = content.get("nbBot", 0)
		if(nbBot < 0 or nbBot > 7):
			socket.sendError("invalid number of bots", 9040)
			return;
		Tournament(socket, nbBot)
