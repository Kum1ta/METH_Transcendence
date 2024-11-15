# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    statusMessage.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/28 20:03:49 by tomoron           #+#    #+#              #
#    Updated: 2024/11/15 22:00:54 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db.models import Q
from ..models import User, Message
from asgiref.sync import sync_to_async

@sync_to_async
def getUnreadStatus(uid):
	if(uid == None or uid == 0):
		return(False)
	user = User.objects.get(id=uid)
	return(Message.objects.filter(Q(to=user) & Q(read=False) & Q(sender__isnull=False)).exists())

async def statusMessage(socket,content):
	try:
		haveUnread = await getUnreadStatus(socket.id)
		socket.sync_send({"type":"status_message","content":{"haveUnread" : haveUnread}})
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
