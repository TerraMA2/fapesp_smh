FROM node:alpine AS builder
WORKDIR /smh-ui
COPY . .
RUN npm install -g http-server
CMD http-server
EXPOSE 8080