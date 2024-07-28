FROM debian:buster

RUN apt update && apt upgrade -y

RUN apt install -y python
RUN apt install -y python3-pip
RUN pip3 install django


RUN mkdir -p /var/www/djangoserver/
RUN mkdir -p /var/www/djangoserver/static/
COPY file/server /var/www/djangoserver/server
RUN chmod 755 /var/www/djangoserver/
RUN chown -R www-data:www-data /var/www/djangoserver/

WORKDIR /var/www/djangoserver

ENTRYPOINT [ "python", "/var/www/djangoserver/server/main.py" ]