# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login42.py                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 09:32:17 by edbernar          #+#    #+#              #
#    Updated: 2024/08/22 19:13:31 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import requests
import json
import os

UID42 = os.environ.get("UID_42")
SECRET42 = os.environ.get("SECRET_42")
TOKENURL = 'https://api.intra.42.fr/oauth/token'
INFOURL = 'https://api.intra.42.fr/v2/me'
REDIRECT = 'http://127.0.0.1:5500/site/'
# |Eddy| Changer le redirect quand il y aura un vrai serveur

access_token = ""

if (UID42 == None or SECRET42 == None):
	print("Please set the environment variables uid and secret")
	exit()

async def main42login(socket, content, userList):
	global access_token

	print(content['token'])
	data = {
		'grant_type': 'authorization_code',
		'client_id': UID42,
		'client_secret': SECRET42,
		'code': content['token'],
		'redirect_uri': REDIRECT
	}
	response = requests.post(TOKENURL, data=data)
	if (response.status_code != 200):
		raise Exception(f"Problem with the request (access_token {response.status_code})")
	response = response.json()
	headers = {
		'Authorization': f'Bearer {response["access_token"]}',
	}
	response = requests.get(INFOURL, headers=headers)
	if (response.status_code != 200):
		raise Exception(f"Problem with the request (user info {response.status_code})")
	response = response.json()
	# |Tom| Au lieu d'utiliser userList, faire une requête à la base de donnée pour savoir si on a un utilisateur avec cet id42
	i = 0
	while (i < len(userList)):
		if (userList[i]['id42'] == response['id']):
			break
		i += 1
	if (i == len(userList)):
		await socket.sendError("Not user registered with this 42 account", 9011)
		return
	else:
		await socket.send({
			"type": "login",
			"content": {
				"username": userList[i]['username'],
				"token": userList[i]['token'],
				"id": userList[i]['id']
			}
		})
	

	
