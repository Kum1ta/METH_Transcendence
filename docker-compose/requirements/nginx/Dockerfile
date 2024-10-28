FROM nginx:stable 

RUN apt update
RUN apt upgrade -y
RUN apt install openssl nginx -y

RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -out /etc/nginx/ssl/inception.crt -keyout /etc/nginx/ssl/inception.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=meth.com/UID=meth"

COPY nginx.conf /etc/nginx/nginx.conf
COPY static /var/www/static 

ENTRYPOINT ["nginx", "-g", "daemon off;"]
