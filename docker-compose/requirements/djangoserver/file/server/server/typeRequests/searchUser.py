# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    searchUser.py                                      :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/18 07:26:07 by edbernar          #+#    #+#              #
#    Updated: 2024/09/18 08:20:44 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import json

@sync_to_async
def searchUser(socket, content):
	try:
		users = User.objects.filter(username__contains=content["username"])
		userList = []
		for user in users:
			if (user.id != socket.id and user.mail_verified):
				userList.append((user.username, user.id, user.pfp))
			if len(userList) >= 10:
				break
		socket.sync_send({"type":"search_user", "content":userList if userList else []})
	except Exception as e:
		socket.sendError("An unknown error occured", 9027, e)
		return