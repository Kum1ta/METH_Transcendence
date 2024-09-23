# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    changePfp.py                                       :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/23 23:35:41 by edbernar          #+#    #+#              #
#    Updated: 2024/09/23 23:48:45 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from asgiref.sync import sync_to_async
from ..models import User
import base64
import json

@sync_to_async
def changePfp(socket, content):
	with open("./a.jpg", "w") as image_file:
		image_file.write(content["img"])