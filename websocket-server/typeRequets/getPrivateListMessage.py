# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListMessage.py                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 22:53:14 by edbernar          #+#    #+#              #
#    Updated: 2024/08/06 23:32:08 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import random

listMessage = {
	"type": "private_list_message", 
	"content": [
		{
			"from": 0,
			"content": "",
			"date": "10:05 31/07/2024"
		},
		{
			"from": 0,
			"content": "",
			"date": "10:05 31/07/2024"
		},
		{
			"from": 0,
			"content": "",
			"date": "10:06 31/07/2024"
		},
		{
			"from": 0,
			"content": "",
			"date": "10:06 31/07/2024"
		},
		{
			"from": 0,
			"content": "",
			"date": "10:45 31/07/2024"
		},
		{
			"from": 0,
			"content": "",
			"date": "10:46 31/07/2024"
		}
	]
}

def generate_random_string():
	char = "abcdefghijklmnopqrstuvwxyz 123456789"
	string = ""

	for i in range(20):
		string += char[random.randint(0, len(char) - 1)]
	return string

async def getPrivateListMessage(userClass, content):
	# |TOM| Requete pour avoir la liste des messages privés grace à l'id de l'utilisateur
	copyListMessage = listMessage.copy()
	for message in copyListMessage["content"]:
		if (random.randint(1, 10) % 2 == 0):
			message["from"] = 9999999
		else:
			message["from"] = content["id"]
		message["content"] = generate_random_string()
	await userClass.send(copyListMessage)
		
