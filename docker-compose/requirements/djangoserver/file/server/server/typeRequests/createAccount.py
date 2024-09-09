# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/09/09 21:10:56 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ..models import User, MailVerify
import random
import re
import json
import hashlib

mail_pattern = "^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$"
password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

def createAccount(socket, content):
	if (socket.logged_in):
		socket.sendError("Already logged in", 9012)
	try:
		if (not bool(re.match(mail_pattern, content["mail"]))):
			socket.sendError("Invalid mail", 9014)
			return
		if (content["username"].find(' ') != -1):
			socket.sendError("Username must not contain spaces", 9015)
			return
		if (len(content["username"]) < 3):
			socket.sendError("Username must be at least 3 characters long", 9016)
			return
		if (len(content["username"]) > 20):
			socket.sendError("Username must be at most 20 characters long", 9017)
			return
		if (content["username"].isalnum() == False):
			socket.sendError("Username must contain only letters and numbers", 9018)
			return
		if (len(content["password"]) < 8):
			socket.sendError("Password must be at least 8 characters long", 9019)
			return
		if (not bool(re.match(password_pattern, content["password"]))):
			socket.sendError("Password must contain at least one lowercase letter, one uppercase letter and one special character", 9020)
			return
		if (content["password"].find(content["username"]) != -1):
			socket.sendError("Password must not contain the username", 9021)
			return
		if (User.objects.filter(mail=content["mail"]).exists()):
			socket.sendError("Mail already used", 9022)
			return
		if (User.objects.filter(username=content["username"]).exists()):
			socket.sendError("Username already used", 9023)
			return
		password = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
		new_user = User.objects.create(username=content["username"], mail=content["mail"], password=password)
		new_user.save()
		verif_str = gen_string(200)
		MailVerify.objects.create(uid=new_user, token=verif_str).save()
		sendVerifMail(verif_str)
		socket.send(text_data=json.dumps({"type": "create_account", "content": "Account created"}))
	except Exception as e:
		socket.sendError("An error occured while creating the account", 9024, e)

def sendVerifMail(verif_str):
	print("nope")

def gen_string(length):
	letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return(''.join(random.choice(letters) for i in range(length)))
