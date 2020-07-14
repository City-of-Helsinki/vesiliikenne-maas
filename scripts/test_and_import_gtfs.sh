#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

DATABASE_REGEX="^postgres:\/\/(.+):(.+)@(.+):5432\/(.+)$"

# Since Heroku provides automatically only the DATABASE_URL,
# we need to parse the env variables from it, as they are needed
# by the gtfs-sql-importer.
# 
# We could set them manually, but less manual configuration the better,
# and as they are only needed for this script, it's better that they are
# transient.
export PGUSER=$(sed -r "s/$DATABASE_REGEX/\1/" <<< "$DATABASE_URL")
export PGPASSWORD=$(sed -r "s/$DATABASE_REGEX/\2/" <<< "$DATABASE_URL")
export PGHOST=$(sed -r "s/$DATABASE_REGEX/\3/" <<< "$DATABASE_URL")
export PGDATABASE=$(sed -r "s/$DATABASE_REGEX/\4/" <<< "$DATABASE_URL")

cleanup() {
  echo "Cleaning up created directories"
  cd ..
  rm -rf gtfs-sql-importer gtfs.zip
  unset PGUSER PGPASSWORD PGHOST PGDATABASE
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
