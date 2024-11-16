from pydantic import BaseModel, field_validator
from typing import List, Optional
from enums import *

class NonConformity(BaseModel):
    user_name: Optional[str] = ""  
    section: Optional[str] = "" 
    sub_section: Optional[str] = ""
    detection_way: Optional[str] = "" # La forma en la que se encuentra la no conformidad 
    base_type: Optional[str] = "" 
    origin_type: Optional[str] = ""
    resources_product: Optional[List[str]] = [] # Lista de insumos con los que existe el problema
    batch: Optional[int] = None # Numero de lote
    attributes_product: Optional[List[str]] = [] 
    nc_products: Optional[str] = ""
    result_products: Optional[str] = "" 
    process: Optional[str] = ""
    attributes_process: Optional[list[str]] = []
    nc_process: Optional[str] = ""
    action: Optional[str] = ""
    description: Optional[str] = ""
    
    #========== Validators =============
    @field_validator("section")
    @classmethod
    def check_section(cls, v: str):
        if v and v not in Section._value2member_map_:
            raise ValueError(f"Section must be one of {Section}")
        return v
    
    @field_validator("sub_section")
    @classmethod
    def check_sub_section(cls, v: str):
        if v and v not in SubSection._value2member_map_:
            raise ValueError(f"SubSection must be one of {SubSection}")
        return v
    
    @field_validator("detection_way")
    @classmethod
    def check_detection_way(cls, v: str):
        if v and v not in DetectionWay._value2member_map_:
            raise ValueError(f"DetectionWay must be one of {DetectionWay}")
        return v
    
    @field_validator("base_type")
    @classmethod
    def check_base_type(cls, v: str):
        if v and v not in BaseType._value2member_map_:
            raise ValueError(f"BaseType must be one of {BaseType}")
        return v
    
    @field_validator("origin_type")
    @classmethod
    def check_origin_type(cls, v: str):
        if v and v not in OriginType._value2member_map_:
            raise ValueError(f"OriginType must be one of {OriginType}")
        return v
    
    @field_validator("attributes_product")
    @classmethod
    def check_attributes_product(cls, v: List[str]):
        for i in v:
            if i and i not in ProductAttributes._value2member_map_:
                raise ValueError(f"AttributesProduct must be one of {ProductAttributes._value2member_map_}")
        return v
    
    @field_validator("process")
    @classmethod
    def check_process(cls, v: str):
        if v and v not in Process._value2member_map_:
            raise ValueError(f"Process must be one of {Process}")
        return v
    
    @field_validator("attributes_process")
    @classmethod
    def check_attributes_process(cls, v: List[str]):
        for i in v:
            if i and i not in ProcessAttributes._value2member_map_:
                raise ValueError(f"AttributesProcess must be one of {ProcessAttributes}")
        return v
    
    @field_validator("result_products")
    @classmethod
    def check_result_products(cls, v: str):
        if v and v not in ProductResult._value2member_map_:
            raise ValueError(f"ResultProducts must be one of {ProductResult}")
        return v
    
    @field_validator("nc_products", "nc_process")
    @classmethod
    def check_nc(cls, v: str):
        if v and v not in NcResult._value2member_map_:
            raise ValueError(f"Nc must be one of {NcResult}")
        return v
    
    @field_validator("action")
    @classmethod
    def check_action(cls, v: str):
        if v and v not in Action._value2member_map_:
            raise ValueError(f"Action must be one of {Action}")
        return v