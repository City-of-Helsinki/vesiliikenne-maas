#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

cleanup() {
  echo "Cleaning up created directories"
  cd ..
  rm -rf gtfs-sql-importer gtfs.zip
  exit
}

catch() {
  echo "Importing the GTFS data failed. Cleaning up extra schemas."
  psql -h "$PGHOST" -U "$PGUSER" -c 'DROP SCHEMA IF EXISTS gtfs_test CASCADE;'
  psql -h "$PGHOST" -U "$PGUSER" -c 'DROP SCHEMA IF EXISTS gtfs_old CASCADE;'
  cleanup
}

trap 'catch' ERR

git clone --depth 1 https://github.com/fitnr/gtfs-sql-importer || true
curl -L -o gtfs.zip http://lautta.net/db/gtfs_pk/gtfs.zip
cd gtfs-sql-importer
make init SCHEMA=gtfs_test
make load GTFS=../gtfs.zip SCHEMA=gtfs_test

psql -h "$PGHOST" -U "$PGUSER" -c 'ALTER SCHEMA gtfs RENAME TO gtfs_old;'
psql -h "$PGHOST" -U "$PGUSER" -c 'ALTER SCHEMA gtfs_test RENAME TO gtfs;'
psql -h "$PGHOST" -U "$PGUSER" -c 'DROP SCHEMA IF EXISTS gtfs_old CASCADE;'
echo "Importing the GTFS data succeeded."
cleanup
