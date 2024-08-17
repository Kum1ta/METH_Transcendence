until pg_isready -h "$DB_HOST"; do sleep 0.5 ;echo "waiting for database";done
cd /var/www/djangoserver/server
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
