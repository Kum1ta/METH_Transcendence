# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    start.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/11 17:07:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/13 23:46:25 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

from ...Game import Game

def start(socket, content):
	game = Game(socket, content.get("with_bot", False))
