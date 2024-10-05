# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    sendMessage.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/04 18:05:27 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 03:27:45 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def sendMessage(socket, content):
	if("message" not in content):
		socket.sendError("missing message field",9038) 
		return
	socket.tournament.sendMessage(socket, content["message"])
