FROM node:18.19-slim

RUN mkdir -p /var/www/core

WORKDIR /var/www/core

COPY . .

RUN npm ci

EXPOSE 3000

CMD [ "npm", "start" ]
