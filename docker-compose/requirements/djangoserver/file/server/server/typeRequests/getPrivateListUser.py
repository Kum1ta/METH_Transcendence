# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/08/27 23:57:44 by tomoron          ###   ########.fr        #
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

def getPrivateListUser(socket, content=None):
	# |TOM| Faire une requête à la base de données pour récupérer la liste des
	# utilisateurs qui doivent apparaitre dans la liste du chat privé
	# (ceux qui ont eu conversation avec l'utilisateur)
	# Si user existe pas, faire ça : socket.sendError("User not found", 9008)
	id = socket.scope["session"].get("id", 0)
	request = """
		SELECT DISTINCT server_user.id AS id, username, pfp
		FROM server_user
		LEFT JOIN server_message AS sended ON sended.to_id=server_user.id
		LEFT JOIN server_message AS received ON received.sender_id=server_user.id
		WHERE sended.sender_id=%s OR received.to_id=%s;
	"""
	res = User.objects.raw(request,[id,id])
	data = []
	for x in res:
		status = "online" if x.id in socket.onlinePlayers else "offline"
		data.append({"name":x.username, "status": status, "pfp":x.pfp, "id":x.id})
	socket.send(text_data=json.dumps({"type": "private_list_user", "content": data}))
