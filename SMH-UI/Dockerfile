FROM node:alpine AS builder
COPY . /smh-ui
WORKDIR /smh-ui
RUN npm install -g http-server
CMD http-server
EXPOSE 8080
