FROM node:17
WORKDIR /usr/src/app

COPY package*.json ./
COPY package/lambda/package.json ./package/lambda/package.json
COPY package/lib/package.json ./package/lib/package.json
COPY package/database/package.json ./package/database/package.json
COPY .npmrc ./

RUN npm ci --only=production

COPY package/lambda ./package/lambda/
COPY package/lib ./package/lib/
COPY package/database ./package/database/
COPY config ./config/