service postgresql start

su postgres << EOF
createdb $DB_NAME
psql -c "CREATE USER $DB_USERNAME WITH PASSWORD '$DB_PASSWORD'"
psql -c "GRANT ALL PRIVILEGES ON database $DB_NAME TO $DB_USERNAME"
EOF
