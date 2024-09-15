# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/09/15 11:14:32 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import hashlib
import requests
import json
import os

@sync_to_async
def userExists(mail, password):
	password_hash = hashlib.md5((mail + password).encode()).hexdigest()
	user = User.objects.filter(mail=mail, password=password_hash)
	if(not user.exists()):
		return({"found":False})
	else:
		return({"found":True, "id":user[0].id, "username":user[0].username, "mail_verified":user[0].mail_verified})

async def loginByPass(socket, content):
	u_info = await userExists(content["mail"],content["password"])
	if(u_info["found"]):
		if(not u_info["mail_verified"]):
			socket.sendError("Account not verified, please verify your account before logging in",9025) 
			return
		if(await socket.login(u_info["id"], u_info["username"])):
			socket.sync_send(json.dumps({"type":"logged_in", "content":{
				"status":True,
				"username":u_info["username"],
				"id": u_info["id"],
			}}))
		else:
			socket.sendError("An unknown error occured",9027)
	else:
		socket.sync_send(json.dumps({"type": "error", "content": "Invalid email or password", "code": 9007}))

async def login(socket, content):
	try:
		if (content["type"] == "byPass"):
			await loginByPass(socket, content)
		else:
			socket.sendError("Invalid login type", 9006)
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
