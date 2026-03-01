import React, { useEffect, useState } from "react";
import api from "../api";
import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";
import "../App.css";

function Inventory({ refreshFlag, refreshDashboard }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const fetchMedicines = () => {
    setLoading(true);
    setError(null);
    api.get("/medicines")
      .then(res => {
        setMedicines(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load medicines");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMedicines();
  }, [refreshFlag]);

  const handleAddOrUpdate = () => {
    fetchMedicines();
    refreshDashboard();
    setEditingMedicine(null);
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
  };

  // Calculate overview summary
  const totalMedicines = medicines.length;
  const activeMedicines = medicines.filter(m => m.status === "Active").length;
  const lowStockMedicines = medicines.filter(m => m.status === "Low Stock").length;
  const expiredMedicines = medicines.filter(m => m.status === "Expired").length;
  const outOfStockMedicines = medicines.filter(m => m.status === "Out of Stock").length;

  return (
    <div className="page-section">
      <h2 className="page-title">Inventory</h2>

      {error && <div className="error">{error}</div>}

      {/* Inventory Overview Summary */}
      <div className="overview-summary">
        <div className="summary-item">
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📊</div>
          <div className="summary-value" style={{ color: "#3b82f6" }}>{totalMedicines}</div>
          <div className="summary-label">Total Items</div>
        </div>
        <div className="summary-item">
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>✅</div>
          <div className="summary-value" style={{ color: "#10b981" }}>{activeMedicines}</div>
          <div className="summary-label">Active Stock</div>
        </div>
        <div className="summary-item">
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>⚠️</div>
          <div className="summary-value" style={{ color: "#f59e0b" }}>{lowStockMedicines}</div>
          <div className="summary-label">Low Stock</div>
        </div>
        <div className="summary-item">
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>❌</div>
          <div className="summary-value" style={{ color: "#ef4444" }}>{expiredMedicines}</div>
          <div className="summary-label">Expired</div>
        </div>
        <div className="summary-item">
          <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📦</div>
          <div className="summary-value" style={{ color: "#64748b" }}>{outOfStockMedicines}</div>
          <div className="summary-label">Out of Stock</div>
        </div>
      </div>

      {/* Add/Update Medicine Form */}
      <MedicineForm
        onAdd={handleAddOrUpdate}
        refreshDashboard={refreshDashboard}
        editingMedicine={editingMedicine}
        onCancel={handleCancelEdit}
      />

      {/* Medicine List */}
      {loading ? (
        <div className="loading">Loading medicines...</div>
      ) : (
        <MedicineList
          medicines={medicines}
          refresh={fetchMedicines}
          refreshDashboard={refreshDashboard}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default Inventory;
