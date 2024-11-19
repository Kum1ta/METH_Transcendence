# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    leave.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 18:05:07 by tomoron           #+#    #+#              #
#    Updated: 2024/11/19 16:53:47 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def tournamentLeave(socket, content):
	if(socket.tournament == None):
		socket.sendError("you're not in a tournament", 9037)
		return;
	socket.tournament.leave(socket)
