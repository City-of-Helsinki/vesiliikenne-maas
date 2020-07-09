# Vesiliikenne MaaS

Building a Proof of Concept to connect MaaS apps to ferry operators via a common integration platform.

## Requirements

- Docker
- Docker Compose

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

## Configuration

The application is configured using environment variables. The following variables are used:

- `CRD_URL` - The URL to the CRD Systems Bartrace API
- `CRD_TOKEN` - The access token to the aforementioned API
- `MAAS_API_KEY_HASH` - The hash of the API key that the MaaS frontend provider uses in their requests. Generated with `yarn run create-api-key`.
- `GWT_SIGNING_PRIVATE_KEY` - The private key used to sign responses with JWT. Generated with `./scripts/generate_keys.sh`
- `GWT_SIGNING_PUBLIC_KEY` - The public key which is used by the end user to verify responses from the API. Generated with `./scripts/generate_keys.sh` and accessible from `/api/ticket-public-key`.
- `DATABASE_URL` The url of the PostgreSQL instance used by the application.
