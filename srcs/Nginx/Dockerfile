FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl
RUN apt install -y openssl
RUN openssl req -x509 -nodes -out /etc/nginx/ssl/inception.crt -keyout /etc/nginx/ssl/inception.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=ptme.com/UID=ptme"
RUN mkdir -p /var/www/PTME/
RUN mkdir -p /var/www/PTME/static/
RUN chmod 755 /var/www/PTME/
RUN chown -R www-data:www-data /var/www/PTME/
RUN echo "Heyyy\n" > /var/www/PTME/static/text.txt
COPY conf/nginx.conf /etc/nginx/nginx.conf
