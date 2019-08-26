FROM node:alpine AS builder
WORKDIR /smh-ui
COPY . .
RUN npm install -g http-server
RUN ng build
RUN cd /dist
CMD http-server
EXPOSE 8080
