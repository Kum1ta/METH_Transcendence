from channels.generic.websocket import WebsocketConsumer
import json

import django
django.setup()

from .typeRequests.getPrivateListMessage import getPrivateListMessage
from .typeRequests.getPrivateListUser import getPrivateListUser
from .typeRequests.sendPrivateMessage import sendPrivateMessage
from .typeRequests.createAccount import createAccount
from .typeRequests.login import login

typeRequest = ["login", "get_private_list_user", "get_private_list_message",
			   "send_private_message", "create_account"]
functionRequest = [login, getPrivateListUser, getPrivateListMessage,
				sendPrivateMessage, createAccount]

from random import randint

class WebsocketHandler(WebsocketConsumer):
	debugMode = True

	def connect(self):
		self.accept()
		self.send(text_data=json.dumps({"type":"logged_in", "content":{
			"status":self.scope["session"].get("logged_in",False),
			"username":self.scope["session"].get("username",None)
		}}))
		print("new client")
	
	def disconnect(self, close_code):
		print("you can go, i am not mad, we never wanted you anyway")
	
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
			print(e)

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
