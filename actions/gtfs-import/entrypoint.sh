#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

while [ -n "${1-}" ]; do 
  case $1 in
  --wait-until-ready )
    until psql -h "$PGHOST" -U "$PGUSER" -c '\q'; do
      >&2 echo "Postgres is unavailable - sleeping"
      sleep 1
    done
    ;;
esac; shift; done

cd /work
git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer
make init
make load GTFS=../gtfs.zip
echo "::set-output name=message::Done"
