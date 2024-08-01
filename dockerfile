FROM node:21.6.1

CMD [ "npm i && npm run build && npm run start" ]