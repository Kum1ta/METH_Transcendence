# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    websocket.py                                       :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/09 14:31:30 by tomoron           #+#    #+#              #
#    Updated: 2024/10/22 17:12:14 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from multimethod import multimethod
from typing import Union
import json
import asyncio

import django
django.setup()

from .models import User
from django.utils import timezone
from .typeRequests.getPrivateListMessage import getPrivateListMessage
from .typeRequests.getPrivateListUser import getPrivateListUser
from .typeRequests.sendPrivateMessage import sendPrivateMessage
from .typeRequests.searchUser import searchUser
from .typeRequests.createAccount import createAccount
from .typeRequests.login import login
from .typeRequests.getAllListUser import getAllListUser
from .typeRequests.changeBanner import changeBanner
from .typeRequests.gameRequest import gameRequest
from .typeRequests.getUserInfo import getUserInfo
from .typeRequests.getPrivateInfo import getPrivateInfo
from .typeRequests.changePrivateInfo import changePrivateInfo
from .typeRequests.changePfp import changePfp
from .typeRequests.statusMessage import statusMessage,getUnreadStatus
from .typeRequests.readMessage import readMessage
from .typeRequests.tournamentRequest import tournamentRequest

typeRequest = ["login", "get_private_list_user", "get_private_list_message",
			   "send_private_message", "create_account", "get_all_list_user",
			   "game", "search_user", "get_user_info", "change_pfp", "change_banner",
			   "get_private_info", "change_private_info","status_message", "read_message", "tournament"
			   ]
functionRequest = [login, getPrivateListUser, getPrivateListMessage,
				sendPrivateMessage, createAccount, getAllListUser, gameRequest,
				searchUser, getUserInfo, changePfp, changeBanner,
				getPrivateInfo, changePrivateInfo, statusMessage, readMessage, tournamentRequest
				]

from random import randint

class WebsocketHandler(AsyncWebsocketConsumer):
	debugMode = True

	# format : {id : socket, ...}
	onlinePlayers = {}

	@sync_to_async
	def session_get(self, key, default=None):
		return(self.scope["session"].get(key, default))

	@sync_to_async
	def session_set(self, key, value):
		self.scope["session"][key] = value

	@sync_to_async
	def session_save(self):
		self.scope["session"].save()

	@sync_to_async
	def setLastLogin(self):
		if(self.id == None or self.id == 0):
			return;
		User.objects.filter(id=self.id).update(last_login=timezone.now())

	def add_to_online(self, uid):
		if(not uid):
			return(0)
		if(uid not in self.onlinePlayers):
			self.onlinePlayers[uid] = self
			return(1)
		print("\033[32monline : ", self.onlinePlayers)
		return(0)

	async def login(self, uid: int, username: str, pfp : str, elo : int) -> int:
		if(await self.session_get("logged_in", False)):
			print("already logged in")
			return(0)
		if(not self.add_to_online(uid)):
			self.sendError("Already logged in", 9012)
			return(0)
		await self.session_set("logged_in",True)
		await self.session_set("id",uid)
		await self.session_set("username",username)
		await self.session_set("pfp", pfp)
		await self.session_set("elo", elo)
		await self.session_save()
		self.logged_in = True
		self.id = uid
		self.elo = elo
		self.username = username
		self.pfp = pfp
		return(1)

	async def connect(self):
		self.logged_in = False
		self.game = None
		self.tournament = None
		self.id = 0
		self.username = None
		self.online = True
		await self.accept()
		if(await self.session_get("logged_in", False)):
			if(not self.add_to_online(await self.session_get("id", 0))):
				jsonVar = {"type": "error", "content": "User already connected", "code": 9013}
				await self.send(text_data=json.dumps(jsonVar))
				await self.close()
				return;
			self.id = await self.session_get("id",0)
			self.username = await self.session_get("username", None)
			self.pfp = await self.session_get("pfp",None)
			self.elo = await self.session_get("elo", 0)
			self.logged_in = True
		await self.send(text_data=json.dumps({"type":"logged_in", "content":{
			"status":await self.session_get("logged_in",False),
			"username":await self.session_get("username",None),
			"id":await self.session_get("id",0),
			"haveUnredMessage":await getUnreadStatus(self.id)
		}}))
		print("new client")
	
	async def disconnect(self, close_code):
		print("you can go, i am not mad, we never wanted you anyway")
		self.online = False
		if(not self.logged_in):
			return ;
		uid = await self.session_get("id", 0)
		if(uid in self.onlinePlayers):
			del self.onlinePlayers[uid]
		if(self.game != None):
			self.game.leave(self)
		if(self.tournament != None):
			self.tournament.leave(self)
	
	async def receive(self, text_data):
		try:
			jsonRequest = json.loads(text_data)
		except json.JSONDecodeError:
			self.sendError("Invalid JSON", 9002)
			return
		try:
			self.printDebug(jsonRequest, 0)
			if (jsonRequest["type"] in typeRequest):
				if (jsonRequest["type"] == "login" or jsonRequest["type"] == "create_account"):
					await functionRequest[typeRequest.index(jsonRequest["type"])](self, jsonRequest["content"])
				else:
					if (not await self.session_get("logged_in", False)):
						return;
					await functionRequest[typeRequest.index(jsonRequest["type"])](self, jsonRequest["content"])
			else:
				self.sendError("Invalid type", 9004)
		except Exception as e:
			self.sendError("Invalid request", 9005, e)

	@multimethod
	def sync_send(self, reqType : str, content:dict):
		self.sync_send({"type":reqType,"content":content})

	@multimethod
	def sync_send(self, data: Union[dict,str]):
		if(not self.online):
			print("cancel send, socket not online")
			return
		txt_data = None	
		if(type(data) is dict):
			txt_data = json.dumps(data)
		else:
			txt_data = data

		try:
			loop = asyncio.get_running_loop()
		except RuntimeError:
			loop = asyncio.new_event_loop()
			asyncio.set_event_loop(loop)
			loop.run_until_complete(self.send(text_data=txt_data))
		else:
			loop.create_task(self.send(text_data=txt_data))

	def	sendError(self, message, code, error=None):
		try:
			jsonVar = {"type": "error", "content": message, "code": code}
			self.printDebug(jsonVar, 2, error)
			self.sync_send(jsonVar)
		except Exception as e:
			if (self.debugMode):
				print("\033[0;31m|------ Error in sendError ------|\033[0;0m")
				print(e)

	def printDebug(self, request, typeRequest, error=None):
		try:				
			if (self.debugMode and typeRequest == 0):
				if(request["type"] == "game" and request.get("content", {}).get("action", 0) == 4):
					return
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
