# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    sendPrivateMessage.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/04 13:44:11 by edbernar          #+#    #+#              #
#    Updated: 2024/08/04 15:48:24 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from datetime import datetime

async def sendPrivateMessage(userClass, content):
	# |Tom| Requete pour vérifier si l'user existe 
	# Si user existe pas, faire ça : await userClass.sendError("User not found", 9008)
	# Sinon l'ajouter à la base de données
	# |Eddy| Si user existe, envoyer le message privé aux deux personnes concernées
	# sachant que le receveur doit être connecté. Dans le cas contraire, uniquement
	# l'envoyeur recevra le message.

	try:
		time = content["time"]
		time = datetime.strptime(time, "%Y-%m-%dT%H:%M:%S.%fZ")
		time = time.strftime("%H:%M %d/%m/%Y")
		jsonVar = {"type": "new_private_message", "content": {
			"from": content["from"],
			"channel": content["to"],
			"content": content["content"],
			"date": time
		}}
		await userClass.send(jsonVar)
	except Exception as e:
		await userClass.sendError("Invalid message sent", 9009, e)