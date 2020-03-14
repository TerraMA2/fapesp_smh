from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date
from geoalchemy2 import Geometry

Base = declarative_base()

class AnClimMonthlyByCity(Base):
    __tablename__ = 'an_municipio_clim_monthly'
    fid = Column(Integer, primary_key = True)
    execution_date = Column(Date)
    maxima = Column(Float)
    media = Column(Float)
    mes = Column(String)
    pid_an_municipio_merge_monthly = Column(Integer)
