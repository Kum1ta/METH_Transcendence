# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    searchUser.py                                      :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/18 07:26:07 by edbernar          #+#    #+#              #
#    Updated: 2024/09/29 02:40:51 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from django.db.models import Q
import json

@sync_to_async
def searchUser(socket, content):
	try:
		users = User.objects.filter(Q(username__icontains=content["username"]) & ~Q(id=socket.id))[:10]
		userList = []
		for user in users:
			userList.append((user.username, user.id, user.pfp))
		socket.sync_send({"type":"search_user", "content":userList})
	except Exception as e:
		socket.sendError("An unknown error occured", 9027, e)
		return
