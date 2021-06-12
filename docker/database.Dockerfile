FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./
COPY package/lib/package.json ./package/lib/package.json
COPY package/database/package.json ./package/database/package.json
COPY .npmrc ./

RUN npm ci

COPY package/lib ./package/lib/
COPY package/database ./package/database/
COPY config ./config/