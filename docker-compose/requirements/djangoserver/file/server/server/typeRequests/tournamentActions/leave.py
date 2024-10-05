# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    leave.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 18:05:07 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 02:28:42 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def tournamentLeave(socket, content):
	print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" * 100)
	if(socket.tournament == None):
		socket.sendError("you're not in a tournament", 9037)
		return;
	socket.tournament.leave(socket)
