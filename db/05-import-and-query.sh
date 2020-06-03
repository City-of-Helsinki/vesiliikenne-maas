docker exec -it hki-vesiliikenne /bin/bash -c "cd /work/gtfs-sql-importer && \
make init && \
make load GTFS=../gtfs.zip && \
psql -t -q -U postgres -h localhost < /work/routes-query.sql| jq"
