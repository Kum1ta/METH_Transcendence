# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    tournamentRequest.py                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/01 13:16:39 by edbernar          #+#    #+#              #
#    Updated: 2024/10/22 01:02:00 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from .tournamentActions.start import tournamentStart
from .tournamentActions.leave import tournamentLeave
from .tournamentActions.sendMessage import sendMessage
from .tournamentActions.fetchAllData import fetchAllData

# tournament request format : {"type":"tournament", "content":{"action": 1, ...}}

#server actions (actions sent by the server):
#	0 : start : tell the client if tournament is full or not exist. If not, tell the client can start the tournament
#		- exists : true/false
#		- isFull : true/false
#		- started : true/false
#		- code : code of the tournament
#
#	1 : someoneJoined : tell the client someone joined the tournament (considering clients will place depending on the order of the join)
#		- id : id of the player
#		- username : name of the player
#		- pfp : pfp of the player
#
#	2 : someoneLeft : tell the client someone left the tournament (if game not started, players will be replaced in the order of the join)
#		- id : id of the player who left
#	
#	3 : message : send a message to the tournament chat
#		- username : name of the player who send the message
#		- message : message to send
#
#	4 : startGame : tell the client (client will launch a matchmaking like invitation)
#		- id : id of the player
#		- username : name of the player
#		- skin : skin id of the player
#		- goal : goal id of the player
#
#	5 : allData : gives tournament data to the client
#		- players : [{id, username, pfp}, ...]
#		- messages : [{username, message}]
#		- history : [{p1, p2, p1Win})]
#
#	6 : gameUpdate : when a tournament match ends
#		- p1 : id of the player 1
#		- p2 : id of the player 2
#		- p1Win : true/false
#
#	7 : tournament end : when the tournament ends
#		- winnerId : id of the player who won the game


#client actions (actions sent by the client) :
#	0 : start : start a tournament. if code == "", create a new tournament, else join the tournament with the code
#		- code : code of the tournament
#		- nbBot : number of bot in the tournament
#		- skin : skin id of the player
#		- goal : goal id of the player
#
#	1 : leave : leave the tournament
#
#   2 : message tournament : send a message to the tournament chat
#       - message : message to send
#
#	3 : fetchAllData and ready : fetch all data of the tournament
#		--> server will send all the data of the tournament (players, messages, etc...) with his actions

actionList = [tournamentStart, tournamentLeave, sendMessage, fetchAllData]
async def tournamentRequest(socket, content):
	if("action" not in content):
		socket.sendError("missing action parameter",9035)
		return
	action = content["action"]
	if(action < 0 or action > len(actionList)):
		socket.sendError("Action out of range", 9100)	
		return;
	if(action != 0 and socket.tournament == None):
		socket.sendError("you're not in a tournament",9037)
		return ;
	await actionList[action](socket,content)
