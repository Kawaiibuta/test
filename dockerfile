FROM node:21.6.1-alpine
RUN apt-get update && apt-get -y install redis-server

WORKDIR /app

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY tsconfig.json tsconfig.json

COPY . .
RUN npm install && npm install typescript -g

RUN npm run build

CMD [ "node", "./dist/index.js" ]