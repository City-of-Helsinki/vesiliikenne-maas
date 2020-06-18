# Vesiliikenne MaaS

Building a Proof of Concept to connect MaaS apps to ferry operators via a common integration platform.

## Getting started

To get started and buy and view the ticket:

1) `yarn install`
1) `./scripts/generate_keys.sh`
1) `./scripts/create_sample_ticket.sh`
1) `yarn run create-api-key`
1) Create `.env` from `.env.dist` using above information, your mapbox account and integration keys from CRD
1) `yarn dev`
1) Navigate to http://localhost:3000/
1) Buy ticket using the api token created above
1) `yarn run fetch-jwt-ticket [ticket-uuid] [api-token]`
