FROM node:8.12

RUN mkdir -p /kwinzo

Add ./package.json /kwinzo 

WORKDIR /kwinzo

RUN npm install 

Add . /kwinzo 

RUN npm run-script build

CMD node server/index.js
