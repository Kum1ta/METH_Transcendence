from channels.generic.websocket import WebsocketConsumer
import json

from .typeRequets.getPrivateListMessage import getPrivateListMessage
from .typeRequets.getPrivateListUser import getPrivateListUser
from .typeRequets.sendPrivateMessage import sendPrivateMessage
from .typeRequets.createAccount import createAccount
from .typeRequets.login import login

typeRequest = ["login", "get_private_list_user", "get_private_list_message",
			   "send_private_message", "create_account"]
functionRequest = [login, getPrivateListUser, getPrivateListMessage,
				sendPrivateMessage, createAccount]

from random import randint

class WebsocketHandler(WebsocketConsumer):
	debugMode = True

	session = None

	def connect(self):
		print("new client")
		self.accept()
		print(self.scope["session"].get("number"))
		if(self.scope["session"].get("number") == None):
			self.scope["session"]["number"] = randint(0,2147483647)
			self.scope["session"].save()
			print("new number : ", self.scope["session"].get("number"))
		else:
			print("remembered number : ", self.scope["session"].get("number"))
	
	def disconnect(self, close_code):
		print("you can go, we never wanted you anyway")
	
	def receive(self, text_data):
		print(self.scope["session"].get("number"))
		print("someone is talking")
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
					if (self.verifyToken(jsonRequest["token"]) == False):
						return
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
