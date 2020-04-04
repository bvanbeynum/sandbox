FROM node:8

RUN apt-get update

RUN mkdir /usr/src/web
WORKDIR /usr/src/web
COPY ./web /usr/src/web

RUN npm install

EXPOSE 7578
CMD ["npm", "start"]
