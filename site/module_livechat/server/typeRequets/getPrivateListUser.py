# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 22:30:13 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import websockets
import asyncio
import json

data = [
		{
			"name": "Nessundorma",
			"status": "online",
			"pfp": "https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-pfp-02.jpg",
			"id": 145564
		},
		{
			"name": "Succotash",
			"status": "offline",
			"pfp": "https://i.pinimg.com/200x/28/75/96/287596f98304bf1adc2c411619ae8fef.jpg",
			"id": 256981
		},
		{
			"name": "Astropower",
			"status": "online",
			"pfp": "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg",
			"id": 301547
		},
		{
			"name": "Assaultive",
			"status": "offline",
			"pfp": "https://i1.sndcdn.com/artworks-1Li0JIJrQGlojD3y-AEiNkw-t500x500.jpg",
			"id": 432448
		},
		{
			"name": "Redshock",
			"status": "offline",
			"pfp": "https://cdn.pfps.gg/pfps/7094-boy-pfp.png",
			"id": 543211
		},
		{
			"name": "Parley",
			"status": "offline",
			"pfp": "https://pbs.twimg.com/media/EscE6ckU0AA-Uhe.png",
			"id": 654123
		},
]

async def getPrivateListUser(userClass, content=None):
	# |TOM| Faire une requête à la base de données pour récupérer la liste des
	# utilisateurs qui doivent apparaitre dans la liste du chat privé
	# (ceux qui ont eu conversation avec l'utilisateur)
	await userClass.send({"type": "private_list_user", "content": data})