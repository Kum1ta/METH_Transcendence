# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    sendPrivateMessage.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/04 13:44:11 by edbernar          #+#    #+#              #
#    Updated: 2024/08/26 00:37:41 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ..models import User, Message
import json

def sendPrivateMessage(socket, content):
	# |Tom| Requete pour vérifier si l'user existe 
	# Si user existe pas, faire ça : socket.sendError("User not found", 9008)
	# Sinon l'ajouter à la base de données
	# |Eddy| Si user existe, envoyer le message privé aux deux personnes concernées
	# sachant que le receveur doit être connecté. Dans le cas contraire, uniquement
	# l'envoyeur recevra le message.

	try:
		dest = User.objects.filter(id=content["to"])
		if(not dest.exists()):
			socket.sendError("User not found", 9008)
			return;
		user = User.objects.filter(id=socket.scope["session"]["id"])
		new_msg = Message.objects.create(sender=user[0], to=dest[0], content=content["content"])
		new_msg.save()
		jsonVar = {"type": "new_private_message", "content": {
			"from": new_msg.sender.id,
			"channel": content["to"],
			"content": content["content"],
			"date": new_msg.date.strftime("%H:%M:%S %d/%m/%Y")
		}}
		socket.send(text_data=json.dumps(jsonVar))
	except Exception as e:
		socket.sendError("Invalid message sent", 9009, e)
