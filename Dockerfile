# Installing
FROM node:16-alpine as build

WORKDIR /usr/src/aggregator

COPY package*.json ./
COPY tsconfig.json ./

COPY src ./src

RUN npm install
RUN npm run build

# Running
FROM node:16-alpine

WORKDIR /usr/bin/aggregator
VOLUME ./downloads

COPY package*.json ./
# COPY .env .

RUN npm ci --omit=dev
COPY --from=build /usr/src/aggregator/build ./

CMD ["node", "index.js"]