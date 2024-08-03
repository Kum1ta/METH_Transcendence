# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    main.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:40 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 08:46:38 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from typeRequets.getPrivateListUser import getPrivateListUser
from typeRequets.login import login, userList
import websockets
import asyncio
import json

connected_clients = set()

class userInfo(websockets.WebSocketServerProtocol):
	def __init__(self, websocket):
		self.websocket = websocket
		self.username = ""
		self.token = ""
		self.id = 0

typeRequest = ["login", "get_private_list_user"]
functionRequest = [login, getPrivateListUser]

async def	sendError(websocket, message, code):
	jsonVar = {"type": "error", "content": message, "code": code}
	await websocket.send(json.dumps(jsonVar))

def			verifyToken(websocket, token):
	for user in userList:
		if (user["token"] == token):
			return True
	return False

async def	handler(websocket, path):
	if (path != "/"):
		await sendError(websocket, "Invalid path", 9003)
		await websocket.close()
		return
	connected_clients.add(userInfo(websocket))
	try:
		async for resquet in websocket:
			try:
				jsonRequest = json.loads(resquet)
			except json.JSONDecodeError:
				await sendError(websocket, "Invalid JSON", 9002)
				continue
			try:
				if (jsonRequest["type"] in typeRequest):
					if jsonRequest["type"] == "login":
						await functionRequest[typeRequest.index(jsonRequest["type"])](websocket, jsonRequest["content"])
					else:
						if (verifyToken(websocket, jsonRequest["token"]) == False):
							await sendError(websocket, "Invalid token", 9001)
							continue
						await functionRequest[typeRequest.index(jsonRequest["type"])](websocket)
				else:
					await sendError(websocket, "Invalid type", 9004)
			except:
				await sendError(websocket, "Invalid request", 9005)
	except websockets.ConnectionClosed:
		connected_clients.remove(websocket)
		print("Client déconnecté")

start_server = websockets.serve(handler, "localhost", 8000, subprotocols=['123456'])

asyncio.get_event_loop().run_until_complete(start_server)
print("Server started")
asyncio.get_event_loop().run_forever()