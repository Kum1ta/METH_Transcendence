# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    sendPrivateMessage.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/04 13:44:11 by edbernar          #+#    #+#              #
#    Updated: 2024/11/20 14:49:59 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User, Message
from django.db.models import Q
import json

@sync_to_async
def sendPrivateMessage(socket, content):
	try:
		dest = User.objects.filter(id=content["to"])
		if(not dest.exists()):
			socket.sendError("User not found", 9008)
			return
		user = User.objects.filter(id=socket.id)
		if(int(content["to"]) == user[0].id or len(content["content"]) == 0 or len(content["content"]) > 2000):
			socket.sendError("Invalid message sent", 9009)
		new_msg = Message.objects.create(sender=user[0], to=dest[0], content=content["content"])
		new_msg.save()
		if(Message.objects.filter((Q(sender=user[0]) & Q(to=dest[0])) | (Q(sender=dest[0]) & Q(to=user[0]))).count() > 100):
			Message.objects.filter((Q(to=id) & Q(sender=other_id)) | (Q(to=other_id) & Q(sender=id))).order_by('date').first().delete()

		jsonVar = {"type": "new_private_message", "content": {
			"from": new_msg.sender.id,
			"channel": content["to"],
			"content": content["content"],
			"date": new_msg.date.strftime("%H:%M:%S %d/%m/%Y")
		}}
		socket.sync_send(json.dumps(jsonVar))
		if(content["to"] in socket.onlinePlayers):
			jsonVar = {"type": "new_private_message", "content": {
				"from": new_msg.sender.id,
				"channel": new_msg.sender.id,
				"content": content["content"],
				"date": new_msg.date.strftime("%H:%M:%S %d/%m/%Y")
			}}
			socket.onlinePlayers[content["to"]].sync_send(json.dumps(jsonVar))
	except Exception as e:
		socket.sendError("Invalid message sent", 9009, e)
