# Build stage
FROM node:lts AS build

WORKDIR /home/node/app

COPY package*.json ./
COPY .env ./

RUN npm install
RUN npm install typescript -g

COPY . /home/node/app

RUN tsc

# Run stage
FROM node:lts-slim AS run

USER node
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./

ENV NODE_ENV=production
RUN npm install --omit=dev  

COPY --from=build /home/node/app/dist dist

USER node
CMD [ "node", "dist/index.js" ]