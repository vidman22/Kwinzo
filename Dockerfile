FROM node:slim

RUN mkdir -p /kwinzo

Add . /kwinzo 

WORKDIR /kwinzo

RUN npm install && npm run-script build

ADD http://endpoint.microstacks.com/0.2.0/endpoint.tgz /tmp/
RUN tar -xvzf /tmp/endpoint.tgz -C /usr/local

CMD node server/index.js
