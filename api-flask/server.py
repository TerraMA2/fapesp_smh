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
# Controle das análises
import time
import timeit
import csv
# =====================

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

class AnalysisMonthly(Resource):
    def get(self,geocodigo,mes_inicio,ano_inicio,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            mes, ano = (int(mes_fim) + 1), int(ano_fim)
            if mes > 12: mes, ano = 1, ano + 1
            data = conectar.readFileSQL(
                "sql/analysis_month",
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

class ClimMonthly(Resource):
    def get(self,geocodigo,mes):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/clim_monthly",
                {
                    "geocodigo": str(geocodigo),
                    "mes": str(mes)
                }
            )
            print(data)
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

class AnalysisDaily(Resource):
    def get(self,geocodigo,dia_inicio,mes_inicio,ano_inicio,dia_fim,mes_fim,ano_fim):
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/analysis_daily",
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

class ClimDaily(Resource):
    # Controle das análises
    def getLog(self):
        try:
            logs = pd.read_csv('logs.csv', sep = ',')
            return logs
        except:
            return {}
    def saveLog(self, data):
        try:
            with open('logs.csv', mode = 'w', encoding = 'utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames = ["inicio","fim","tempo","municipios_processados"])
                writer.writeheader()
                writer.writerow({
                    "inicio" : float(data["inicio"]),
                    "fim" : float(data["fim"]),
                    "tempo" : float(data["tempo"]),
                    "municipios_processados" : float(data["municipios_processados"])
                })
            return True
        except:
            return False
    # =====================
    def get(self,geocodigo,mes,dia):  
        try:
            conectar = Connection_pg("chuva")
            data = conectar.readFileSQL(
                "sql/clim_daily",
                {
                    "geocodigo": str(geocodigo),
                    "mes": str(mes),
                    "dia": str(dia)
                }
            )
            print(data)
            # Controle das análises
            log = self.getLog()
            ok = self.saveLog({
                "inicio" : float(log["inicio"][0]),
                "fim" : float(log["fim"][0]) + timeit.default_timer(),
                "tempo" : round(float(float(log["fim"][0]) - float(log["inicio"][0])),2),
                "municipios_processados" : int(log["municipios_processados"][0]) + 1
            })
            if ok: print("\n\n => Save Log OK ", end = "")
            else: print("\n\n => Save Log False ", end = "")
            log = self.getLog()
            pc = int(log["municipios_processados"][0])
            print(" %.2f por cento concluído, %.0f municípios processados \n\n" %(((pc/5556) * 100),pc))
            # =====================
            return jsonify(data.to_dict())
        except:
            return jsonify({ 'info' : 'Impossível ler o geocodigo {}'.format(str(geocodigo)) })

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

api.add_resource(AnalysisMonthly, '/analysis-monthly/<geocodigo>/<mes_inicio>/<ano_inicio>/<mes_fim>/<ano_fim>')
api.add_resource(ClimMonthly, '/clim-monthly/<geocodigo>/<mes>')
api.add_resource(AnalysisDaily,'/analysis-daily/<geocodigo>/<dia_inicio>/<mes_inicio>/<ano_inicio>/<dia_fim>/<mes_fim>/<ano_fim>')
api.add_resource(ClimDaily, '/clim-daily/<geocodigo>/<mes>/<dia>')
api.add_resource(CitiesByState, '/cities/<uf>')
api.add_resource(States, '/states')
api.add_resource(Layers, '/layers')

if __name__ == '__main__':
    app.run( debug = True, host = '0.0.0.0' )