# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    ready.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 23:41:12 by tomoron           #+#    #+#              #
#    Updated: 2024/09/15 13:37:23 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def ready(socket, content):
	await socket.game.setReady(socket)