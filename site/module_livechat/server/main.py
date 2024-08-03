# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    main.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:40 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 17:20:07 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from typeRequets.getPrivateListUser import getPrivateListUser
from typeRequets.login import login
from Class.User import User
import websockets
import asyncio
import json

connected_clients = set()

typeRequest = ["login", "get_private_list_user"]
functionRequest = [login, getPrivateListUser]

async def	handler(websocket, path):
	if (path != "/"):
		await websocket.sendError("Invalid path", 9003)
		await websocket.close()
		return
	userClass = User(websocket)
	connected_clients.add(userClass)
	try:
		async for resquet in userClass.websocket:
			try:
				jsonRequest = json.loads(resquet)
			except json.JSONDecodeError:
				await userClass.sendError("Invalid JSON", 9002)
				continue
			try:
				if (jsonRequest["type"] in typeRequest):
					if jsonRequest["type"] == "login":
						await functionRequest[typeRequest.index(jsonRequest["type"])](websocket, jsonRequest["content"])
					else:
						if (userClass.verifyToken(websocket, jsonRequest["token"]) == False):
							continue
						await functionRequest[typeRequest.index(jsonRequest["type"])](websocket)
				else:
					await userClass.sendError("Invalid type", 9004)
			except:
				await userClass.sendError("Invalid request", 9005)
	except websockets.ConnectionClosed:
		pass
	await userClass.close()
	connected_clients.remove(userClass)
start_server = websockets.serve(handler, "localhost", 8000, subprotocols=['123456'])

asyncio.get_event_loop().run_until_complete(start_server)
print("Server started")
asyncio.get_event_loop().run_forever()