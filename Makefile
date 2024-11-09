# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: tomoron <tomoron@student.42angouleme.fr>   +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/10/28 19:26:13 by tomoron           #+#    #+#              #
#    Updated: 2024/11/08 19:47:48 by tomoron          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FILE = docker-compose/docker-compose.yml

COMPOSE = docker compose -f $(FILE)

all: up

up: 
	$(COMPOSE) up  --build -d

up_att: 
	$(COMPOSE) up --build

watch:
	$(COMPOSE) watch 

down:
	$(COMPOSE) down

clean: down
	docker system prune -af

fclean:clean
	$(COMPOSE) down -v
	docker system prune -af

re: fclean all

.PHONY: all up up_att down fclean re
