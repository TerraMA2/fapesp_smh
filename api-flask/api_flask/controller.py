import json
import datetime
import pandas as pd
from flask import Flask, request, abort
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_jsonpify import *
from flask.json import JSONEncoder
from datetime import date, datetime
from sqlalchemy import and_, cast, extract, Integer

from .model.connection_pg import Connection_pg
from .model.models.municipios_brasil import Municipio
from .model.models.an_municipio import \
    AnClimMonthlyByCity, AnMonthlyByCity, \
         AnClimDailyByCity, AnDailyByCity

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
api = Api(app)
CORS(app)

@app.route("/")
def hello():
    return jsonify({'text':'Hello World!!!'})

def length(obj):
    aux, i = None, 0
    while True:
        try: aux, i = obj[i], i + 1
        except: break
    return i

def getDayMonths(date):
    dias = {1:31,2:0,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31}
    ano = date.year
    bissexto = None
    if ano % 4 == 0:
        if ano % 100 == 0:
            if ano % 400 == 0: bissexto = True
            else: bissexto = False
        else: bissexto = True
    else: bissexto = False
    if bissexto: dias[2] = 29
    else: dias[2] = 28
    return dias.get(date.month, 0)

class AnalysisMonthlyByCity(Resource):
    def get(self):
        try:
            geocodigo = str(request.args['geocodigo'])
            start_date = datetime.strptime(str(request.args['start_date']), "%Y-%m")
            end_date = datetime.strptime(str(request.args['end_date']), "%Y-%m")

            conectar = Connection_pg("chuva")

            municipio = conectar.createSession(Municipio) \
                    .filter_by(geocodigo = geocodigo) \
                        .first()
            an_monthly = conectar.createSession(AnMonthlyByCity) \
                .filter_by(fid = municipio.fid) \
                    .filter(
                        and_(AnMonthlyByCity.execution_date >= start_date, AnMonthlyByCity.execution_date <= end_date)
                    ).order_by(AnMonthlyByCity.execution_date)

            result = []
            for i in range(length(an_monthly)):

                clim_monthly_result = conectar.createSession(AnClimMonthlyByCity) \
                    .filter_by(fid = municipio.fid) \
                        .filter(extract('month', AnClimMonthlyByCity.execution_date) == an_monthly[i].execution_date.month) \
                            .order_by(AnClimMonthlyByCity.execution_date) \
                                .first()

                result.append(
                    {
                        "date" : an_monthly[i].execution_date,
                        "climatologico" : {
                            "clim_maxima" : clim_monthly_result.maxima * getDayMonths(
                                clim_monthly_result.execution_date
                            ),
                            "clim_media" : clim_monthly_result.media * getDayMonths(
                                clim_monthly_result.execution_date
                            )
                        },
                        "prec_maxima" : an_monthly[i].maxima * getDayMonths(
                            an_monthly[i].execution_date
                        ),
                        "prec_media" : an_monthly[i].media * getDayMonths(
                            an_monthly[i].execution_date
                        ),
                        "anomalia" : an_monthly[i].anomalia * getDayMonths(
                            an_monthly[i].execution_date
                        )
                    }
                )

            data = {
                "query" : {
                    "nome_municipio" : municipio.nome1,
                    "geocodigo" : geocodigo,
                    "timeline" : {
                        "start_date" : start_date,
                        "end_date" : end_date
                    }
                },
                "result" : result
            }

            conectar.closeAll()

            return jsonify(data)
        except:
            return abort(404, description = {
                'info' :
                    'Impossível ler o geocodigo,' +
                    'falta atributos de busca como data inicial e final como no exemplo ' +
                    '?geocodigo=3549904&start_date=2015-01&end_date=2015-12'
            })

class ClimMonthlyByCity(Resource):
    def get(self):
        try:
            geocodigo = str(request.args['geocodigo'])
            month = int(request.args['month'])

            conectar = Connection_pg("chuva")

            municipio = conectar.createSession(Municipio) \
                .filter_by(geocodigo = geocodigo) \
                    .first()

            clim_monthly_result = conectar.createSession(AnClimMonthlyByCity) \
                    .filter_by(fid = municipio.fid) \
                        .filter(extract('month', AnClimMonthlyByCity.execution_date) == month) \
                            .order_by(AnClimMonthlyByCity.execution_date) \
                                .first()

            data = {
                "query" : {
                    "nome_municipio" : municipio.nome1,
                    "geocodigo" : geocodigo,
                    "date" : clim_monthly_result.execution_date,
                    "timeline" : {
                        "start" : 1998,
                        "end" : 2019
                    },
                },
                "climatologico" : {
                    "clim_maxima" : clim_monthly_result.maxima * getDayMonths(
                        clim_monthly_result.execution_date
                    ),
                    "clim_media" : clim_monthly_result.media * getDayMonths(
                        clim_monthly_result.execution_date
                    )
                }
            }

            conectar.closeAll()

            return jsonify(data)
        except:
            return abort(404, description = {
                'info' :
                    'Impossível ler o geocodigo,' +
                    'selecione um geocodigo e um mes como no exemplo ' +
                    '?geocodigo=3549904&month=01'
            })

