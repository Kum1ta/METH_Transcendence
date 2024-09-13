# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    ready.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 23:41:12 by tomoron           #+#    #+#              #
#    Updated: 2024/09/14 00:21:43 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

def ready(socket, content):
	print("ready request")
	if(socket.game == None):
		socket.sendError("No game started", 9101)
		return;
	socket.game.setReady(socket)
