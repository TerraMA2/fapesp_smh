# Python Flask Docker

API Flask provide geologic data from geoserver and data base.

## Libraries Python for Flask API

Before installing API Flask, upgrade `python 3.7 pip` with the following command.
```
# pip install --upgrade pip
```
To use a API Flask in docker image, some libraries are required and here is a simple pip command to install all dependencies.
```
# pip install psycopg2 numpy pandas sqlalchemy georaster Flask flask-api flask_cors flask_restful flask_jsonpify docker-py
```

## Run Python Flask API

Install flask with `pip install Flask` and run with `python server.py`.

## Create a volume to save your data

```
$ docker create volume api-flask_vol
```

## Start a docker image in Dockerfile directory

```
$ docker build -t api-flask:latest .
```
```
$ docker container run --name flask -d -v api-flask:'//your_data' -p 5000:5000 api-flask:latest
```