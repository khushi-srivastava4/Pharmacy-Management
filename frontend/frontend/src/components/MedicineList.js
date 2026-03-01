import React, { useState, useEffect } from "react";
import api from "../api";
import "../App.css";

function MedicineList({ medicines, refresh, refreshDashboard, onEdit }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);

  useEffect(() => {
    let filtered = medicines;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    setFilteredMedicines(filtered);
  }, [medicines, search, statusFilter]);

  const updateStatus = (id, status) => {
    api.patch(`/medicines/${id}/status?status=${status}`)
      .then(() => {
        refresh();
        refreshDashboard();
      })
      .catch(err => {
        console.log(err);
        alert("Failed to update status");
      });
  };

  const deleteMedicine = (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      api.delete(`/medicines/${id}`)
        .then(() => {
          refresh();
          refreshDashboard();
        })
        .catch(err => {
          console.log(err);
          alert("Failed to delete medicine");
        });
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Active": "status-active",
      "Low Stock": "status-low-stock",
      "Expired": "status-expired",
      "Out of Stock": "status-out-of-stock"
    };
    return statusMap[status] || "";
  };

  return (
     <div>
    {/* //   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
    //     <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.125rem", fontWeight: "700" }}>Complete Inventory</h3>
    //     <div className="filter-export">
    //       <button className="btn btn-secondary btn-small">Filter</button>
    //       <button className="btn btn-primary btn-small">Export</button>
    //     </div>
    //   </div> */}

      {/* Search and Filter */}
      <div className="search-container">
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search medicine by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="search-input"
            style={{
              maxWidth: "200px",
              cursor: "pointer"
            }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Expired">Expired</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          {(search || statusFilter) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Medicine Table */}
      {filteredMedicines.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>MRP</th>
                <th>Cost Price</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td style={{ fontWeight: "500" }}>{m.name}</td>
                  <td>{m.quantity}</td>
                  <td>₹{m.mrp?.toFixed(2)}</td>
                  <td>₹{m.cost_price?.toFixed(2)}</td>
                  <td>{new Date(m.expiry_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => onEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small"
                      style={{ backgroundColor: "#ed8936", color: "white" }}
                      onClick={() => updateStatus(m.id, "Low Stock")}
                    >
                      Low Stock
                    </button>
                    <button
                      className="btn btn-small"
                      style={{ backgroundColor: "#f56565", color: "white" }}
                      onClick={() => updateStatus(m.id, "Expired")}
                    >
                      Expired
                    </button>
                    <button
                      className="btn btn-small"
                      style={{ backgroundColor: "#718096", color: "white" }}
                      onClick={() => updateStatus(m.id, "Out of Stock")}
                    >
                      Out of Stock
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => deleteMedicine(m.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>
          {search || statusFilter
            ? "No medicines found matching your filters"
            : "No medicines in inventory"}
        </div>
      )}

      <div style={{ marginTop: "15px", color: "#718096", fontSize: "0.875rem" }}>
        Showing {filteredMedicines.length} of {medicines.length} medicines
      </div>
    </div>
  );
}

export default MedicineList;
