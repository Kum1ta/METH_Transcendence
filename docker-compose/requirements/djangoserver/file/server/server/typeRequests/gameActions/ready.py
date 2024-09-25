# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    ready.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/13 23:41:12 by tomoron           #+#    #+#              #
#    Updated: 2024/09/25 09:19:46 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def ready(socket, content):
	await socket.game.setReady(socket)
