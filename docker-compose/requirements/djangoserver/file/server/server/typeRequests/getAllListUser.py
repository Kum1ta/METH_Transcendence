# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getAllListUser.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/09/14 18:31:09 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import json
from django.db.models import Q
from ..models import Message, User
from asgiref.sync import sync_to_async

@sync_to_async
def getAllListUser(socket, content=None):
	uid = socket.id
	res = User.objects.filter(~Q(id=uid))
	data = []
	for x in res:
		data.append({"name":x.username, "pfp":x.pfp, "id":x.id})
	socket.sync_send(json.dumps({"type": "all_list_user", "content": data}))