class AnalysisDailyByCity(Resource):
    def get(self):
        try:
            geocodigo = str(request.args['geocodigo'])
            start_date = datetime.strptime(str(request.args['start_date']), "%Y-%m-%d")
            end_date = datetime.strptime(str(request.args['end_date']), "%Y-%m-%d")

            conectar = Connection_pg("chuva")

            municipio = conectar.createSession(Municipio) \
                    .filter_by(geocodigo = geocodigo) \
                        .first()


            an_daily = conectar.createSession(AnDailyByCity) \
                .filter_by(fid = municipio.fid) \
                    .filter(
                        and_(AnDailyByCity.execution_date >= start_date, AnDailyByCity.execution_date <= end_date)
                    ).order_by(AnDailyByCity.execution_date)

            result = []
            for i in range(length(an_daily)):

                clim_daily_result = conectar.createSession(AnClimDailyByCity) \
                    .filter_by(fid = municipio.fid) \
                        .filter(
                            and_(
                                extract('month', AnClimDailyByCity.execution_date) == an_daily[i].execution_date.month,
                                extract('day', AnClimDailyByCity.execution_date) == an_daily[i].execution_date.day
                            )
                        ).order_by(AnClimDailyByCity.execution_date) \
                                .first()

                result.append(
                    {
                        "date" : an_daily[i].execution_date,
                        "climatologico" : {
                            "clim_maxima" : clim_daily_result.maxima,
                            "clim_media" : clim_daily_result.media
                        },
                        "prec_maxima" : an_daily[i].maxima,
                        "prec_media" : an_daily[i].media,
                        "anomalia" : an_daily[i].anomalia
                    }
                )

            data = {
                "query" : {
                    "nome_municipio" : municipio.nome1,
                    "geocodigo" : geocodigo,
                    "timeline" : {
                        "start_date" : start_date,
                        "end_date" : end_date
                    }
                },
                "result" : result
            }

            conectar.closeAll()

            return jsonify(data)
        except:
            return abort(404, description = {
                'info' : 'Impossível ler o geocodigo,' +
                'falta atributos de busca como data inicial e final como no exemplo ' +
                '?geocodigo=3549904&start_date=2010-01-01&end_date=2010-12-31'
            })

class ClimDailyByCity(Resource):
    def get(self):
        try:
            geocodigo = str(request.args['geocodigo'])
            month = str(request.args['month'])
            day = str(request.args['day'])

            conectar = Connection_pg("chuva")

            municipio = conectar.createSession(Municipio) \
                .filter_by(geocodigo = geocodigo) \
                    .first()

            clim_daily_result = conectar.createSession(AnClimDailyByCity) \
                .filter_by(fid = municipio.fid) \
                    .filter(
                        and_(
                            extract('month', AnClimDailyByCity.execution_date) == month,
                            extract('day', AnClimDailyByCity.execution_date) == day
                        )
                    ).order_by(AnClimDailyByCity.execution_date) \
                        .first()

            data = {
                "query" : {
                    "nome_municipio" : municipio.nome1,
                    "geocodigo" : geocodigo,
                    "date" : clim_daily_result.execution_date,
                    "timeline" : {
                        "start" : 1998,
                        "end" : 2019
                    },
                },
                "climatologico" : {
                    "clim_maxima" : clim_daily_result.maxima,
                    "clim_media" : clim_daily_result.media
                }
            }

            conectar.closeAll()

            return jsonify(data)
        except:
            return abort(404, description = {
                'info' :
                    'Impossível ler o geocodigo, ' +
                    'falta atributos de busca como mes e dia como no exemplo ' +
                    '?geocodigo=3549904&month=01&day=01'
            })

class CitiesByState(Resource):
    def get(self):
        try:
            conectar = Connection_pg("chuva")
            municipios = conectar.createSession(Municipio) \
                .filter_by(uf = str(request.args['uf']).upper()) \
                    .order_by(Municipio.nome1)
            data = { "municipios" : [] }
            for municipio in municipios:
                data.get("municipios").append(
                    {
                        "nome_municipio" : municipio.nome1,
                        "geocodigo" : municipio.geocodigo,
                        "latitude" : municipio.latitude,
                        "longitude" : municipio.longitude
                    }
                )
            conectar.closeAll()
            return jsonify(data)
        except:
            return abort(404, description = { 'info' : 'uf não existe ou selecione um estado ?uf=SP' })

class States(Resource):
    def get(self):
        try:
            data = json.loads(open("api_flask/model/models/states.json").read())
            return jsonify(data)
        except:
            return abort(404, description = { 'info' : 'Impossível fazer a leitura'})

api.add_resource(AnalysisMonthlyByCity, '/api-flask/analysis-monthly-by-city')
api.add_resource(ClimMonthlyByCity, '/api-flask/clim-monthly-by-city')
api.add_resource(AnalysisDailyByCity,'/api-flask/analysis-daily-by-city')
api.add_resource(ClimDailyByCity, '/api-flask/clim-daily-by-city')
api.add_resource(CitiesByState, '/api-flask/cities')
api.add_resource(States, '/api-flask/states')