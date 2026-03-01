import React, { useState, useEffect } from "react";
import api from "../api";
import "../App.css";

function MedicineForm({ onAdd, refreshDashboard, editingMedicine, onCancel }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mrp, setMrp] = useState("");
  const [costPrice, setCostPrice] = useState("");

  useEffect(() => {
  if (editingMedicine) {
    setName(editingMedicine.name);
    setQuantity(editingMedicine.quantity.toString());
    setExpiryDate(editingMedicine.expiry_date);
    setMrp(editingMedicine.mrp?.toString() || "");
    setCostPrice(editingMedicine.cost_price?.toString() || "");
  } else {
    setName("");
    setQuantity("");
    setExpiryDate("");
    setMrp("");
    setCostPrice("");
  }
  setError(null);
}, [editingMedicine]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parsedMrp = parseFloat(mrp);
    const parsedCost = parseFloat(costPrice);

    if (isNaN(parsedMrp) || isNaN(parsedCost)) {
      setError("MRP and Cost Price must be valid numbers");
      setLoading(false);
      return;
    }

    const medicineData = {
      name: name.trim(),
      quantity: parseInt(quantity) || 0,
      expiry_date: expiryDate,
      mrp: parsedMrp,
      cost_price: parsedCost
    };
    console.log("Sending to backend:", medicineData);

    if (!medicineData.name || !medicineData.expiry_date) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (editingMedicine) {
      // Update existing medicine
      api.put(`/medicines/${editingMedicine.id}`, medicineData)
        .then(() => {
          setName("");
          setQuantity("");
          setExpiryDate("");
          onAdd();
          refreshDashboard();
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          const errorDetail = err.response?.data?.detail;
          let errorMessage = "Failed to update medicine";
          
          if (errorDetail) {
            if (Array.isArray(errorDetail)) {
              // Handle validation errors array
              errorMessage = errorDetail.map(e => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
            } else if (typeof errorDetail === 'string') {
              errorMessage = errorDetail;
            } else {
              errorMessage = JSON.stringify(errorDetail);
            }
          }
          
          setError(errorMessage);
          setLoading(false);
        });
    } else {
      // Add new medicine
      api.post("/medicines", medicineData)
        .then(() => {
          setName("");
          setQuantity("");
          setExpiryDate("");
          onAdd();
          refreshDashboard();
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          const errorDetail = err.response?.data?.detail;
          let errorMessage = "Failed to add medicine";
          
          if (errorDetail) {
            if (Array.isArray(errorDetail)) {
              // Handle validation errors array
              errorMessage = errorDetail.map(e => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
            } else if (typeof errorDetail === 'string') {
              errorMessage = errorDetail;
            } else {
              errorMessage = JSON.stringify(errorDetail);
            }
          }
          
          setError(errorMessage);
          setLoading(false);
        });
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        {editingMedicine ? "Update Medicine" : "Add New Medicine"}
      </h3>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Medicine Name</label>
            <input
              type="text"
              placeholder="Enter medicine name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              required
            />
          </div>
        
        <div className="form-group">
          <label>MRP</label>
          <input
            type="number"
            value={mrp}
            onChange={e => setMrp(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Cost Price</label>
          <input
            type="number"
            value={costPrice}
            onChange={e => setCostPrice(e.target.value)}
            required
          />
        </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : editingMedicine ? "Update Medicine" : "Add Medicine"}
          </button>
          {editingMedicine && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MedicineForm;
