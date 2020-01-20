import json 
import datetime
import pandas as pd
from connection_pg import Connection_pg
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_jsonpify import *
from flask.json import JSONEncoder
from datetime import date

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

class AnalysisMonthlyByCity(Resource):
    def get(self,geocodigo,mes_inicio,ano_inicio,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            mes, ano = (int(mes_fim) + 1), int(ano_fim)
            if mes > 12: mes, ano = 1, ano + 1
            data = conectar.readFileSQL(
                "sql/analysis_month_city",
                {
                    "geocodigo": str(geocodigo),
                    "mes_inicio": str(mes_inicio),
                    "ano_inicio": str(ano_inicio),
                    "mes_fim": str(mes),
                    "ano_fim": str(ano)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class ClimMonthlyByCity(Resource):
    def get(self,geocodigo,mes):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/clim_monthly_city",
                {
                    "geocodigo": str(geocodigo),
                    "mes": str(mes)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class ClimMonthlyByHydrography(Resource):
    def get(self,codigo,mes):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/clim_monthly_hydrography",
                {
                    "codigo": str(codigo),
                    "mes": str(mes)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o codigo {}'.format(str(codigo)) })

class AnalysisDailyByCity(Resource):
    def get(self,geocodigo,dia_inicio,mes_inicio,ano_inicio,dia_fim,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/analysis_daily_city",
                {
                    "geocodigo": str(geocodigo),
                    "dia_inicio": str(dia_inicio), "mes_inicio": str(mes_inicio), "ano_inicio": str(ano_inicio),
                    "dia_fim": str(dia_fim), "mes_fim": str(mes_fim), "ano_fim": str(ano_fim)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class ClimDailyByCity(Resource):
    def get(self,geocodigo,mes,dia):  
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/clim_daily_city",
                {
                    "geocodigo": str(geocodigo),
                    "mes": str(mes),
                    "dia": str(dia)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class Hydrography(Resource):
    def get(self):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/hydrography",{})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Nenhuma bacia para exibir' })

class CitiesByState(Resource):
    def get(self, uf):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/cities_by_state",{'uf': str(uf).upper()})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'uf {} não existe'.format(str(uf).upper()) })

class States(Resource):
    def get(self):
        try:
            data = pd.DataFrame(data = { 'estado' : open('txt/states.txt', 'r').read().split('\n'), 'uf' : open('txt/states-sigla.txt', 'r').read().split('\n') })
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível fazer a leitura'})

class Layers(Resource):
    def get(self):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/get_layers", {})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível fazer a leitura'})

api.add_resource(AnalysisMonthlyByCity, '/analysis-monthly-by-city/<geocodigo>/<mes_inicio>/<ano_inicio>/<mes_fim>/<ano_fim>')
api.add_resource(ClimMonthlyByCity, '/clim-monthly-by-city/<geocodigo>/<mes>')
api.add_resource(ClimMonthlyByHydrography, '/clim-monthly-by-hydrography/<codigo>/<mes>')
api.add_resource(AnalysisDailyByCity,'/analysis-daily-by-city/<geocodigo>/<dia_inicio>/<mes_inicio>/<ano_inicio>/<dia_fim>/<mes_fim>/<ano_fim>')
api.add_resource(ClimDailyByCity, '/clim-daily-by-city/<geocodigo>/<mes>/<dia>')
api.add_resource(Hydrography, '/bacias')
api.add_resource(CitiesByState, '/cities/<uf>')
api.add_resource(States, '/states')
api.add_resource(Layers, '/layers')

if __name__ == '__main__':
    app.run( debug = True, host = '0.0.0.0' )