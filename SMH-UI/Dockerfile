FROM node:alpine AS builder
COPY . /smh-ui
RUN npm install -g http-server
RUN npm install -g @angular/cli@7
RUN npm install
RUN ng build
WORKDIR /smh-ui/dist/SMH-UI
CMD http-server
EXPOSE 8080