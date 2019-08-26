FROM node:alpine AS builder
WORKDIR /smh-ui
RUN npm install -g http-server
RUN npm install -g @angular/cli@7
RUN ng build
COPY dist/SMH-UI .
CMD http-server
EXPOSE 8080