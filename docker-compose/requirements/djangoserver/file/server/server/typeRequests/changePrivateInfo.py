# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePrivateInfo.py                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/25 23:28:49 by edbernar          #+#    #+#              #
#    Updated: 2024/09/27 16:00:05 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from ..fieldsVerif import usernameValid, passwordValid, discordValid
import hashlib
import json

def changePassword(socket, user, old, new):
	if(user.id42 == None):
		socket.sendError("You can't set or change this field if you have a 42 account", 9031)
		return(False)
	if (old == None):
		socket.sendError("You must provide your current password to change it",9030)	
		return(False)
	if (hashlib.md5((user.mail + old).encode()).hexdigest() != user.password):
		socket.sendError("Invalid password", 9029)
		return(False)
	if (not passwordValid(new, socket)):
		return(False)
	user.password = hashlib.md5((user.mail + new).encode()).hexdigest()
	socket.sync_send(json.dumps({"type": "change_private_info", "content": "Password successfully updated."}))
	user.save()
	return(True)

def changeDiscord(socket, name, user):
	if (not discordValid(name, socket)):
		return(False)
	if (name == ""):
		user.discord_username = None
	else:
		user.discord_username = name 
	user.save()
	socket.sync_send(json.dumps({"type": "change_private_info", "content": "Discord successfully updated."}))
	return(True)

def changeUsername(socket, username, user):
	if (not usernameValid(username, socket)):
		return(False)
	user.username = username
	socket.username = username
	socket.scope["session"]['username'] = username
	user.save()
	socket.scope["session"].save()
	socket.sync_send(json.dumps({"type": "change_private_info", "content": "Username successfully updated."}))
	return(True)

def deleteAccount(socket,user):
	user.delete()
	socket.scope["session"].delete()
	socket.sync_send(json.dumps({"type": "change_private_info", "content": "Successfully deleted."}))
	socket.close()

@sync_to_async
def changePrivateInfo(socket, content):
	try:
		user = User.objects.get(id=socket.id)
		if ("delete" in content):
			deleteAccount(socket, user)
			return
		if ("username" in content):
			changeUsername(socket, content["username"], user)
		if ("new_password" in content):
			changePassword(socket, user, content.get("old_password", None), content["new_password"])
		if ("discord" in content):
			changeDiscord(socket,content["discord"], user)
	except Exception as e:
		socket.sendError("An unknown error occured", 9027, e)
