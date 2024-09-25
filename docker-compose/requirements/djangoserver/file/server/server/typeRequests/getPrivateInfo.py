# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateInfo.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/25 22:51:55 by edbernar          #+#    #+#              #
#    Updated: 2024/09/25 23:04:18 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import json

@sync_to_async
def getPrivateInfo(socket, content):
	response = {}
	user = User.objects.filter(id=socket.id).values().first()
	if (user.get('id42') == None):
		response["is42Account"] = False
	else:
		response["is42Account"] = True
	response["username"] = user.get('username')
	response["mail"] = user.get('mail')
	response["discord_username"] = user.get('discord_username')
	socket.sync_send({"type":"private_info", "content": response})