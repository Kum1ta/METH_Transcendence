# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    login42.py                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 09:32:17 by edbernar          #+#    #+#              #
#    Updated: 2024/08/10 00:42:38 by edbernar         ###   ########.fr        #
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

if (UID42 == None or SECRET42 == None):
	print("Please set the environment variables uid and secret")
	exit()

def main42login(content):
	global access_token


	try:
		data = {
			'grant_type': 'client_credentials',
			'client_id': UID42,
			'client_secret': SECRET42,
		}
		response = requests.post(TOKENURL, data=data)
		access_token = response.json()["access_token"]
		print("Access Token: ", access_token)
		headers = {
			'Authorization': 'Bearer ' + access_token,
		}
		response = requests.get(INFOURL, headers=headers)
		print("Code: ", response.status_code)
		response = response.json()
		print(response)
	except Exception as e:
		print("Error in main42login")
		print(e)
	