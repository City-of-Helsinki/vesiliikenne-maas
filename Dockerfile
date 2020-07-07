FROM node:14-alpine AS node

FROM node AS build

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
COPY --from=build --chown=node:node /app/migrations ./migrations

CMD ["yarn", "run", "next", "start", "-p", "$PORT"]
