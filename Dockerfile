FROM node:8.12

RUN mkdir -p /kwinzo

Add . /kwinzo 

WORKDIR /kwinzo

RUN npm install && npm run-script build

CMD node server/index.js
