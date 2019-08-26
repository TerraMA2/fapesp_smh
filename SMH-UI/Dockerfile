FROM node:alpine AS builder
WORKDIR /smh-ui
COPY . .
RUN npm install -g http-server
RUN npm install -g @angular/cli@7.1
RUN npm install
RUN ng build
RUN cd dist/SMH-UI
CMD http-server
EXPOSE 8080
