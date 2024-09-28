# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getUserInfo.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/20 00:16:57 by edbernar          #+#    #+#              #
#    Updated: 2024/09/28 18:35:21 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db.models import Q
from asgiref.sync import sync_to_async
from ..models import User, GameResults
import json

def getHistory(user, games):
	res = []
	for x in games:
		player = None
		opponent = None
		if(x.player1 == user):
			player = {"score":int(x.p1Score)}
			opponent = {"score":int(x.p2Score), "username":x.player2.username, "pfp":x.player2.pfp}
		else:
			player = {"score":int(x.p2Score)}
			opponent = {"score":int(x.p1Score), "username":x.player1.username, "pfp":x.player1.pfp}
		res.append({
			"id":x.id,
			"p1":player,
			"p2":opponent,
			"won":x.winner == user
		})	
	return(res)

@sync_to_async
def getUserInfo(socket, content):
	try:
		if (content.get('id')):
			user = User.objects.filter(id=content['id'])
		elif (content.get('username')):
			user = User.objects.filter(username=content['username'])
		else:
			user = None
		if (not user or not user.exists()):
			socket.sync_send({"type":"user_info", "content": None})
			return
		user = user[0]
		games = GameResults.objects.filter(Q(player1=user) | Q(player2=user))
		nbGames = games.count()
		nbWin = games.filter(winner=user).count()
		history = getHistory(user, games.order_by("-end_date")[:10])
		online = True if user.id in socket.onlinePlayers else False
		socket.sync_send({"type":"user_info", "content":{
			'username': user.username,
			'pfp': user.pfp,
			'banner': user.banner,
			'id': user.id,
			'online': online,
			'github': user.github_link,
			'discord': user.discord_username,
			'nbWin':nbWin,
			'nbLoss':nbGames - nbWin,
			'history':history
		}})
	except Exception as e:
		socket.sendError("invalid request", 9005, e)
