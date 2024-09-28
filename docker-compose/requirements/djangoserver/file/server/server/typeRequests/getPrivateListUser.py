# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/09/28 20:42:02 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import json
from ..models import Message, User
from django.db.models import Q
from asgiref.sync import sync_to_async

@sync_to_async
def getPrivateListUser(socket, content=None):
	try:
		uid = socket.id
		request = """
			SELECT DISTINCT server_user.id AS id, username, pfp
			FROM server_user
			LEFT JOIN server_message AS sended ON sended.to_id=server_user.id
			LEFT JOIN server_message AS received ON received.sender_id=server_user.id
			WHERE sended.sender_id=%s OR received.to_id=%s;
		"""
		res = User.objects.raw(request,[uid,uid])
		socketUser = User.objects.get(id=uid)
		data = []
		for x in res:
			unread = Message.objects.filter(Q(sender=x) & Q(to=socketUser) & Q(read=False)).exists()
			status = "online" if x.id in socket.onlinePlayers else "offline"
			data.append({"name":x.username, "status": status, "pfp":x.pfp, "id":x.id,"haveUnread":unread})
		socket.sync_send(json.dumps({"type": "private_list_user", "content": data}))
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
