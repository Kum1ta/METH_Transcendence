# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    fieldsVerif.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/27 02:22:43 by tomoron           #+#    #+#              #
#    Updated: 2024/09/27 03:34:11 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import re
from .models import User

mail_pattern = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$"

def usernameValid(username, socket=None):
	err = None
	code = 0

	if (username.find(' ') != -1):
		err = "Username must not contain spaces"
		code = 9015
	elif (len(username) < 3):
		err = "Username must be at least 3 characters long"
		code = 9016
	elif (len(username) > 20):
		err = "Username must be at most 20 characters long"
		code = 9017
	elif (not all(c in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_" for c in username)):
		err = "Username must contain only letters and numbers"
		code = 9018
	elif (User.objects.filter(username=username).exists()):
		err = "Username already used"
		code = 9023

	if(err and socket != None):
		socket.sendError(err, code)
	return(err == None)

def passwordValid(password, socket=None):
	password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
	err = None
	code = 0

	if (len(password) < 8):
		err = "Password must be at least 8 characters long"
		code = 9019
#	elif (password.find(content["username"]) != -1):
#		err = "Password must not contain the username"
#		code = 9021
	elif (not bool(re.match(password_pattern, password))):
		err = "Password must contain at least one lowercase letter, one uppercase letter and one special character"
		code = 9020

	if(err and socket != None):
		socket.sendError(err, code)
	return(err == None)


def discordValid(user, socket=None):
	discord_pattern = "^[a-zA-Z0-9_.]{0,32}$"
	err = None
	code = 0

	if (len(user) > 32):
		err = "Discord username must be at most 32 characters long"
		code = 9024
	elif (not bool(re.match(discord_pattern, user))):
		err = "Discord username must between 2 and 32 letters, numbers, underscores or points"
		code = 9025
	elif (len(user) == 1):
		err = "Discord username must be at least 2 characters long"
		code = 9026

	if(err and socket != None):
		socket.sendError(err, code)
	return(err == None)

def mailValid(mail, socket=None):
	mail_pattern = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$"
	err = None
	code = 0

	if (not bool(re.match(mail_pattern, mail))):
		err = "Invalid mail"
		code = 9014
	if (User.objects.filter(mail=mail).exists()):
		err = "Mail already used"
		code = 9022
	
	if(err and socket != None):
		socket.sendError(err, code)
	return(err == None)
