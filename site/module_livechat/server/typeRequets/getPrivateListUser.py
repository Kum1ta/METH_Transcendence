# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getPrivateListUser.py                              :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/03 15:10:23 by edbernar          #+#    #+#              #
#    Updated: 2024/08/03 17:07:21 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import websockets
import asyncio
import json

data = [
		{
			"name": "Nessundorma",
			"status": "online",
			"pfp": "https://wallpapers-clan.com/wp-content/uploads/2023/05/cool-pfp-02.jpg"
		},
		{
			"name": "Succotash",
			"status": "offline",
			"pfp": "https://i.pinimg.com/200x/28/75/96/287596f98304bf1adc2c411619ae8fef.jpg"
		},
		{
			"name": "Astropower",
			"status": "online",
			"pfp": "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg"
		},
		{
			"name": "Assaultive",
			"status": "offline",
			"pfp": "https://i1.sndcdn.com/artworks-1Li0JIJrQGlojD3y-AEiNkw-t500x500.jpg"
		},
		{
			"name": "Redshock",
			"status": "offline",
			"pfp": "https://cdn.pfps.gg/pfps/7094-boy-pfp.png"
		},
		{
			"name": "Parley",
			"status": "offline",
			"pfp": "https://pbs.twimg.com/media/EscE6ckU0AA-Uhe.png"
		},
]

async def getPrivateListUser(userClass):
	# |TOM| Faire une requête à la base de données pour récupérer la liste des
	# utilisateurs qui doivent apparaitre dans la liste du chat privé
	# (ceux qui ont eu conversation avec l'utilisateur)
	await userClass.send({"type": "get_private_list_user", "content": data})