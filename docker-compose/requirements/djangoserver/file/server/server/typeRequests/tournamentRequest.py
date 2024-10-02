# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    tournamentRequest.py                               :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/01 13:16:39 by edbernar          #+#    #+#              #
#    Updated: 2024/10/02 13:31:25 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# tournament request format : {"type":"tournament", "content":{"action": 1, ...}}

#server actions (actions sent by the server):
#	0 : start : tell the client if tournament is full or not exist. If not, tell the client can start the tournament
#		- exist : true/false
#		- isFull : true/false
#		- started : true/false
#		- code : code of the tournament
#
#	1 : someoneJoin : tell the client someone join the tournament (considering clients will place selon the order of the join)
#		- id : id of the player
#		- username : name of the player
#		- pfp : pfp of the player
#
#	2 : someoneLeave : tell the client someone leave the tournament (if game not started, players will be replaced in the order of the join)
#		- id : id of the player who leave
#	
#	3 : message : send a message to the tournament chat
#		- username : name of the player who send the message
#		- message : message to send
#
#	4 : startGame : tell the client (client will launch a matchmaking like invitation)
#		- id : id of the player
#		- username : name of the player
#


#client actions (actions sent by the client) :
#	0 : start : start a tournament. if code == "", create a new tournament, else join the tournament with the code
#		- code : code of the tournament
#	1 : leave : leave the tournament
#
#   2 : message tournament : send a message to the tournament chat
#       - message : message to send


