#!/usr/bin/env bash
set -uo pipefail
IFS=$'\n\t'

git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer
make init SCHEMA=gtfs_test
make load GTFS=../gtfs.zip SCHEMA=gtfs_test

if [ $? -eq 0 ]; then
  psql -h "$PGHOST" -U "$PGUSER" -c 'ALTER SCHEMA gtfs RENAME TO gtfs_old;'
  psql -h "$PGHOST" -U "$PGUSER" -c 'ALTER SCHEMA gtfs_test RENAME TO gtfs;'
  psql -h "$PGHOST" -U "$PGUSER" -c 'DROP SCHEMA IF EXISTS gtfs_old CASCADE;'
  echo "Importing the GTFS data succeeded."
  echo "::set-output name=message::Done"
else
  echo "Importing the GTFS data failed, deleting test schema."
  psql -h "$PGHOST" -U "$PGUSER" -c 'DROP SCHEMA IF EXISTS gtfs_test CASCADE;'
fi

