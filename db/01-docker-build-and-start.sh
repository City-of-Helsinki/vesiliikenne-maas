#!/usr/bin/env bash

docker build --tag=hki-vesiliikenne-gtfs .
docker run --env PGUSER=postgres -it --rm -p 5432:5432 --name hki-vesiliikenne -e POSTGRES_PASSWORD=hki-vesiliikenne hki-vesiliikenne-gtfs
