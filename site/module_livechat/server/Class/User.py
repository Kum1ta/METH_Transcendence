# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    User.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:54:14 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 17:17:39 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import websockets
import asyncio
import json


class User(websockets.WebSocketServerProtocol):
	debugMode = True
	websocket = None
	username = ""
	token = ""
	id = -1

	def __init__(self, websocket):
		if (self.debugMode):
			print("\033[0;34m|------ New user Connected ------|\033[0;0m")
		self.websocket = websocket

	def __del__(self):
		if (self.debugMode):
			print("\033[0;31m|------ User disconnected ------|\033[0;0m")

	async def	sendError(self, message, code):
		jsonVar = {"type": "error", "content": message, "code": code}
		self.printDebug( jsonVar, 2)
		await self.websocket.send(json.dumps(jsonVar))

	async def	send(self, content):
		self.printDebug(content, 1)
		if (type(content) == dict):
			await self.websocket.send(json.dumps(content))
		else:
			await self.websocket.send(content)

	async def	verifyToken(self, token):
		if (self.token != token or self.token == ""):
			await self.sendError("Invalid token", 9001)
			return False
		return True
	
	def printDebug(self, infoUser, request, typeRequest):
		try:
			if (self.debugMode and typeRequest == 0):
				print("\033[0;34m|----- New received request -----|\033[0;0m")
				print("User          :", infoUser.username)
				print("Token         :", infoUser.token)
				print("Id            :", infoUser.id)
				print("Var type      :", type(request["type"]))
				print("Type          :", request["type"])
				print("Content       :", request["content"])
			elif (self.debugMode and typeRequest == 1):
				print("\033[0;32m|------- New sent request -------|\033[0;0m")
				print("To            :", infoUser.username)
				print("Var type      :", type(request["type"]))
				print("Type          :", request["type"])
				print("Content       :", request["content"])
			elif (self.debugMode and typeRequest == 2):
				print("\033[0;31m|------------- Error ------------|\033[0;0m")
				print("User          :", infoUser.username)
				print("Token         :", infoUser.token)
				print("Id            :", infoUser.id)
				print("Error message :", request["content"])
				print("Error code    :", request["code"])
		except:
			print("\033[0;31m|------- Error in printDebug -----|\033[0;0m")
	
	async def	close(self):
		try:
			await self.websocket.close()
		except:
			pass
