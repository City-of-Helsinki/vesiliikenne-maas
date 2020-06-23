FROM node:14-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

RUN mkdir -p /home/node/app/node_modules && \
  mkdir -p /home/node/app/.next && \
  chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./
RUN yarn --frozen-lockfile --no-progress
COPY --chown=node:node . .

EXPOSE 8080

CMD ["yarn", "start"]
