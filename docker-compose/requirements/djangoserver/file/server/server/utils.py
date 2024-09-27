# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    utils.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/27 03:36:08 by tomoron           #+#    #+#              #
#    Updated: 2024/09/27 03:36:42 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

def genString(length):
	letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	return(''.join(random.choice(letters) for i in range(length)))
