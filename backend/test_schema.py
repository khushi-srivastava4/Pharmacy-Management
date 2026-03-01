"""Test script to verify MedicineCreate schema"""
from schemas import MedicineCreate
from datetime import date

# Test that status is NOT required
test_data = {
    "name": "Test Medicine",
    "quantity": 100,
    "expiry_date": "2026-12-31"
}

try:
    med = MedicineCreate(**test_data)
    print("SUCCESS: Schema validation passed!")
    print(f"Medicine: {med.name}, Quantity: {med.quantity}, Expiry: {med.expiry_date}")
    print(f"Status field exists: {hasattr(med, 'status')}")
    if hasattr(med, 'status'):
        print(f"Status value: {med.status}")
except Exception as e:
    print(f"ERROR: Schema validation failed: {e}")
