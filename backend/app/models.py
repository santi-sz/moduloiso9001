from sqlalchemy import Column, ForeignKey, String, Integer, Date
from database import Base

class NCTicket(Base):
    __tablename__ = "non_conformity_ticket"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement= True)
    date = Column(Date, index=True, nullable=False)
    user_name = Column(String, nullable=False, index=True)
    
    section = Column(String, nullable=True, index=True)
    sub_section = Column(String, nullable=True, index=True)
    
    detection_way = Column(String, nullable=True)
    base_type = Column(String, nullable=True)
    origin_type = Column(String, nullable=True)
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