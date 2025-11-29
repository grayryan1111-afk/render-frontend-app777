
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

  useEffect(() => {
    api.get("/services").then(r => setServices(r.data));
  }, []);

  function createQuote() {
    api.post("/quotes", {
      serviceId,
      units: Number(units)
    }).then(r => setQuote(r.data))
      .catch(e => alert("Quote error"));
  }

  return (
    <div style={{padding:20, fontFamily:"Arial", background:"#0d1526", minHeight:"100vh", color:"#fff"}}>
      <h1>ClearView Quoting</h1>

      <label>Service:</label><br/>
      <select value={serviceId} onChange={e=>setServiceId(e.target.value)}>
        <option value="">Select...</option>
        {services.map(s=>(
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      <br/><br/>

      <label>Units:</label><br/>
      <input type="number" value={units} onChange={e=>setUnits(e.target.value)} placeholder="Enter units" />

      <br/><br/>

      <button onClick={createQuote}>Generate Quote</button>

      {quote && (
        <div style={{marginTop:20, padding:15, border:"1px solid #999"}}>
          <h2>Quote</h2>
          <p>Service: {quote.serviceName}</p>
          <p>Subtotal: ${quote.subtotal}</p>
          <p>Tax: ${quote.tax}</p>
          <p><b>Total: ${quote.total}</b></p>
        </div>
      )}
    </div>
  );
}
