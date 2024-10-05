# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePfp.py                                       :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/23 23:35:41 by edbernar          #+#    #+#              #
#    Updated: 2024/10/04 21:13:28 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from ..utils import genString
from random import randint
import base64
import json

@sync_to_async
def changePfp(socket, content):
	while True:
		generate_name = genString(50) 
		if (not User.objects.filter(pfp=f"/pfp/{generate_name}.jpg").exists()):
			break
	with open(f"/var/www/djangoserver/pfp/{generate_name}.jpg", "wb") as image_file:
		image_file.write(base64.b64decode(content["img"]))
	user = User.objects.get(id=socket.id)
	user.pfp = f"/pfp/{generate_name}.jpg"
	user.save()
	socket.pfp = user.pfp
	socket.scope["session"]["pfp"] = user.pfp
	socket.scope["session"].save()
	socket.sync_send(json.dumps({"type": "change_pfp", "content": {'pfp': user.pfp}}))
