# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/09/10 13:28:38 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

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
			socket.send(text_data=json.dumps({"type":"logged_in", "content":{
				"status":True,
				"username":user[0].username,
				"id": user[0].id,
			}}))
	else:
		socket.send(text_data=json.dumps({"type": "error", "content": "Invalid email or password", "code": 9007}))

def login(socket, content):
	try:
		if (content["type"] == "byPass"):
			loginByPass(socket, content)
		else:
			socket.sendError("Invalid login type", 9006)
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
