# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/08/09 08:52:38 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from typeRequets.login import userList
import random
import re

pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$'

# {'username': 'Kumita', 'mail': 'eddydhj@gmail.com', 'password': '3b19482535d1ab2f4e3c629c4e3e5e2d6af0a5f5280be190726a4c3be518a475'}


async def createAccount(userClass, content):
	try:
		content["mail"] = content["mail"].lower()
		if (content["mail"].find('@') == -1 or content["mail"].find('.') == -1):
			await userClass.sendError("Invalid mail", 9006)
			return
		if (content["username"].find(' ') != -1):
			await userClass.sendError("Username must not contain spaces", 9007)
			return
		if (len(content["username"]) < 3):
			await userClass.sendError("Username must be at least 3 characters long", 9008)
			return
		if (len(content["username"]) > 20):
			await userClass.sendError("Username must be at most 20 characters long", 9009)
			return
		if (content["username"].find(' ') != -1):
			await userClass.sendError("Username must not contain spaces", 9011)
			return
		if (content["username"].isalnum() == False):
			await userClass.sendError("Username must contain only letters and numbers", 9012)
			return
		if (len(content["password"]) < 8):
			await userClass.sendError("Password must be at least 8 characters long", 9013)
			return
		if (bool(re.match(pattern, content["password"]))):
			await userClass.sendError("Password must contain at least one lowercase letter, one uppercase letter and one special character", 9014)
			return
		if (content["password"].find(content["username"]) != -1):
			await userClass.sendError("Password must not contain the username", 9015)
			return
		if (content["mail"] in userList):
			await userClass.sendError("Mail already used", 9016)
			return
		if (content["username"] in userList):
			await userClass.sendError("Username already used", 9017)
			return
		content["token"] = generateToken()
		while (True):
			content["id"] = random.randint(1000000, 9999999)
			if (content["id"] not in userList):
				break
		userList.append(content)
		await userClass.send({"type": "create_account", "content": "Account created"})
	except Exception as e:
		await userClass.sendError("Error create account", 9005, e)

def generateToken():
	list = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	token = ""

	for i in range(0, 35):
		token += list[random.randint(0, len(list) - 1)]
	return token