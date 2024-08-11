FROM debian:bullseye

RUN apt update
RUN apt upgrade -y

RUN apt install postgresql postgresql-client -y

RUN sed -i 's/127.0.0.1\/32/0.0.0.0\/0/' /etc/postgresql/*/*/pg_hba.conf
RUN echo "listen_addresses = '*'" | tee -a /etc/postgresql/*/*/postgresql.conf

COPY setup.sh /root/setup.sh
COPY start.sh /root/start.sh

ARG DB_NAME=;
ARG DB_PASSWORD=;
ARG DB_USERNAME=;

ENV DB_NAME=${DB_NAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USERNAME=${DB_USERNAME}

RUN sh /root/setup.sh

EXPOSE 5432
STOPSIGNAL SIGKILL

ENTRYPOINT ["/bin/sh","/root/start.sh"]
