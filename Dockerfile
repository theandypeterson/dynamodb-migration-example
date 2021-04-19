FROM node:alpine

RUN mkdir -p /usr/src/app
RUN chown -R node: /usr/src/app

USER node
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn install --production

RUN mkdir -p /usr/src/app/scripts
COPY scripts /usr/src/app/scripts
