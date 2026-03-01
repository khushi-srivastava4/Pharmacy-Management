from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import Base, engine, SessionLocal
from models import Medicine, Sale, PurchaseOrder
from schemas import (
    MedicineCreate, MedicineOut, SaleCreate, SaleOut,
    PurchaseOrderCreate, PurchaseOrderOut, DashboardResponse
)
from datetime import date, datetime

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def calculate_status(quantity: int, expiry_date: date) -> str:
    """Calculate medicine status based on quantity and expiry date"""
    if expiry_date < date.today():
        return "Expired"
    if quantity == 0:
        return "Out of Stock"
    if quantity < 20:
        return "Low Stock"
    return "Active"

@app.post("/medicines", response_model=MedicineOut, status_code=201)
def add_medicine(med: MedicineCreate, db: Session = Depends(get_db)):
    # Calculate status based on quantity and expiry
    status = "Active"
    
    if med.expiry_date < date.today():
        status = "Expired"
    elif med.quantity == 0:
        status = "Out of Stock"
    elif med.quantity < 20:
        status = "Low Stock"
    
    new_med = Medicine(
        name=med.name,
        quantity=med.quantity,
        expiry_date=med.expiry_date,
        status=status,
        mrp=med.mrp,
        cost_price= med.cost_price
    )

    db.add(new_med)
    db.commit()
    db.refresh(new_med)

    return new_med

@app.get("/medicines", response_model=List[MedicineOut])
def get_medicines(
    search: Optional[str] = Query(None, description="Search by medicine name"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    query = db.query(Medicine)
    
    if search:
        query = query.filter(Medicine.name.ilike(f"%{search}%"))
    
    if status:
        query = query.filter(Medicine.status == status)
    
    return query.all()

@app.patch("/medicines/{med_id}/status", status_code=200)
def update_status(med_id: int, status: str = Query(..., description="New status"), db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == med_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    medicine.status = status
    db.commit()
    return {"message": "Status updated successfully"}

@app.get("/dashboard", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db)):
    today = date.today()

    today_purchases = db.query(PurchaseOrder).filter(
        PurchaseOrder.order_date == today,
        PurchaseOrder.status == "Completed"
    ).all()

    total_purchase_today = 0

    for po in today_purchases:
        med = db.query(Medicine).filter(Medicine.id == po.medicine_id).first()
        if med:
            total_purchase_today += med.cost_price * po.quantity
    # Get today's sales summary
    today_sales = db.query(Sale).filter(Sale.sale_date == today).all()
    sales_today = sum(sale.price for sale in today_sales)
    
    # Get total items sold today
    total_items_sold = sum(sale.quantity for sale in today_sales)
    
    # Get low stock items count
    low_stock_count = db.query(Medicine).filter(Medicine.status == "Low Stock").count()
    
    # Get purchase order summary
    pending_orders = db.query(PurchaseOrder).filter(PurchaseOrder.status == "Pending").count()
    completed_orders = db.query(PurchaseOrder).filter(PurchaseOrder.status == "Completed").count()
    purchase_order_summary = {
        "pending": pending_orders,
        "completed": completed_orders,
        "total": pending_orders + completed_orders
    }
    
    # Get recent sales (last 10)
    recent_sales = db.query(Sale).order_by(Sale.created_at.desc()).limit(10).all()
    
    return {
        "sales_today": sales_today,
        "total_items_sold": total_items_sold,
        "low_stock_count": low_stock_count,
        "purchase_order_summary": purchase_order_summary,
        "recent_sales": recent_sales,
        "purchase_today": total_purchase_today
    }

@app.delete("/medicines/{med_id}", status_code=200)
def delete_medicine(med_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == med_id).first()

    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(med)
    db.commit()

    return {"message": "Medicine deleted successfully"}

@app.put("/medicines/{med_id}", response_model=MedicineOut, status_code=200)
def update_medicine(med_id: int, med: MedicineCreate, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == med_id).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Update values
    medicine.name = med.name
    medicine.quantity = med.quantity
    medicine.expiry_date = med.expiry_date
    medicine.mrp = med.mrp
    medicine.cost_price = med.cost_price
    # Auto calculate status
    medicine.status = calculate_status(med.quantity, med.expiry_date)

    db.commit()
    db.refresh(medicine)

    return medicine

# Sales endpoints
@app.post("/sales", response_model=SaleOut, status_code=201)
def create_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    # Check if medicine exists
    medicine = db.query(Medicine).filter(Medicine.id == sale.medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    
    # Check if enough stock
    if medicine.quantity < sale.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    
    # Create sale
    new_sale = Sale(
        medicine_id=sale.medicine_id,
        medicine_name=sale.medicine_name,
        quantity=sale.quantity,
        price=sale.price,
        sale_date=date.today()
    )
    
    # Update medicine quantity
    medicine.quantity -= sale.quantity
    medicine.status = calculate_status(medicine.quantity, medicine.expiry_date)
    
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)
    
    return new_sale

@app.get("/sales", response_model=List[SaleOut])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).order_by(Sale.created_at.desc()).all()

# Purchase Order endpoints
@app.post("/purchase-orders", response_model=PurchaseOrderOut, status_code=201)
def create_purchase_order(po: PurchaseOrderCreate, db: Session = Depends(get_db)):
    new_po = PurchaseOrder(
        medicine_id=po.medicine_id,
        medicine_name=po.medicine_name,
        quantity=po.quantity,
        order_date=date.today(),
        status="Pending"
    )
    
    db.add(new_po)
    db.commit()
    db.refresh(new_po)
    
    return new_po

@app.get("/purchase-orders", response_model=List[PurchaseOrderOut])
def get_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).all()

@app.patch("/purchase-orders/{po_id}/status", status_code=200)
def update_purchase_order_status(
    po_id: int,
    status: str = Query(..., description="New status"),
    db: Session = Depends(get_db)
):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    
    po.status = status
    
    # If completed, update medicine quantity
    if status == "Completed":
        medicine = db.query(Medicine).filter(Medicine.id == po.medicine_id).first()
        if medicine:
            medicine.quantity += po.quantity
            medicine.status = calculate_status(medicine.quantity, medicine.expiry_date)
    
    db.commit()
    return {"message": "Purchase order status updated successfully"}