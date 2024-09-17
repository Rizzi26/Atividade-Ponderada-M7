from sqlalchemy import Column, String, Integer, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    ID = Column(String, primary_key=True, index=True)
    USERNAME = Column(String)
    PASSWORD = Column(String)

class Predict(Base):
    __tablename__ = "predict"
    ID = Column(String, primary_key=True, index=True)
    DATE = Column(String)
    USERNAME_PREDICT = Column(String)
    FORECAST = Column(Boolean, default=False)
    FORECAST_RESULT = Column(String)
    USER_ID = Column(Integer, ForeignKey('users.ID'), nullable=False)

class Logs(Base):
    __tablename__ = "logs"
    ID = Column(String, primary_key=True, index=True)
    DATE = Column(String)
    USERNAME_LOG = Column(String)
    ACTION = Column(String)
    USER_ID = Column(Integer, ForeignKey('users.ID', nullable=False))
