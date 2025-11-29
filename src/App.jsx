import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

export default function App() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [units, setUnits] = useState("");
  const [quote, setQuote] = useState(null);

  // Load services on start
  useEffect(() => {
    api.get("/services")
      .then(res => setServices(res.data))
      .catch(() => alert("Cannot load services. Check backend URL."));
  }, []);

  // Create quote
  function createQuote() {
    if (!serviceId || !units) {
      alert("Select a service and enter units.");
      return;
    }

    api.post("/quotes", {
      serviceId,
      units: Number(units)
    })
    .then(res => setQuote(res.data))
    .catch(() => alert("Error generating quote"));
  }

  return (
    <div style={{
      padding: "20px",
      fontFamily: "Arial",
      background: "#0d1526",
      minHeight: "100vh",
      color: "white"
    }}>
      <h1>ClearView Quoting</h1>

      <label>Service:</label><br />
      <select
        value={serviceId}
        onChange={e => setServiceId(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "15px" }}
      >
        <option value="">-- Select a service --</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      <label>Units ({services.find(s => s.id === serviceId)?.unit || "units"}):</label><br />
      <input
        type="number"
        value={units}
        onChange={e => setUnits(e.target.value)}
        placeholder="Enter units"
        style={{ padding: "10px", width: "100%", marginBottom: "15px" }}
      />

      <button
        onClick={createQuote}
        style={{
          padding: "10px 20px",
          background: "#4CAF50",
          border: "none",
          color: "white",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Generate Quote
      </button>

      {quote && (
        <div style={{
          marginTop: "25px",
          padding: "15px",
          background: "#1c2b45",
          borderRadius: "8px"
        }}>
          <h2>Quote Result</h2>
          <p><b>Service:</b> {quote.serviceName}</p>
          <p><b>Units:</b> {quote.units}</p>
          <p><b>Subtotal:</b> ${quote.subtotal}</p>
          <p><b>Tax:</b> ${quote.tax}</p>
          <p><b>Total:</b> ${quote.total}</p>
        </div>
      )}
    </div>
  );
}
