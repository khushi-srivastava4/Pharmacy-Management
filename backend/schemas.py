from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional, List


class MedicineCreate(BaseModel):
    name: str
    quantity: int
    expiry_date: date
    mrp: float
    cost_price: float
class MedicineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str
    quantity: int
    status: str
    expiry_date: date
    mrp: float
    cost_price: float

class SaleCreate(BaseModel):
    medicine_id: int
    medicine_name: str
    quantity: int
    price: float

class SaleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    medicine_id: int
    medicine_name: str
    quantity: int
    price: float
    sale_date: date

class PurchaseOrderCreate(BaseModel):
    medicine_id: int
    medicine_name: str
    quantity: int

class PurchaseOrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    medicine_id: int
    medicine_name: str
    quantity: int
    order_date: date
    status: str

class DashboardResponse(BaseModel):
    sales_today: float
    total_items_sold: int
    low_stock_count: int
    purchase_order_summary: dict
    recent_sales: List[SaleOut]
    purchase_today: float