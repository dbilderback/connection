FROM node:10.16.3

LABEL version="1.1"
LABEL description="ConnectionServer"

RUN mkdir -p /srv/app/connection-server
WORKDIR /srv/app/connection-server

COPY package*.json /srv/app/connection-server/
RUN npm cache clean --force && npm install

COPY . /srv/app/connection-server/

EXPOSE 5000

CMD [ "npm", "run", "start"]