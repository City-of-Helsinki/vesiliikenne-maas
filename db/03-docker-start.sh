#!/usr/bin/env bash

docker run --env PGUSER=postgres -it --rm -p 5432:5432 --name hki-vesiliikenne -e POSTGRES_PASSWORD=hki-vesiliikenne -v "$(pwd)":/work hki-vesiliikenne-gtfs
