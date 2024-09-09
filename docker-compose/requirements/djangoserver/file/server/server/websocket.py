# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    websocket.py                                       :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/09 14:31:30 by tomoron           #+#    #+#              #
#    Updated: 2024/09/09 16:10:15 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from channels.generic.websocket import WebsocketConsumer
import json

import django
django.setup()

from .typeRequests.getPrivateListMessage import getPrivateListMessage
from .typeRequests.getPrivateListUser import getPrivateListUser
from .typeRequests.sendPrivateMessage import sendPrivateMessage
from .typeRequests.createAccount import createAccount
from .typeRequests.login import login
from .typeRequests.getAllListUser import getAllListUser
from .typeRequests.gameRequest import gameRequest

typeRequest = ["login", "get_private_list_user", "get_private_list_message",
			   "send_private_message", "create_account", "get_all_list_user", "game"]
functionRequest = [login, getPrivateListUser, getPrivateListMessage,
				sendPrivateMessage, createAccount, getAllListUser, gameRequest]

from random import randint

class WebsocketHandler(WebsocketConsumer):
	debugMode = True

	# format : {id : socket, ...}
	onlinePlayers = {}

	def add_to_online(self, uid):
		if(not uid):
			return
		if(uid not in self.onlinePlayers):
			self.onlinePlayers[uid] = self
			return(1)
		print("\033[32monline : ", self.onlinePlayers)
		return(0)

	def login(self, uid: int, username: str) -> int:
		if(self.scope["session"].get("logged_in", False)):
			return(0)
		if(not self.add_to_online(uid)):
			socket.sendError("Already logged in", 9012)
			return(0)
		self.scope["session"]["logged_in"] = True
		self.scope["session"]["id"] = uid
		self.scope["session"]["username"] = username 
		self.scope["session"].save()
		self.logged_in = True
		return(1)

	def connect(self):
		self.logged_in = False
		self.accept()
		if(self.scope["session"].get("logged_in", False)):
			if(not self.add_to_online(self.scope["session"].get("id", 0))):
				self.sendError("User already connected", 9013)
				self.close()
				return;
		self.send(text_data=json.dumps({"type":"logged_in", "content":{
			"status":self.scope["session"].get("logged_in",False),
			"username":self.scope["session"].get("username",None),
			"id":self.scope["session"].get("id",0)
		}}))
		self.logged_in = self.scope["session"].get("logged_in", False)
		print("new client")
	
	def disconnect(self, close_code):
		print("you can go, i am not mad, we never wanted you anyway")
		if(not self.logged_in):
			return ;
		uid = self.scope["session"].get("id", 0)
		if(uid in self.onlinePlayers):
			del self.onlinePlayers[uid]
	
	def receive(self, text_data):
		print("someone is talking")
		print("username is ", self.scope["session"].get("username"))
		if(self.scope["session"].get("logged_in", False)):
			print("user is logged in")
		else:
			print("user is not logged in")
		try:
			jsonRequest = json.loads(text_data)
		except json.JSONDecodeError:
			self.sendError("Invalid JSON", 9002)
			return
		try:
			self.printDebug(jsonRequest, 0)
			if (jsonRequest["type"] in typeRequest):
				if (jsonRequest["type"] == "login" or jsonRequest["type"] == "create_account"):
					functionRequest[typeRequest.index(jsonRequest["type"])](self, jsonRequest["content"])
				else:
					if (not self.scope["session"].get("logged_in", False)):
						return;
					functionRequest[typeRequest.index(jsonRequest["type"])](self, jsonRequest["content"])
			else:
				self.sendError("Invalid type", 9004)
		except Exception as e:
			self.sendError("Invalid request", 9005, e)

	def	sendError(self, message, code, error=None):
		try:
			jsonVar = {"type": "error", "content": message, "code": code}
			self.printDebug(jsonVar, 2, error)
			self.send(text_data=json.dumps(jsonVar))
		except Exception as e:
			if (self.debugMode):
				print("\033[0;31m|------ Error in sendError ------|\033[0;0m")
				print(e)

	def printDebug(self, request, typeRequest, error=None):
		try:				
			if (self.debugMode and typeRequest == 0):
				print("\033[0;34m|----- New received request -----|\033[0;0m")
				#print("User          :", self.username)
				#print("Token         :", self.token)
				#print("Id            :", self.id)
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
				#print("To            :", self.username)
				#print("Id            :", self.id)
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
				#print("User          :", self.username)
				#print("Token         :", self.token)
				#print("Id            :", self.id)
				print("Error message :", request["content"])
				print("Error code    :", request["code"])
				if (error != None):
					print("Error python  :", error)
					print("File          :", error.__traceback__.tb_frame.f_globals["__file__"])
					print("Line          :", error.__traceback__.tb_lineno)
		except Exception as e:
			print("\033[0;31m|------ Error in printDebug -----|\033[0;0m")
			print(e)
