# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    readMessage.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/28 21:03:27 by tomoron           #+#    #+#              #
#    Updated: 2024/09/28 21:18:29 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db.models import Q
from asgiref.sync import sync_to_async
from ..models import User, Message

@sync_to_async
def readMessage(socket, content):
	try:
		if("id" not in content):
			socket.sendError("Missing field", 9034)
		dbUser = User.objects.filter(id=content["id"])
		if(not dbUser.exists):
			socket.sendError("User not found", 9008)
			return
		dbUser = dbUser[0]
		dbSocketUser = User.objects.get(id=socket.id)
		Message.objects.filter(Q(to=dbSocketUser) & Q(sender=dbUser) & Q(read=False)).update(read=True)
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
