# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 08:10:38 by edbernar          #+#    #+#              #
#    Updated: 2024/08/27 23:40:35 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .login42.login42 import main42login
from ..models import User
import hashlib
import requests
import json
import os

# Les requêtes de login peuvent être de 3 types:
# <-- {"type" : "login", "content" : {"type": "byToken", "token": "123456"}}
# <-- {"type" : "login", "content" : {"type": "byPass", "mail": "aaa@a.com", "pass": "dasd"}}
# <-- {"type" : "login", "content" : {"type": "by42", "token": "1dsa23dsa456"}} 
# --> {"type" : "login", "content" : {"username": "". "token": "", "id": 0}}

userList = [
	{
		"username": "Eddy",
		"token": "54dsadw8f4a6w5f4a62s4f984fa62f4as65",
		"mail": "aaaaa",
		"password": "ed968e840d10d2d313a870bc131a4e2c311d7ad09bdf32b3418147221f51a6e2", # not hashed : aaaaa
		"id": 2135421,
		"id42": -1
	},
	{
		"username": "Hugo",
		"token": "dsa4d6sa4sa1hfd1jhgk6g4k21bn65m4nb4",
		"mail": "bbbbb",
		"password": "bbbbb",
		"id": 9892154,
		"id42": -1
	},
	{
		"username": "Mathis",
		"token": "8cb1qjlfndc12mn2l1mn654xzkkhad54cxz",
		"mail": "ccccc",
		"password": "6304fbfe2b22557c34c42a70056616786a733b3d09fb326308c813d6ab712ec0", # not hashed : ccccc
		"id": 2371234,
		"id42": -1
	},
	{
		"username": "Tom",
		"token": "poiuygfvbdsv5c21vcxvcxhgbjqnkmds546",
		"mail": "ddddd",
		"password": "ddddd",
		"id": 6423457,
		"id42": -1
	}
]

def loginByPass(socket, content):
	password_hash = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
	user = User.objects.filter(mail=content["mail"], password=password_hash)
	if(user.exists()):
		if(socket.login(user[0].id, user[0].username)):
			socket.send(text_data=json.dumps({"type":"logged_in", "content":{
				"status":True,
				"username":user[0].username,
				"id": user[0].id,
			}}))
		else:
			socket.sendError("Already logged in", 9012)
	else:
		socket.send(text_data=json.dumps({"type": "error", "content": "Invalid email or password", "code": 9007}))



def loginBy42(socket, content):
	# |TOM| Requete pour récuperer les informations de l'utilisateur selon l'intra de la personne
	# et créer un token si celui-ci n'existe pas
	try:
		main42login(socket, content, userList)
	except Exception as e:
		socket.sendError("Invalid 42 token", 9010, e)

def login(socket, content):
	# |TOM| Faire 3 types de requêtes:
	# - byPass: Récupérer les informations de l'utilisateur en fonction de mail et de son mot de passe
	# - by42: Récupérer les informations de l'utilisateur en fonction de son token42 (qui sera different du token)
	#	- will probably change
	try:
		if (content["type"] == "byPass"):
			loginByPass(socket, content)
		elif (content["type"] == "by42"):
			loginBy42(socket, content)
		else:
			socket.sendError("Invalid login type", 9006)
	except Exception as e:
		socket.sendError("Invalid request", 9005, e)
