import React, { useEffect, useState } from "react";
import api from "../api";
import Sales from "./Sales";
import "../App.css";

function Dashboard({ refreshFlag }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPOForm, setShowPOForm] = useState(false);
  const [poData, setPoData] = useState({
    medicine_id: "",
    medicine_name: "",
    quantity: ""
  });
  const fetchDashboard = () => {
    setLoading(true);
    api.get("/dashboard")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to load dashboard data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, [refreshFlag]);

  if (loading) return <div className="page-section">Loading dashboard...</div>;
  if (error) return <div className="page-section error">{error}</div>;
  const handleCreatePO = () => {
  api.post("/purchase-orders", {
    medicine_id: Number(poData.medicine_id),
    medicine_name: poData.medicine_name,
    quantity: Number(poData.quantity)
  })
  .then(() => {
    alert("Purchase Order Created");
    setShowPOForm(false);
    fetchDashboard();   // refresh dashboard
  })
  .catch(err => {
    console.log(err);
    alert("Failed to create purchase order");
  });
};
  return (
    <div className="page-section">

      <h2 className="page-title">Dashboard</h2>

      <div className="card-grid">

        <div className="card sales">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Sales</div>
              <div className="card-value">
                ₹{data?.sales_today?.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="card-icon">💰</div>
          </div>
        </div>

        <div className="card items">
          <div className="card-header">
            <div>
              <div className="card-title">Items Sold</div>
              <div className="card-value">
                {data?.total_items_sold || 0}
              </div>
            </div>
            <div className="card-icon">📦</div>
          </div>
        </div>
        <div className="card low-stock">
          <div className="card-header">
            <div>
              <div className="card-title">Low Stock</div>
              <div className="card-value">{data?.low_stock_count || 0}</div>
            </div>
            <div className="card-icon">⚠️</div>
          </div>
        </div>
        <div className="card orders">
          <div className="card-header">
            <div>
              <div className="card-title">Purchase Today</div>
              <div className="card-value">
                ₹{data?.purchase_today?.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="card-icon">📋</div>
          </div>
        </div>

      </div>
{showPOForm && (
  <div className="po-overlay">
    <div className="po-modal">
      <div className="po-header">
        <h3>Create Purchase Order</h3>
        <button className="close-btn" onClick={() => setShowPOForm(false)}>✖</button>
      </div>

      <div className="po-form">
        <input
          placeholder="Medicine ID"
          value={poData.medicine_id}
          onChange={(e) => setPoData({ ...poData, medicine_id: e.target.value })}
        />

        <input
          placeholder="Medicine Name"
          value={poData.medicine_name}
          onChange={(e) => setPoData({ ...poData, medicine_name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={poData.quantity}
          onChange={(e) => setPoData({ ...poData, quantity: e.target.value })}
        />
      </div>

      <div className="po-actions">
        <button className="submit-btn" onClick={handleCreatePO}>Submit</button>
        <button className="cancel-btn" onClick={() => setShowPOForm(false)}>Cancel</button>
      </div>
    </div>
  </div>

)}
<div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
  <button
    className="primary-btn"
    onClick={() => setShowPOForm(true)}
  >
    + New Purchase
  </button>
</div>
      {/* Recent Sales */}
      <div style={{ marginTop: "30px"}}>
        <h3 style={{ fontSize: "24px" , marginBottom: "9px"}}>Recent Sales</h3>

        {data?.recent_sales?.length > 0 ? (
          <table style={ {borderRadius:"16px"}}>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_sales.map(s => (
                <tr key={s.id}>
                  <td>{s.medicine_name}</td>
                  <td>{s.quantity}</td>
                  <td>₹{s.price}</td>
                  <td>{new Date(s.sale_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent sales</p>
        )}
      </div>

      {/* SALES SECTION BELOW DASHBOARD */}
      <div style={{ marginTop: "40px" }}>
        <Sales />
      </div>

    </div>
  );
}

export default Dashboard;