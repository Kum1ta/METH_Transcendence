# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    move.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/16 13:54:55 by tomoron           #+#    #+#              #
#    Updated: 2024/09/16 14:18:04 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def move(socket, content):
	up = content.get("up", False)
	pos = content.get("pos", None)
	if(pos == None):
		return;
	socket.game.move(socket, pos, up)
