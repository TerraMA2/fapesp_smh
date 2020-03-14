from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
from geoalchemy2 import Geometry

Base = declarative_base()

class Municipio(Base):
    __tablename__ = 'municipios_brasil'
    fid = Column(Integer, primary_key = True)
    fid_1 = Column(Integer)
    sprarea = Column(Float)
    geocodigo = Column(String)
    nome1 = Column(String)
    uf = Column(String)
    id_uf = Column(String)
    regiao = Column(String)
    mesoregiao = Column(String)
    microregia = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    sede = Column(String)
    ogr_geometry = Column(Geometry('MultiPolygon'))