# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/09/14 18:54:47 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import hashlib
import requests
import json
import os

def loginByPass(socket, content):
	password_hash = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
	user = User.objects.filter(mail=content["mail"], password=password_hash)
	if(user.exists()):
		if(user[0].mail != None and not user[0].mail_verified):
			socket.sendError("Account not verified, please verify your account before logging in",9025) 
			return
		if(socket.login(user[0].id, user[0].username)):
			socket.sync_send(json.dumps({"type":"logged_in", "content":{
				"status":True,
				"username":user[0].username,
				"id": user[0].id,
			}}))
	else:
		socket.sync_send(json.dumps({"type": "error", "content": "Invalid email or password", "code": 9007}))

@sync_to_async
def login(socket, content):
	try:
		if (content["type"] == "byPass"):
			loginByPass(socket, content)
		else:
			socket.sendError("Invalid login type", 9006)
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
