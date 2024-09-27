# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changeBanner.py                                    :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/24 17:26:12 by edbernar          #+#    #+#              #
#    Updated: 2024/09/27 03:40:12 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from ..utils import genString
from random import randint
import base64
import json

@sync_to_async
def changeBanner(socket, content):
	while True:
		generate_name = genString(50) 
		if (not User.objects.filter(banner=f"/banner/{generate_name}.jpg").exists()):
			break
	user = User.objects.get(id=socket.id)
	user.banner = f"/banner/{generate_name}.jpg"
	user.save()
	with open(f"/var/www/djangoserver/banner/{generate_name}.jpg", "wb") as image_file:
		image_file.write(base64.b64decode(content["img"]))
	socket.sync_send(json.dumps({"type": "change_pfp", "content": {'banner': user.banner}}))
