# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePrivateInfo.py                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/25 23:28:49 by edbernar          #+#    #+#              #
#    Updated: 2024/09/27 03:23:10 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from ..fieldsVerif import usernameValid, passwordValid, discordValid
import hashlib
import json

@sync_to_async
def changePrivateInfo(socket, content):
	try:
		user = User.objects.get(id=socket.id)
		if ("delete" in content):
			user.delete()
			socket.scope["session"].delete()
			socket.sync_send(json.dumps({"type": "change_private_info", "content": "Successfully deleted."}))
			socket.close()
			return;
		elif ("username" in content):
			if (not usernameValid(content.get("username"), socket)):
				return
			user.username = content["username"]
			socket.username = content["username"]
			socket.scope["session"]['username'] = content["username"]
		elif ("new_password" in content):
			if (not passwordValid(content.get("new_password"), socket)):
				return
			if (not content.get("old_password")):
				socket.sendError("You must provide your current password to change it",9030)	
				return
			if (hashlib.md5((user.mail + content["old_password"]).encode()).hexdigest() != user.password):
				socket.sendError("Invalid password", 9029)
				return
			user.password = hashlib.md5((user.mail + content["new_password"]).encode()).hexdigest()
		elif ("discord" in content):
			if (not discordValid(content.get("discord"), socket)):
				return
			if (content["discord"] == ""):
				user.discord_username = None
			else:
				user.discord_username = content["discord"]
		else:
			socket.sendError("You must provide a field to update", 9028)
			return;
		user.save()
		socket.scope["session"].save()
		socket.sync_send(json.dumps({"type": "change_private_info", "content": "Successfully updated."}))
	except Exception as e:
		socket.sendError("An unknown error occured", 9027, e)
