FROM node:16
WORKDIR /usr/src/app

COPY package*.json ./
COPY package/backend/package.json ./package/backend/package.json
COPY package/lib/package.json ./package/lib/package.json
COPY .npmrc ./

RUN npm ci --only=production

COPY package/backend ./package/backend/
COPY package/lib ./package/lib/


