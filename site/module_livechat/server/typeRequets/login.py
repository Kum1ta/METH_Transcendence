# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 08:46:00 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import websockets
import json

userList = [
	{
		"username": "user1",
		"token": "123456",
		"id": 1
	},
	{
		"username": "user2",
		"token": "789123",
		"id": 2
	},
	{
		"username": "user3",
		"token": "456789",
		"id": 3
	}
]

async def login(websocket, content):
	print(content)