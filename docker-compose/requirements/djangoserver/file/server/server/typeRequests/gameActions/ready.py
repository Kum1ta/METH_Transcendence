# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    ready.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 23:41:12 by tomoron           #+#    #+#              #
#    Updated: 2024/09/14 19:27:51 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def ready(socket, content):
	print("ready request")
	if(socket.game == None):
		socket.sendError("No game started", 9101)
		return;
	await socket.game.setReady(socket)
