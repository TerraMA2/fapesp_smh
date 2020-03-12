# SMH-UI

[![NodeJS](https://img.shields.io/badge/node-12-green)](https://nodejs.org/en/)
[![TypeScript](https://img.shields.io/badge/typescript-latest-green)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/angular-7.2.2-green)](https://angular.io/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Run App SMH-UI on Docker

To run a application container docker set up, you need to `build` app and move the docker file to root directory in dist.

```
$ ng build
```

```
$ cp Dockerfile dist/SMH-UI && cd dist/SMH-UI
```
Create a volume to save your data.

```
$ docker volume create smh-ui_vol
```

Create a docker image and run it.

```
$ docker build -t smh-ui:latest .
```

```
$ docker container run --name app-smh-ui -d -v smh-ui_vol:'//your_data' -p 8082:8080 smh-ui:latest
```
