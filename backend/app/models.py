# models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from database import Base

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
    images = relationship("NCTicketImage", back_populates="ticket")

class NCTicketImage(Base):
    __tablename__ = "nc_ticket_images"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("nc_tickets.id"), nullable=False)
    image = Column(LargeBinary, nullable=False)
    ticket = relationship("NCTicket", back_populates="images")