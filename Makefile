# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/13 16:18:56 by tomoron           #+#    #+#              #
#    Updated: 2024/08/10 15:24:25 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = docker-compose/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

build:
	$(COMPOSE) build

up: build
	$(COMPOSE) up -d
up_att: build
	$(COMPOSE) up
down:
	$(COMPOSE) down -v

fclean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

re: fclean all

.PHONY: all build up up_att down fclean re
