FROM debian:bullseye

RUN apt update
RUN apt upgrade -y

RUN apt install -y python3 python3-pip postgresql-client
RUN pip3 install django psycopg

ARG DB_HOST=;
ARG DB_NAME=;
ARG DB_USERNAME=;
ARG DB_PASSWORD=;

ENV DB_HOST=${DB_HOST}

RUN mkdir -p /var/www/djangoserver/
RUN mkdir -p /var/www/djangoserver/static/
COPY file/server /var/www/djangoserver/server
RUN chmod 755 /var/www/djangoserver/
RUN chown -R www-data:www-data /var/www/djangoserver/

RUN sed -i "s/VAR_DB_HOST/$DB_HOST/" /var/www/djangoserver/server/server/settings.py
RUN sed -i "s/VAR_DB_NAME/$DB_NAME/" /var/www/djangoserver/server/server/settings.py
RUN sed -i "s/VAR_DB_USERNAME/$DB_USERNAME/" /var/www/djangoserver/server/server/settings.py
RUN sed -i "s/VAR_DB_PASSWORD/$DB_PASSWORD/" /var/www/djangoserver/server/server/settings.py

WORKDIR /var/www/djangoserver
STOPSIGNAL SIGKILL

COPY start.sh /root/start.sh 
ENTRYPOINT ["sh", "/root/start.sh"]
