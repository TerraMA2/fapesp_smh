import json 
import datetime
import georasters as gr
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

class An_Monthly(Resource):
    def get(self, geocodigo, ano):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/an_monthly",{"geocodigo":str(geocodigo),"ano":str(ano)})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class An_Monthly_Limit_Date(Resource):
    def get(self,geocodigo,mes_inicio,ano_inicio,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            mes, ano = (int(mes_fim) + 1), int(ano_fim)
            if mes > 12: mes, ano = 1, ano + 1
            data = conectar.readFileSQL(
                "sql/an_monthly_limit_date",
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

class An_Merge_Monthly(Resource):
    def get(self, geocodigo):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/an_merge_monthly",{'geocodigo':str(geocodigo)})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class An_Merge_Monthly_Diff(Resource):
    def get(self, geocodigo, ano):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL("sql/an_merge_monthly_diff",{"geocodigo":str(geocodigo),"ano":str(ano)})
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class An_Monthly_Diff_Limit_Date(Resource):
    def get(self,geocodigo,mes_inicio,ano_inicio,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            mes, ano = (int(mes_fim) + 1), int(ano_fim)
            if mes > 12: mes, ano = 1, ano + 1
            data = conectar.readFileSQL(
                "sql/an_monthly_diff_limit_date",
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

api.add_resource(An_Monthly, '/an_monthly/<geocodigo>/<ano>')
api.add_resource(An_Monthly_Limit_Date, '/an_monthly_limit_date/<geocodigo>/<mes_inicio>/<ano_inicio>/<mes_fim>/<ano_fim>')
api.add_resource(An_Merge_Monthly, '/an_merge_monthly/<geocodigo>')
api.add_resource(An_Merge_Monthly_Diff, '/an_merge_monthly_diff/<geocodigo>/<ano>')
api.add_resource(An_Monthly_Diff_Limit_Date, '/an_monthly_diff_limit_date/<geocodigo>/<mes_inicio>/<ano_inicio>/<mes_fim>/<ano_fim>')
api.add_resource(CitiesByState, '/cities/<uf>')
api.add_resource(States, '/states')

if __name__ == '__main__':
    app.run( port = 4863, host = '0.0.0.0')
