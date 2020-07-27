# Vesiliikenne MaaS

Next.js app that acts as an integration layer that mediates the connection between ticket sales platforms and MaaS providers. It is kept as platform-agnostic as possible so that multiple platforms and MaaS app providers can be supported and swapped out if needed.

## Requirements

- Docker
- Docker Compose

## Getting started

To set up the development environment:

1. `yarn`
1. `./scripts/generate_keys.sh`
1. `yarn run create-api-key`
1. Create `.env` from `.env.dist` using above information, your mapbox account and integration keys from CRD
1. `docker-compose up`
1. `yarn run-migrations-dev up`
1. Navigate to http://localhost:3000/

## Documentation

### Api documentation

[Link](https://vesiliikenne-maas.herokuapp.com/specs/redoc.html) to api documentation

### Architecture diagram

[Link](doc/Vesiliikenne%20MaaS%20Architecture.pdf) to architecture diagram

## Configuration

The application is configured using environment variables. The following variables are used:

- `CRD_URL` - The URL to the CRD Systems Bartrace API
- `CRD_TOKEN` - The access token to the aforementioned API
- `MAAS_API_KEY_HASH` - The hash of the API key that the MaaS frontend provider uses in their requests. Generated with `yarn run create-api-key`. **Note that the value generated by the script is escaped for use in a .env file. When directly configured as an environment variable, the the quotemarks and backslashed need to be removed.**
- `GWT_SIGNING_PRIVATE_KEY` - The private key used to sign responses with JWT. Generated with `./scripts/generate_keys.sh`
- `GWT_SIGNING_PUBLIC_KEY` - The public key which is used by the end user to verify responses from the API. Generated with `./scripts/generate_keys.sh` and accessible from `/api/ticket-public-key`.
- `DATABASE_URL` The url of the PostgreSQL instance used by the application.
- `MAPBOX_ACCESS_KEY` - This is required for the demo frontend to work. This can be acquired by making an account at https://www.mapbox.com/
- `DEV_API_KEY` - API key generated by the `yarn run create-api-key` script. This is used by the demo frontend to automatically authenticate requests.
- `ALLOW_DEMO_FRONTEND` - Allows access to the demo frontend. Should be disabled on production systems. If you want to enable this flag, set it to `allow`. Otherwise leave it out.
- `ALLOW_CRD` - Toggles if ticket sales should be posted to CRD backend. Should be disabled on local development environments. If you want to enable this flag, set it to `allow`. Otherwise leave it out.
