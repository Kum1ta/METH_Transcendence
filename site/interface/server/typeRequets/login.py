# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/08/04 15:51:04 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import requests
import json

# Les requêtes de login peuvent être de 3 types:
# <-- {"type" : "login", "content" : {"type": "byToken", "token": "123456"}}
# <-- {"type" : "login", "content" : {"type": "byPass", "mail": "aaa@a.com", "pass": "dasd"}}
# <-- {"type" : "login", "content" : {"type": "by42", "token": "1dsa23dsa456"}} 
# --> {"type" : "login", "content" : {"username": "". "token": "", "id": 0}}

userList = [
	{
		"username": "Nexalith",
		"token": "IDSNCSDAd465sd13215421",
		"mail": "eddy@ediwor.fr",
		"password": "ABC123",
		"id": 9999999
	},
	{
		"username": "user2",
		"token": "789123",
		"mail": "bb@bb.fr",
		"password": "DEF456",
		"id": 2
	},
	{
		"username": "user3",
		"token": "456789",
		"mail": "cc@cc,fr",
		"password": "GHI789",
		"id": 3
	}
]

async def loginByToken(userClass, content):
	# |TOM| Requete pour savoir si le token est valide
	for user in userList:
		if (user["token"] == content["token"]):
			jsonVar = {"type": "login", "content": {"username": user["username"], "token": user["token"], "id": user["id"]}}
			userClass.username = jsonVar["content"]["username"]
			userClass.token = jsonVar["content"]["token"]
			userClass.id = jsonVar["content"]["id"]
			await userClass.send(jsonVar)
			return
	jsonVar = {"type": "error", "content": "Invalid token", "code": 9001}
	await userClass.send(json.dumps(jsonVar))

async def loginByPass(userClass, content):
	# |TOM| Requete pour savoir si le mail et le mot de passe sont valides
	# et créer un token si celui-ci n'existe pas
	for user in userList:
		if (user["mail"] == content["mail"] and user["password"] == content["password"]):
			jsonVar = {"type": "login", "content": {"username": user["username"], "token": user["token"], "id": user["id"]}}
			userClass.username = jsonVar["content"]["username"]
			userClass.token = jsonVar["content"]["token"]
			userClass.id = jsonVar["content"]["id"]
			await userClass.send(jsonVar)
			return
	await userClass.send({"type": "error", "content": "Invalid username or password", "code": 9007})

async def verifyToken42(token42):
	url = "https://api.intra.42.fr/v2/me"
	headers = {
		"Authorization": f"Bearer {token42}"
	}
	response = requests.get(url, headers=headers)
	# |Eddy| Regarder ce que renvoie la requete quand elle est valide pour savoir qui rechercher
	# dans la base de données
	return (response.status_code == 200)

async def loginBy42(userClass, content):
	# |TOM| Requete pour récuperer les informations de l'utilisateur selon l'intra de la personne
	# et créer un token si celui-ci n'existe pas
	for user in userList:
		if (await verifyToken42(content["token42"])):
			jsonVar = {"type": "login", "content": {"username": user["username"], "token": user["token"], "id": user["id"]}}
			await userClass.send(json.dumps(jsonVar))
			return
	jsonVar = {"type": "error", "content": "Invalid 42 token", "code": 9008}
	await userClass.send(json.dumps(jsonVar))

async def login(userClass, content):
	# |TOM| Faire 3 types de requêtes:
	# - byToken: Récupérer les informations de l'utilisateur en fonction de son token
	# - byPass: Récupérer les informations de l'utilisateur en fonction de mail et de son mot de passe
	# - by42: Récupérer les informations de l'utilisateur en fonction de son token42 (qui sera different du token)
	try:
		if (content["type"] == "byToken"):
			await loginByToken(userClass, content)
		elif (content["type"] == "byPass"):
			await loginByPass(userClass, content)
		elif (content["type"] == "by42"):
			await loginBy42(userClass, content)
		else:
			await userClass.sendError("Invalid login type", 9006)
	except Exception as e:
		await userClass.sendError("Invalid request", 9005, e)