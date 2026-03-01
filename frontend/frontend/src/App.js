import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import "./App.css";

function App() {

  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshFlag, setRefreshFlag] = useState(false);

  const refreshDashboard = () => {
    setRefreshFlag(prev => !prev);
  };

  return (
    <div className="app-container">

      <div className="app-header">
        <div>
          <h1>Pharmacy Management</h1>
          <div className="app-header-subtitle">
            Manage inventory, sales, and purchase orders
          </div>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div className="nav-tabs">
        <button
          className={activeTab === "dashboard" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={activeTab === "inventory" ? "nav-tab active" : "nav-tab"}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
      </div>

      {/* CONDITIONAL RENDER */}
      {activeTab === "dashboard" && (
        <Dashboard refreshFlag={refreshFlag} />
      )}

      {activeTab === "inventory" && (
        <Inventory
          refreshFlag={refreshFlag}
          refreshDashboard={refreshDashboard}
        />
      )}

    </div>
  );
}

export default App;