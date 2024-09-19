# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getUserInfo.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/20 00:16:57 by edbernar          #+#    #+#              #
#    Updated: 2024/09/20 01:08:45 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import json

@sync_to_async
def getUserInfo(socket, content):
	user = User.objects.filter(id=content['id']).values().first()
	if (not user):
		socket.sync_send({"type":"user_info", "content": None})
		return
	socket.sync_send({"type":"user_info", "content":{'username': user['username'], 'pfp': user['pfp'], 'banner': user['banner']}})

