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
    pid_an_municipio_clim_monthly = Column(Integer)

class AnMonthlyByCity(Base):
    __tablename__ = 'an_municipio_monthly'
    fid = Column(Integer, primary_key = True)
    execution_date = Column(Date)
    maxima = Column(Float)
    media = Column(Float)
    anomalia = Column(Float)
    pid_an_municipio_monthly = Column(Integer)

class AnClimDailyByCity(Base):
    __tablename__ = 'an_municipio_clim_daily'
    fid = Column(Integer, primary_key = True)
    execution_date = Column(Date)
    maxima = Column(Float)
    media = Column(Float)
    pid_an_municipio_clim_daily = Column(Integer)

class AnDailyByCity(Base):
    __tablename__ = 'an_municipio_daily'
    fid = Column(Integer, primary_key = True)
    execution_date = Column(Date)
    maxima = Column(Float)
    media = Column(Float)
    anomalia = Column(Float)
    pid_an_municipio_daily = Column(Integer)