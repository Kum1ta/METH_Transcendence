# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 17:16:02 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 02:28:50 by tomoron          ###   ########.fr        #
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
		Tournament(socket)
