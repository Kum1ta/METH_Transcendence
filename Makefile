# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/13 16:18:56 by tomoron           #+#    #+#              #
#    Updated: 2024/08/28 18:27:14 by tomoron          ###   ########.fr        #
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

watch:
	$(COMPOSE) watch
down:
	$(COMPOSE) down -v

clean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

fclean:clean
	sudo rm -rf ~/PTME_data

re: fclean all

.PHONY: all build up up_att down fclean re
