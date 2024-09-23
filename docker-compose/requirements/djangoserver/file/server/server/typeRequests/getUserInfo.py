# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getUserInfo.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/20 00:16:57 by edbernar          #+#    #+#              #
#    Updated: 2024/09/23 14:37:28 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import json

@sync_to_async
def getUserInfo(socket, content):
	try:
		if (content.get('id')):
			user = User.objects.filter(id=content['id']).values().first()
		elif (content.get('username')):
			user = User.objects.filter(username=content['username']).values().first()
		else:
			user = None
		if (not user):
			socket.sync_send({"type":"user_info", "content": None})
			return
		online = True if user['id'] in socket.onlinePlayers else False
		print("User is online: ", online)
		socket.sync_send({"type":"user_info", "content":{'username': user['username'], 'pfp': user['pfp'], 'banner': user['banner'], 'id': user['id'], 'online': online}})
	except Exception as e:
		socket.sendError("invalid request", 9005, e)