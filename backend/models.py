from sqlalchemy import Column, Integer, String, Date, Float, DateTime
from datetime import datetime
from database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    expiry_date = Column(Date, nullable=False)
    status = Column(String, nullable=True)
    mrp = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer)
    medicine_name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    sale_date = Column(Date, default=datetime.now().date())
    created_at = Column(DateTime, default=datetime.now)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    medicine_id = Column(Integer)
    medicine_name = Column(String)
    quantity = Column(Integer)
    order_date = Column(Date, default=datetime.now().date())
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.now)