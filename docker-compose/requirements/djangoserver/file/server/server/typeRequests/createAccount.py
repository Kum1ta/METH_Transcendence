# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/09/06 18:53:05 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .login import userList
from ..models import User
import random
import re
import json
import hashlib

mail_pattern = "^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$"
password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

def createAccount(socket, content):
	try:
		if (not bool(re.match(mail_pattern, content["mail"]))):
			socket.sendError("Invalid mail", 9014)
			return
		if (content["username"].find(' ') != -1):
			socket.sendError("Username must not contain spaces", 9015)
			return
		if (len(content["username"]) < 3):
			socket.sendError("Username must be at least 3 characters long", 9016)
			return
		if (len(content["username"]) > 20):
			socket.sendError("Username must be at most 20 characters long", 9017)
			return
		if (content["username"].isalnum() == False):
			socket.sendError("Username must contain only letters and numbers", 9018)
			return
		if (len(content["password"]) < 8):
			socket.sendError("Password must be at least 8 characters long", 9019)
			return
		if (not bool(re.match(password_pattern, content["password"]))):
			socket.sendError("Password must contain at least one lowercase letter, one uppercase letter and one special character", 9020)
			return
		if (content["password"].find(content["username"]) != -1):
			socket.sendError("Password must not contain the username", 9021)
			return
		if (User.objects.filter(mail=content["mail"]).exists()):
			socket.sendError("Mail already used", 9022)
			return
		if (User.objects.filter(username=content["username"]).exists()):
			socket.sendError("Username already used", 9023)
			return
		password = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
		new_user = User.objects.create(username=content["username"], mail=content["mail"], password=password)
		new_user.save()
		if(socket.login(new_user.id, content["username"])):
			socket.send(text_data=json.dumps({"type": "create_account", "content": "Account created"}))
		else:
			socket.sendError("Already logged in", 9012)
	except Exception as e:
		socket.sendError("An error occured while creating the account", 9024, e)
