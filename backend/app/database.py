from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import logging

# Cambiá los valores por los de tu servidor de PostgreSQL
db_user = "postgres"
db_password = "test123"
db_host = "localhost"
db_port = "5432"
db_name = "postgres" # Base de datos por defecto de PostgreSQL, si no creaste ninguna otra
URL_DB = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"


engine = create_engine(URL_DB)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
# Crear la base de datos iso9001
def create_database(engine, db_name):
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT").execute(f"CREATE DATABASE {db_name}")
