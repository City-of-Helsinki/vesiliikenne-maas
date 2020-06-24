#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

cd /
git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer

until psql -h "$PGHOST" -U "$PGUSER" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

make init
make load GTFS=../gtfs.zip

