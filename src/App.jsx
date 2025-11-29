import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default function App() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [units, setUnits] = useState("");
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data))
      .catch(() => alert("Cannot load services"));
  }, []);

  function createQuote() {
    if (!serviceId || !units) {
      alert("Select a service and enter units");
      return;
    }

    api
      .post("/quotes", {
        serviceId,
        units: Number(units),
      })
      .then((res) => setQuote(res.data))
      .catch(() => alert("Error generating quote"));
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        background: "#0d1526",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>ClearView Quoting</h1>
     <label>Service:</label>
      <br />
      <select
        value={serviceId}
        onChange={(e) => setServiceId(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          marginTop: "10px",
          borderRadius: "5px",
        }}
      >
        <option value="">-- Select a service --</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} (${s.pricePerUnit}/unit)
          </option>
        ))}
      </select>

      <br />
      <br />

      <label>
        Units (
        {services.find((s) => s.id == serviceId)?.unitLabel || "units"}):
      </label>
      <br />
      <input
        type="number"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        placeholder="Enter units"
        style={{
          padding: "10px",
          width: "250px",
          marginTop: "10px",
          borderRadius: "5px",
        }}
      />

      <br />
      <br />
      
