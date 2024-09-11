FROM debian:bullseye

RUN apt update
RUN apt upgrade -y
RUN apt install gnupg curl -y

RUN echo "deb http://ppa.launchpad.net/deadsnakes/ppa/ubuntu focal main" | tee /etc/apt/sources.list.d/deadsnakes-ppa.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6A755776
RUN apt update
RUN apt upgrade -y
RUN apt install -y python3.12 postgresql-client
RUN curl https://bootstrap.pypa.io/get-pip.py -o /root/get-pip.py
RUN python3.12 /root/get-pip.py

RUN pip3 install requests django psycopg "channels[daphne]" bcrypt

ARG DB_HOST
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PASSWORD
ARG UID_42
ARG SECRET_42
ARG ICLOUD_USER
ARG ICLOUD_PASS
ARG SERVER_URL

ENV PYTHONUNBUFFERED=1
ENV DB_HOST=${DB_HOST}


COPY start.sh /root/start.sh 

RUN mkdir -p /var/www/djangoserver/
WORKDIR /var/www/djangoserver
STOPSIGNAL SIGKILL
RUN mkdir -p /var/www/djangoserver/static/

COPY file/server /var/www/djangoserver/server
RUN chmod 755 /var/www/djangoserver/ && chown -R www-data:www-data /var/www/djangoserver/

RUN sed -i "s/VAR_DB_HOST/$DB_HOST/" /var/www/djangoserver/server/server/settings.py && \
	sed -i "s/VAR_DB_NAME/$DB_NAME/" /var/www/djangoserver/server/server/settings.py && \
	sed -i "s/VAR_DB_USERNAME/$DB_USERNAME/" /var/www/djangoserver/server/server/settings.py && \
	sed -i "s/VAR_DB_PASSWORD/$DB_PASSWORD/" /var/www/djangoserver/server/server/settings.py

RUN sed -i "s/ENV_UID_42/$UID_42/" /var/www/djangoserver/server/server/data.py && \
	sed -i "s/ENV_SECRET_42/$SECRET_42/" /var/www/djangoserver/server/server/data.py && \
	sed -i "s|ENV_SERVER_URL|$SERVER_URL|" /var/www/djangoserver/server/server/data.py && \
	sed -i "s|ENV_ICLOUD_USER|$ICLOUD_USER|" /var/www/djangoserver/server/server/data.py && \
	sed -i "s|ENV_ICLOUD_PASS|$ICLOUD_PASS|" /var/www/djangoserver/server/server/data.py 

ENTRYPOINT ["sh", "/root/start.sh"]
