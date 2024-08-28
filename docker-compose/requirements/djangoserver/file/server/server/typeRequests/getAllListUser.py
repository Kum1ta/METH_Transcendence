# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getAllListUser.py                                  :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/08/28 18:22:43 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import json
from django.db.models import Q
from ..models import Message, User

def getAllListUser(socket, content=None):
	uid = socket.scope["session"].get("uid", 0)
	res = User.objects.filter(~Q(id=uid))
	data = []
	for x in res:
		data.append({"name":x.username, "pfp":x.pfp, "id":x.id})
	socket.send(text_data=json.dumps({"type": "all_list_user", "content": data}))
