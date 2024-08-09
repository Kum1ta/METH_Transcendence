# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login42.py                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 09:32:17 by edbernar          #+#    #+#              #
#    Updated: 2024/08/09 10:03:54 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import requests
import json
import os

UID42 = os.environ.get("uid")
SECRET42 = os.environ.get("secret")
TOKENURL = 'https://api.intra.42.fr/oauth/token'
INFOURL = 'https://api.intra.42.fr/v2/me'

access_token = ""

def main42login(content):
	global access_token

	print(UID42)
	print(SECRET42)
	data = {
		'grant_type': 'client_credentials',
		'client_id': UID42,
		'client_secret': SECRET42,
	}
	response = requests.post(TOKENURL, data=data)
	access_token = response.json()["access_token"]
	data = {
		'grant_type': 'authorization_code',
		'client_id': UID42,
		'client_secret': SECRET42,
		'code': content["token"],
		'redirect_uri': 'http://localhost:3000',
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': 'Bearer ' + access_token})
	
	if (response.status_code != 200):
		raise Exception("")
	
	response = response.json()
	print(response)
	