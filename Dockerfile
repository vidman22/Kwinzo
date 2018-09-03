FROM node:slim

RUN mkdir -p /kwinzo

Add . /kwinzo 

WORKDIR /kwinzo

RUN npm install && npm run-script build

CMD node server/index.js
