# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/09/14 18:31:45 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import asyncio
import json
from ..models import Message, User
from asgiref.sync import sync_to_async

@sync_to_async
def getPrivateListUser(socket, content=None):
	# |TOM| Faire une requête à la base de données pour récupérer la liste des
	# utilisateurs qui doivent apparaitre dans la liste du chat privé
	# (ceux qui ont eu conversation avec l'utilisateur)
	# Si user existe pas, faire ça : socket.sendError("User not found", 9008)
	id = socket.id
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
	socket.sync_send(json.dumps({"type": "private_list_user", "content": data}))
