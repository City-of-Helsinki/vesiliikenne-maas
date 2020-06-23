#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

export PGHOST=$1
export PGPORT=$2
export PGUSER=$3
export PGPASSWORD=$4

cd /work
git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer
make init
make load GTFS=../gtfs.zip
echo "::set-output name=message::Done"