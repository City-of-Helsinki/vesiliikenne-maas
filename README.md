# Vesiliikenne MaaS

Building a Proof of Concept to connect MaaS apps to ferry operators via a common integration platform.

## Getting started

To set up the development environment:

1. `yarn`
1. `./scripts/generate_keys.sh`
1. `./scripts/create_sample_ticket.sh`
1. `yarn run create-api-key`
1. Create `.env` from `.env.dist` using above information, your mapbox account and integration keys from CRD
1. `docker-compose up`
1. `yarn run-migrations-dev up`
1. Navigate to http://localhost:3000/

## Architecture diagram

The architecture diagram can be found under `doc/`.
