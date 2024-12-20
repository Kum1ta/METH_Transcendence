# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    createAccount.py                                   :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: marvin <marvin@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/08/09 08:08:00 by edbernar          #+#    #+#              #
#    Updated: 2024/11/19 16:53:40 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from email.mime.multipart import MIMEMultipart
from ..models import User, MailVerify
from ..data import ICLOUD_USER, ICLOUD_PASS, SERVER_URL
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from asgiref.sync import sync_to_async
from ..fieldsVerif import mailValid, usernameValid, passwordValid
from ..utils import genString
from django.utils import timezone
import smtplib
import random
import re
import json
import hashlib
from threading import Thread

URLMAIL = SERVER_URL + "/verify?token="

@sync_to_async
def createAccount(socket, content):
	if (socket.logged_in):
		socket.sendError("Already logged in", 9012)
		return;
	try:
		if(not mailValid(content["mail"], socket)):
			return
		if(not usernameValid(content["username"], socket)):
			return
		if(not passwordValid(content["password"], socket)):
			return
		password = hashlib.md5((content["mail"] + content["password"]).encode()).hexdigest()
		new_user = User.objects.create(username=content["username"], mail=content["mail"], password=password, last_login=timezone.now())
		new_user.save()
		verif_str = genString(200)
		while(MailVerify.objects.filter(token=verif_str).exists()):
			verif_str = genString(200)
		MailVerify.objects.create(uid=new_user, token=verif_str).save()
		socket.sync_send(json.dumps({"type": "create_account", "content": "Account created"}))
		thread = Thread(target = sendVerifMail, args = (verif_str, content["mail"], content["username"]))
		thread.start()
	except Exception as e:
		socket.sendError("An error occured while creating the account", 9024, e)

def sendVerifMail(verif_str, mail, username):
	msg = MIMEMultipart()
	msg['From'] = 'METH <meth@tmoron.fr>'
	msg['To'] = mail
	msg['Subject'] = 'Account verification'
	msg.attach(MIMEText('''
    <!DOCTYPE html>
    <html lang="en">
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
                    <h1>Welcome to METH!</h1>
                    <p>Hello ''' + username + ''',</p>
                    <p>Thank you for creating an account with METH! We are excited to have you with us.</p>
                    <p>To complete your registration, please verify your email address by clicking the button below:</p>
                    <p><a href="''' + URLMAIL + verif_str +'''" class="button">Confirm my email address</a></p>
                    <p>If you did not request this registration, you can safely ignore this email.</p>
                    <p>Thank you,</p>
                    <p>The METH Team</p>
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
		server = smtplib.SMTP('smtp.mail.me.com', 587)
		server.ehlo()
		server.starttls()
		server.ehlo()
		server.login(ICLOUD_USER, ICLOUD_PASS)
		server.sendmail(ICLOUD_USER, mail, msg.as_string())
		server.quit()
		return(74725)
	except Exception as e:
		return(0)
