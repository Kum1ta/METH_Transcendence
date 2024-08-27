# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/08/27 23:20:40 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .login import userList
from ..models import User
import random
import re
import json
import hashlib

pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$'

# {'username': 'Kumita', 'mail': 'eddydhj@gmail.com', 'password': '3b19482535d1ab2f4e3c629c4e3e5e2d6af0a5f5280be190726a4c3be518a475'}


def createAccount(socket, content):
	try:
		content["mail"] = content["mail"].lower()
		if (content["mail"].find('@') == -1 or content["mail"].find('.') == -1):
			socket.sendError("Invalid mail", 9006)
			return
		if (content["username"].find(' ') != -1):
			socket.sendError("Username must not contain spaces", 9007)
			return
		if (len(content["username"]) < 3):
			socket.sendError("Username must be at least 3 characters long", 9008)
			return
		if (len(content["username"]) > 20):
			socket.sendError("Username must be at most 20 characters long", 9009)
			return
		if (content["username"].find(' ') != -1):
			socket.sendError("Username must not contain spaces", 9011)
			return
		if (content["username"].isalnum() == False):
			socket.sendError("Username must contain only letters and numbers", 9012)
			return
		if (len(content["password"]) < 8):
			socket.sendError("Password must be at least 8 characters long", 9013)
			return
		if (bool(re.match(pattern, content["password"]))):
			socket.sendError("Password must contain at least one lowercase letter, one uppercase letter and one special character", 9014)
			return
		if (content["password"].find(content["username"]) != -1):
			socket.sendError("Password must not contain the username", 9015)
			return
		if (len(User.objects.filter(mail=content["mail"]))):
			socket.sendError("Mail already used", 9016)
			return
		if (len(User.objects.filter(username=content["username"]))):
			socket.sendError("Username already used", 9017)
			return
		password = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
		new_user = User.objects.create(username=content["username"], mail=content["mail"], password=password)
		new_user.save()
		if(socket.login(new_user.id, content["username"])):
			socket.send(text_data=json.dumps({"type": "create_account", "content": "Account created"}))
		else:
			socket.sendError("Already logged in", 9012)
	except Exception as e:
		socket.sendError("Error create account", 9005, e)
