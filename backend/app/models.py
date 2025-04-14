from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.dialects.postgresql import JSON
from datetime import datetime

class NCTicket(Base):
    __tablename__ = "nc_tickets"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False)
    user_name = Column(String, nullable=False)
    section = Column(String, nullable=False)
    sub_section = Column(String, nullable=False)
    detection_way = Column(String, nullable=False)
    base_type = Column(String, nullable=False)
    origin_type = Column(String, nullable=False)
    batch = Column(Integer, nullable=True)
    resources_product = Column(String, nullable=True)
    attributes_product = Column(String, nullable=True)
    nc_products = Column(String, nullable=True)
    result_products = Column(String, nullable=True)
    process = Column(String, nullable=True)
    attributes_process = Column(String, nullable=True)
    nc_process = Column(String, nullable=True)
    action = Column(String, nullable=True)
    description = Column(String, nullable=True)
    archivos = relationship("Archivo", back_populates="ticket", cascade="all, delete-orphan")


class CauseAnalysis(Base):
    __tablename__ = "cause_analysis"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("nc_tickets.id"), nullable=True)  # Relación opcional con NCTicket
    date_analysis = Column(DateTime)
    problem = Column(String)
    suggestion = Column(String)
    section = Column(String)
    user = Column(String)
    date_ticket = Column(DateTime)
    assistants = Column(JSON, nullable=True)  # Lista de asistentes en formato JSON
    definition = Column(String)

    cause1 = Column(String(250), nullable=True)
    cause2 = Column(String(250), nullable=True)
    cause3 = Column(String(250), nullable=True)
    cause4 = Column(String(250), nullable=True)
    cause5 = Column(String(250), nullable=True)
    cause6 = Column(String(250), nullable=True)
    cause_origin = Column(String(250), nullable=True)

    proposed_solution = Column(String(250), nullable=False)
    resources = relationship("Resource", back_populates="analisis", cascade="all, delete-orphan")
    archivos = relationship("Archivo", back_populates="analisis", cascade="all, delete-orphan")

    gravedad = Column(String(250))
    costo_oportunidad = Column(String)


class Archivo(Base):
    __tablename__ = 'archivo'
    
    id = Column(Integer, primary_key=True)
    analisis_id = Column(Integer, ForeignKey('cause_analysis.id'), nullable=True)  # Relación opcional con CauseAnalysis
    ticket_id = Column(Integer, ForeignKey('nc_tickets.id'), nullable=True)  # Relación opcional con NCTicket
    
    nombre = Column(String(255), nullable=False)  # Nombre original del archivo
    nombre_almacenado = Column(String(255), nullable=False)  # Nombre en el sistema (único)
    ruta_relativa = Column(String(512), nullable=False)  # Ruta relativa para acceso web
    tipo_archivo = Column(String, nullable=False)
    extension = Column(String(10))
    tamano_bytes = Column(Integer)
    fecha_subida = Column(DateTime, default=datetime.utcnow)
    
    analisis = relationship("CauseAnalysis", back_populates="archivos")  # Relación con CauseAnalysis
    ticket = relationship("NCTicket", back_populates="archivos")  # Relación con NCTicket


class Resource(Base):
    """
        Tabla para representar los atributos de cada recurso requerido
        para la solucion del problema
    """
    __tablename__ = 'recurso_requerido'

    id = Column(Integer, primary_key=True)
    analisis_id = Column(Integer, ForeignKey('cause_analysis.id'), nullable=False)  # Relación corregida
    tipo = Column(String, nullable=False)
    
    unidad_medida = Column(String(50))
    cantidad = Column(Float)
    precio = Column(Float)
    total_estimado = Column(Float)
    proveedor_1 = Column(String(100))
    proveedor_2 = Column(String(100))

    analisis = relationship("CauseAnalysis", back_populates="resources")  # Relación corregida