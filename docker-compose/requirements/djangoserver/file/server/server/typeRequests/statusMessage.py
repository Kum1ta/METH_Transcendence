# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    statusMessage.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/28 20:03:49 by tomoron           #+#    #+#              #
#    Updated: 2024/09/28 20:20:12 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db.models import Q
from ..models import User, Message
from asgiref.sync import sync_to_async

@sync_to_async
def statusMessage(socket,content):
	try:
		user = User.objects.get(id=socket.id)
		haveUnread = Message.objects.filter(Q(to=user) & Q(read=False)).exists()
		socket.sync_send({"type":"status_message","content":{"haveUnread" : haveUnread}})
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
