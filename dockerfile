FROM node:21.6.1
RUN apt-get update && apt-get -y install redis
WORKDIR /app

COPY package.json package.json

COPY package-lock.json package-lock.json

COPY tsconfig.json tsconfig.json

COPY . .
RUN npm install && npm install typescript -g

RUN npm run build

RUN chmod +x /start.sh

ENTRYPOINT ["/start.sh"]
