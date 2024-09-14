# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListMessage.py                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 22:53:14 by edbernar          #+#    #+#              #
#    Updated: 2024/09/14 18:31:09 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #
import random
import json
from django.db.models import Q
from asgiref.sync import sync_to_async

from datetime import datetime

from ..models import User, Message

@sync_to_async
def getPrivateListMessage(socket, content):
	# |TOM| Requete pour avoir la liste des messages privés grace à l'id de l'utilisateur
	if(not User.objects.filter(id=content["id"]).exists()):
		socket.sendError("User not found", 9008)
		return;
	id = socket.id
	other_id = content["id"]
	messages = Message.objects.filter((Q(to=id) & Q(sender=other_id)) | (Q(to=other_id) & Q(sender=id))).order_by('date')
	result = []
	for x in messages:
		result.append({"from":x.sender.id, "content": x.content, "date" : x.date.strftime("%H:%M:%S %d/%m/%Y")})
	socket.sync_send(json.dumps({"type":"private_list_message","content":result}))
		
