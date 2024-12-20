# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    utils.py                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/09/27 03:36:08 by tomoron           #+#    #+#              #
#    Updated: 2024/10/04 18:59:25 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

import random
import string

def genString(length, letters=string.ascii_letters+string.digits):
	return(''.join(random.choice(letters) for i in range(length)))
