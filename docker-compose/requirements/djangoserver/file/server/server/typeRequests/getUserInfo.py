# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    getUserInfo.py                                     :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/20 00:16:57 by edbernar          #+#    #+#              #
#    Updated: 2024/11/20 13:57:49 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from django.db.models import Q, Avg
from django.utils import timezone
from datetime import timedelta
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
			"won":x.winner == user,
			"forfeit":x.forfeit
		})	
	return(res)

def getStats(user):
	games = GameResults.objects.filter(Q(player1=user) | Q(player2=user))
	nbGames = games.count()
	nbWin = games.filter(winner=user).count()
	history = getHistory(user, games.order_by("-end_date")[:10])
	nbForfeitOpponent = games.filter(Q(winner=user) & Q(forfeit=True)).count()
	if(nbGames):
		forfeitRate = (100 / nbGames) * nbForfeitOpponent
	else:
		forfeitRate = 0

	averageScorePlayer1 = GameResults.objects.filter(player1=user).aggregate(Avg('p1Score'))["p1Score__avg"]
	averageScorePlayer2 = GameResults.objects.filter(player2=user).aggregate(Avg('p2Score'))["p2Score__avg"]
	if(averageScorePlayer1 == None and averageScorePlayer2 == None):
		avgGoals = 0
	elif(averageScorePlayer1 == None):
		avgGoals = averageScorePlayer2
	elif(averageScorePlayer2 == None):
		avgGoals = averageScorePlayer1
	else:
		avgGoals = (averageScorePlayer1 + averageScorePlayer2) / 2
	limit = timezone.now() - timedelta(days=30)
	nbGames30Days = games.filter(end_date__gt=limit).count()


	res = {}
	res["nbLoss"] = int(nbGames) - int(nbWin)
	res["nbWin"] = int(nbWin)
	res["forfeitRate"] = float(forfeitRate)
	res["avgGoals"] = float(avgGoals)
	res["nbGames30Days"] = int(nbGames30Days)
	res["history"] = history
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
		stats = getStats(user)
		online = True if user.id in socket.onlinePlayers else False
		socket.sync_send({"type":"user_info", "content":{
			'username': user.username,
			'pfp': user.pfp,
			'banner': user.banner,
			'id': user.id,
			'online': online,
			'github': user.github_link,
			'discord': user.discord_username,
			'elo': int(user.elo),
			'nbWin':stats["nbWin"],
			'nbLoss':stats["nbLoss"],
			'forfeitRate': stats["forfeitRate"],
			'avgGoals':stats["avgGoals"],
			'nbGames30Days':stats["nbGames30Days"],
			'history':stats["history"]
		}})
	except Exception as e:
		socket.sendError("invalid request", 9005, e)
