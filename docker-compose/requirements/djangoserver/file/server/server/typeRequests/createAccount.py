# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/09/16 13:39:22 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from email.mime.multipart import MIMEMultipart
from ..models import User, MailVerify
from ..data import ICLOUD_USER, ICLOUD_PASS, SERVER_URL
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from asgiref.sync import sync_to_async
import smtplib
import random
import re
import json
import hashlib

mail_pattern = "^((?!\\.)[\\w\\-_.]*[^.])(@\\w+)(\\.\\w+(\\.\\w+)?[^.\\W])$"
password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
allowed_char_username = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
URLMAIL = SERVER_URL + "/verify?token="

@sync_to_async
def createAccount(socket, content):
	print("create account")
	if (socket.logged_in):
		socket.sendError("Already logged in", 9012)
		return;
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
		if (not all(c in allowed_char_username for c in content["username"])):
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
		print("send")
		socket.sync_send(json.dumps({"type": "create_account", "content": "Account created"}))
		if(not sendVerifMail(verif_str, content["mail"], content["username"])):
			print("mail error")
			socket.sendError("An error occured while sending the email, glhf", 2026)
	except Exception as e:
		print("error")
		socket.sendError("An error occured while creating the account", 9024, e)

def sendVerifMail(verif_str, mail, username):
	msg = MIMEMultipart()
	msg['From'] = 'PTME <ptme@tmoron.fr>'
	msg['To'] = mail
	msg['Subject'] = 'Account verification'
	msg.attach(MIMEText('''
	<!DOCTYPE html>
	<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			body {
				margin: 0;
				padding: 0;
				font-family: Arial, sans-serif;
				background-color: #1e1e1e;
				color: #ffffff;
			}
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				background-color: #2c2c2c;
				border-radius: 8px;
			}
			h1 {
				text-align: center;
				font-size: 24px;
				margin-bottom: 50px;
				background-color: #1e1e1e;
				padding: 20px;
				border-radius: 8px;
				color: #ffffff;
			}
			p {
				color: #cccccc;
				font-size: 16px;
			}
			.button {
				display: inline-block;
				padding: 10px 20px;
				font-size: 16px;
				color: #ffffff;
				background-color: #0f0f0f;
				border-radius: 5px;
				text-decoration: none;
				margin: 20px;
				margin-left: 25%;
				margin-right: 25%;
				width: 50%;
				text-align: center;
			}
			.footer {
				font-size: 12px;
				background-color: #1e1e1e;
				padding: 10px;
				text-align: center;
				border-radius: 8px;
				margin-top: 20px;
			}
		</style>
	</head>
	<body>
		<table class="container" role="presentation">
			<tr>
				<td>
					<h1>Bienvenue chez PTME !</h1>
					<p>Bonjour ''' + username + ''',</p>
					<p>Merci d'avoir créé un compte avec PTME ! Nous sommes ravis de vous accueillir parmi nous.</p>
					<p>Pour compléter votre inscription, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :</p>
					<p><a href="''' + URLMAIL + verif_str +'''" class="button">Confirmer mon adresse e-mail</a></p>
					<p>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet e-mail.</p>
					<p>Merci,</p>
					<p>L'équipe PTME</p>
					<div class="footer">
						<p>42, 49 Bd Besson Bey, 16000 Angoulême, France</p>
					</div>
				</td>
			</tr>
		</table>
	</body>
	</html>
	''', 'html'))
	try:
		serveur = smtplib.SMTP('smtp.mail.me.com', 587)
		serveur.ehlo()
		serveur.starttls()
		serveur.ehlo()
		serveur.login(ICLOUD_USER, ICLOUD_PASS)
		serveur.sendmail(ICLOUD_USER, mail, msg.as_string())
		serveur.quit()
		print("E-mail envoyé avec succès !")
		return(74725)
	except Exception as e:
		print(f"Erreur lors de l'envoi de l'e-mail : {e}")
		return(0)

def gen_string(length):
	letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return(''.join(random.choice(letters) for i in range(length)))
