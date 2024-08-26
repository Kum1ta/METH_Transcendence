# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/08/25 21:23:08 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import json
from ..models import Message, User

#data = [
#		{
#			"name": "Nessundorma",
#			"status": "online",
#			"pfp": "https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-pfp-02.jpg",
#			"id": 145564
#		},
#		{
#			"name": "Succotash",
#			"status": "offline",
#			"pfp": "https://i.pinimg.com/200x/28/75/96/287596f98304bf1adc2c411619ae8fef.jpg",
#			"id": 256981
#		},
#		{
#			"name": "Astropower",
#			"status": "online",
#			"pfp": "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg",
#			"id": 301547
#		},
#		{
#			"name": "Assaultive",
#			"status": "offline",
#			"pfp": "https://i1.sndcdn.com/artworks-1Li0JIJrQGlojD3y-AEiNkw-t500x500.jpg",
#			"id": 432448
#		},
#		{
#			"name": "Redshock",
#			"status": "offline",
#			"pfp": "https://cdn.pfps.gg/pfps/7094-boy-pfp.png",
#			"id": 543211
#		},
#		{
#			"name": "Parley",
#			"status": "offline",
#			"pfp": "https://pbs.twimg.com/media/EscE6ckU0AA-Uhe.png",
#			"id": 654123
#		}
#]

def getAllListUser(socket, content=None):
	id = socket.scope["session"].get("id", 0)
	res = User.objects.all()
	data = []
	for x in res:
		data.append({"name":x.username, "pfp":x.pfp, "id":x.id})
	socket.send(text_data=json.dumps({"type": "all_list_user", "content": data}))
