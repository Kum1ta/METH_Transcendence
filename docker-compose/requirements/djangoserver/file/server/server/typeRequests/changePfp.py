# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePfp.py                                       :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/23 23:35:41 by edbernar          #+#    #+#              #
#    Updated: 2024/09/24 15:53:26 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
from random import randint
import base64
import json

def	genereateRandomName():
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	len = 50
	name = "a"
	for i in range(0, len):
		name += chars[randint(0, 61)]
	return name

@sync_to_async
def changePfp(socket, content):
	while True:
		generate_name = genereateRandomName()
		if (not User.objects.filter(pfp=f"/pfp/{generate_name}.jpg").exists()):
			break
	user = User.objects.get(id=socket.id)
	user.pfp = f"/pfp/{generate_name}.jpg"
	user.save()
	with open(f"/var/www/djangoserver/pfp/{generate_name}.jpg", "wb") as image_file:
		image_file.write(base64.b64decode(content["img"]))
	socket.sync_send(json.dumps({"type": "change_pfp", "content": {'pfp': user.pfp}}))