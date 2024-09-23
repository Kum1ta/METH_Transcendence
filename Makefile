# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/13 16:18:56 by tomoron           #+#    #+#              #
#    Updated: 2024/09/24 00:03:51 by edbernar         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = docker-compose/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

build:
	# mkdir -p ~/METH_data
	$(COMPOSE) build

up: build
	$(COMPOSE) up -d
up_att: build
	$(COMPOSE) up

watch:
	$(COMPOSE) watch
down:
	$(COMPOSE) down -v

clean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

fclean:clean

re: fclean all

.PHONY: all build up up_att down fclean re
