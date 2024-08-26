until pg_isready -h "$DB_HOST"; do sleep 0.5 ;echo "waiting for database";done
cd /var/www/djangoserver/server
python3.12 manage.py makemigrations server
python3.12 manage.py migrate
#python3 manage.py runserver 0.0.0.0:8000
daphne -p 8000 -b 0.0.0.0 server.asgi:application
