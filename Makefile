# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/13 16:18:56 by tomoron           #+#    #+#              #
#    Updated: 2024/08/11 16:54:45 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = docker-compose/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

build:
	$(COMPOSE) build

up: build
	mkdir -p ~/PTME_data
	$(COMPOSE) up -d
up_att: build
	mkdir -p ~/PTME_data
	$(COMPOSE) up
down:
	$(COMPOSE) down -v

clean:
	$(COMPOSE) down -v
	docker system prune -af --volumes

fclean:clean
	sudo rm -rf ~/PTME_data

re: fclean all

.PHONY: all build up up_att down fclean re
