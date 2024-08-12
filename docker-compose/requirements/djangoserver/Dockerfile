FROM debian:bullseye

RUN apt update && apt upgrade -y

RUN apt install -y python3 python3-pip postgresql-client
RUN pip3 install django psycopg


RUN mkdir -p /var/www/djangoserver/
RUN mkdir -p /var/www/djangoserver/static/
COPY file/server /var/www/djangoserver/server
RUN chmod 755 /var/www/djangoserver/
RUN chown -R www-data:www-data /var/www/djangoserver/

WORKDIR /var/www/djangoserver
STOPSIGNAL SIGKILL

#ENTRYPOINT [ "python3", "/var/www/djangoserver/server/manage.py","runserver" ]
ENTRYPOINT ["sleep","inf"]
