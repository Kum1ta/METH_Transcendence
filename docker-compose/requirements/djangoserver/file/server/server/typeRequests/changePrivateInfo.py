# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePrivateInfo.py                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/25 23:28:49 by edbernar          #+#    #+#              #
#    Updated: 2024/09/26 00:41:16 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import hashlib
import json
import re

mail_pattern = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$"
password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
discord_pattern = "^[a-zA-Z0-9_.]{0,32}$"

@sync_to_async
def changePrivateInfo(socket, content):
	try:
		data = []
		if (content.get("username")):
			data.append("username")
		if (content.get("password")):
			data.append("password")
		if (content.get("discord")):
			data.append("discord")
		if (len(data) != 1):
			socket.sendError("You must provide exactly one field to update", 9028)
			return
		if (content.get("username")):
			if (content["username"].find(' ') != -1):
				socket.sendError("Username must not contain spaces", 9015)
				return
			if (len(content["username"]) < 3):
				socket.sendError("Username must be at least 3 characters long", 9016)
				return
			if (len(content["username"]) > 20):
				socket.sendError("Username must be at most 20 characters long", 9017)
				return
			if (not all(c in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_" for c in content["username"])):
				socket.sendError("Username must contain only letters and numbers", 9018)
				return
			if (User.objects.filter(username=content["username"]).exists()):
				socket.sendError("Username already used", 9023)
				return
		if (content.get("password")):
			if (len(content["password"]) < 8):
				socket.sendError("Password must be at least 8 characters long", 9019)
				return
			if (content["password"].find(content["username"]) != -1):
				socket.sendError("Password must not contain the username", 9021)
				return
			if (not bool(re.match(password_pattern, content["password"]))):
				socket.sendError("Password must contain at least one lowercase letter, one uppercase letter and one special character", 9020)
				return
		if (content.get("discord")):
			if (len(content["discord"]) > 32):
				socket.sendError("Discord must be at most 32 characters long", 9024)
				return
			if (not bool(re.match(discord_pattern, content["discord"]))):
				socket.sendError("Discord must contain only letters, numbers and underscores or points", 9025)
				return
		
		user = User.objects.get(id=socket.id)
		if (content.get("username")):
			user.username = content["username"]
			socket.username = content["username"]
			socket.scope["session"]['username'] = content["username"]
		if (content.get("password")):
			user.password = hashlib.sha256(user['mail' + content["password"]].encode()).hexdigest()
		if (content.get("discord")):
			if (content["discord"] != ""):
				user.discord_username = content["discord"]
			else:
				user.discord_username = None
		user.save()
		socket.scope["session"].save()
		socket.sync_send(json.dumps({"type": "change_private_info", "content": "Successfully updated."}))
	except Exception as e:
		socket.sendError("An unknown error occured", 9027, e)