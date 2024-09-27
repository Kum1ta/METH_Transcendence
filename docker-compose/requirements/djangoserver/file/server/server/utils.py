# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    utils.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/27 03:36:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/27 11:23:51 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import random

def genString(length):
	letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return(''.join(random.choice(letters) for i in range(length)))
