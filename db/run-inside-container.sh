#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

cd /work
git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer
make init
make load GTFS=../gtfs.zip
psql -t -q -U postgres -h localhost < /work/routes-query.sql | jq
