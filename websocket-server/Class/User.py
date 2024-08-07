# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    User.py                                            :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:54:14 by edbernar          #+#    #+#              #
#    Updated: 2024/08/07 21:20:17 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import websockets
import asyncio
import json

connected_clients = []

class User():
	debugMode = True
	websocket = None
	username = ""
	token = ""
	id = -1

	def __init__(self, websocket):
		if (self.debugMode):
			print("\033[42m|------ New user Connected ------|\033[1;0m")
		self.websocket = websocket
		connected_clients.append(self)

	def __del__(self):
		if (self.debugMode):
			print("\033[43m|------ User disconnected -------|\033[1;0m")
			print("User          :", self.username)
			print("Id            :", self.id)

	async def	sendError(self, message, code, error=None):
		try:
			jsonVar = {"type": "error", "content": message, "code": code}
			self.printDebug(jsonVar, 2, error)
			await self.websocket.send(json.dumps(jsonVar))
		except:
			if (self.debugMode):
				print("\033[0;31m|------ Error in sendError ------|\033[0;0m")


	async def	send(self, content):
		try:
			if (type(content) == dict):
				self.printDebug(content, 1)
				await self.websocket.send(json.dumps(content))
			else:
				self.printDebug(json.loads(content), 1)
				await self.websocket.send(content)
		except Exception as e:
			if (self.debugMode):
				print("\033[0;31m|--------- Error in send --------|\033[0;0m")
				print("Error message :", e)

	async def	verifyToken(self, token):
		try:
			if (self.token != token or self.token == ""):
				await self.sendError("Invalid token", 9001)
				return False
			return True
		except:
			if (self.debugMode):
				print("\033[0;31m|----- Error in verifyToken -----|\033[0;0m")
	
	def printDebug(self, request, typeRequest, error=None):
		try:				
			if (self.debugMode and typeRequest == 0):
				print("\033[0;34m|----- New received request -----|\033[0;0m")
				print("User          :", self.username)
				print("Token         :", self.token)
				print("Id            :", self.id)
				try:
					print("Var type      :", type(request["type"]))
					print("Type          :", request["type"])
				except:
					pass
				try:
					print("Content type  :", request["content"])
				except:
					pass
			elif (self.debugMode and typeRequest == 1):
				print("\033[0;32m|------- New sent request -------|\033[0;0m")
				print("To            :", self.username)
				print("Id            :", self.id)
				try:
					print("Var type      :", type(request["type"]))
					print("Type          :", request["type"])
				except:
					pass
				try:
					print("Content       :", request["content"])
				except:
					pass
				if ("type" not in request or "content" not in request):
					print("Warning       : not usual json format")
			elif (self.debugMode and typeRequest == 2):
				print("\033[0;31m|------------- Error ------------|\033[0;0m")
				print("User          :", self.username)
				print("Token         :", self.token)
				print("Id            :", self.id)
				print("Error message :", request["content"])
				print("Error code    :", request["code"])
				if (error != None):
					print("Error python  :", error)
					print("File          :", error.__traceback__.tb_frame.f_globals["__file__"])
					print("Line          :", error.__traceback__.tb_lineno)
		except:
			print("\033[0;31m|------ Error in printDebug -----|\033[0;0m")
	
	async def	close(self):
		try:
			await self.websocket.close()
		except:
			pass
