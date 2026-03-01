import React, { useEffect, useState } from "react";
import api from "../api";
import "../App.css";

function Sales() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMed, setSelectedMed] = useState("");
  const [quantity, setQuantity] = useState("");
  const [bill, setBill] = useState([]);
  const [error, setError] = useState(null);

  const fetchMedicines = () => {
    api.get("/medicines")
      .then(res => setMedicines(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const addToBill = () => {
    if (!selectedMed || !quantity) return;

    const med = medicines.find(m => m.id === parseInt(selectedMed));

    if (!med) return;

    setBill([...bill, {
      id: med.id,
      name: med.name,
      qty: parseInt(quantity),
      price: med.mrp * parseInt(quantity)
    }]);

    setQuantity("");
  };

  const submitSale = () => {
    bill.forEach(item => {
      api.post("/sales", {
        medicine_id: item.id,
        medicine_name: item.name,
        quantity: item.qty,
        price: item.price
      })
      .catch(err => {
        console.log(err);
        setError("Sale failed");
      });
    });

    alert("Sale completed");
    setBill([]);
  };

 return (
  <div className="sales-section">

    <h2 className="section-title">Make a Sale</h2>

    <div className="sales-card">

      <div className="sales-form">

        <select
          className="sales-input"
          value={selectedMed}
          onChange={(e) => setSelectedMed(e.target.value)}
        >
          <option value="">Select Medicine</option>
          {medicines.map(m => (
            <option key={m.id} value={m.id}>
              {m.name} (Stock: {m.quantity})
            </option>
          ))}
        </select>

        <input
          className="sales-input"
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button className="btn btn-primary" onClick={addToBill}>
          Add
        </button>

      </div>

      {bill.length > 0 && (
        <>
          <div className="sales-table-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {bill.map((b, i) => (
                  <tr key={i}>
                    <td>{b.name}</td>
                    <td>{b.qty}</td>
                    <td>₹{b.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sales-action">
            <button className="btn btn-success" onClick={submitSale}>
              Generate Bill
            </button>
          </div>
        </>
      )}

    </div>
  </div>
);
}

export default Sales;