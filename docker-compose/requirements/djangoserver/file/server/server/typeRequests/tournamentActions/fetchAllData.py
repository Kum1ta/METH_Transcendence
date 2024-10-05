# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    fetchAllData.py                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/05 02:08:12 by tomoron           #+#    #+#              #
#    Updated: 2024/10/05 02:08:52 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

async def fetchAllData(socket, content):
	socket.tournament.sendAllInfo(socket)	
