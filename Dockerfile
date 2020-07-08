FROM node:14-alpine AS node

FROM node AS build

# Required for running the test_and_import.sh as a scheduled command
RUN apk add --update bash git unzip curl make postgresql-client

WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --no-progress
COPY . .

RUN yarn build

FROM node AS release

WORKDIR /home/node/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /home/node/app/node_modules && \
  chown -R node:node /home/node/app

USER node

COPY --chown=node:node package.json yarn.lock ./
RUN yarn --frozen-lockfile --no-progress

COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public

EXPOSE 8080

CMD ["yarn", "run", "next", "start", "-p", "8080"]
