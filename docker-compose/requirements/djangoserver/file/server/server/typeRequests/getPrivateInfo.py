# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateInfo.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/25 22:51:55 by edbernar          #+#    #+#              #
#    Updated: 2024/09/27 15:58:21 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import json

@sync_to_async
def getPrivateInfo(socket, content):
	try:
		response = {}
		user = User.objects.get(id=socket.id)
		if (user.id42 == None):
			response["is42Account"] = False
		else:
			response["is42Account"] = True
		response["username"] = user.username
		response["mail"] = user.mail
		response["discord_username"] = user.discord_username
		socket.sync_send({"type":"private_info", "content": response})
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
