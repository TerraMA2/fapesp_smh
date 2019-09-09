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

class Analise(Resource):
    def get(self,geocodigo,mes_inicio,ano_inicio,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            mes, ano = (int(mes_fim) + 1), int(ano_fim)
            if mes > 12: mes, ano = 1, ano + 1
            data = conectar.readFileSQL(
                "sql/analysis_month",
                {
                    "geocodigo":str(geocodigo),
                    "mes_inicio":str(mes_inicio),
                    "ano_inicio":str(ano_inicio),
                    "mes_fim":str(mes),
                    "ano_fim":str(ano)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class Merge(Resource):
    def get(self,geocodigo,mes):
        try:
            conectar = Connection_pg("chuva")
            mes_extenso = str(mes)
            indice = (len(mes_extenso) - 1) * (-1)
            data = conectar.readFileSQL(
                "sql/merge",
                {
                    "geocodigo":str(geocodigo),
                    "mes":(
                        (mes_extenso[:indice]).upper() +
                        (mes_extenso[indice:]).lower()
                    )
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class CitiesByState(Resource):
    def get(self, uf):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/cities_by_state",{'uf':str(uf).upper()})
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

api.add_resource(Analise, '/analise/<geocodigo>/<mes_inicio>/<ano_inicio>/<mes_fim>/<ano_fim>')
api.add_resource(Merge, '/merge/<geocodigo>/<mes>')
api.add_resource(CitiesByState, '/cities/<uf>')
api.add_resource(States, '/states')
api.add_resource(Layers, '/layers')

if __name__ == '__main__':
    app.run( debug = True, host = '0.0.0.0' )