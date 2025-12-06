import React, { useState, useEffect } from "react";
import axios from "axios";

// Create an axios instance using your Vite env variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default function App() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [units, setUnits] = useState("");
  const [quote, setQuote] = useState(null);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load services on mount
  useEffect(() => {
    setLoadingServices(true);
    api
      .get("/services")
      .then((res) => {
        setServices(res.data || []);
      })
      .catch((err) => {
        console.error("Error loading services", err);
        alert("Cannot load services from the backend.");
      })
      .finally(() => {
        setLoadingServices(false);
      });
  }, []);

  function handleCreateQuote() {
    if (!serviceId || !units) {
      alert("Select a service and enter units.");
      return;
    }

    const numericUnits = Number(units);
    if (Number.isNaN(numericUnits) || numericUnits <= 0) {
      alert("Units must be a positive number.");
      return;
    }

    setSubmitting(true);
    api
      .post("/quotes", {
        serviceId,
        units: numericUnits,
      })
      .then((res) => {
        setQuote(res.data);
      })
      .catch((err) => {
        console.error("Error generating quote", err);
        alert("Error generating quote from the backend.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  const selectedService = services.find((s) => String(s.id) === String(serviceId));
  const unitLabel = selectedService?.unitLabel || "units";

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "24px 12px",
        background: "#020617",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#0f172a",
          borderRadius: "16px",
          padding: "20px 18px 24px",
          boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
          border: "1px solid #1f2937",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            margin: 0,
            marginBottom: "4px",
            fontWeight: 600,
          }}
        >
          ClearView Quoting
        </h1>
        <p
          style={{
            margin: 0,
            marginBottom: "18px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Select a service, enter the units, and generate a live quote.
        </p>

        {/* Service select */}
        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#e5e7eb",
            }}
          >
            Service
          </label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            disabled={loadingServices}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #1f2937",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
              outline: "none",
            }}
          >
            <option value="">
              {loadingServices ? "Loading services..." : "-- Select a service --"}
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.pricePerUnit}/unit)
              </option>
            ))}
          </select>
        </div>

        {/* Units input */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "6px",
              color: "#e5e7eb",
            }}
          >
            Units ({unitLabel})
          </label>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder={`Enter ${unitLabel}`}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #1f2937",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleCreateQuote}
          disabled={submitting || loadingServices}
          style={{
            width: "100%",
            padding: "11px 12px",
            borderRadius: "999px",
            border: "none",
            cursor: submitting || loadingServices ? "not-allowed" : "pointer",
            background: submitting || loadingServices ? "#0ea5e9aa" : "#0ea5e9",
            color: "#0b1120",
            fontWeight: 600,
            fontSize: "15px",
            marginBottom: quote ? "16px" : 0,
          }}
        >
          {submitting ? "Generating..." : "Generate Quote"}
        </button>

        {/* Quote result */}
        {quote && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "14px",
              borderTop: "1px solid #1f2937",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                margin: 0,
                marginBottom: "10px",
                fontWeight: 600,
              }}
            >
              Quote Result
            </h2>
            <div style={{ fontSize: "14px", lineHeight: 1.6 }}>
              <div>
                <strong>Service:</strong> {quote.service}
              </div>
              <div>
                <strong>Units:</strong> {quote.units} {unitLabel}
              </div>
              <div>
                <strong>Subtotal:</strong> ${" "}
                {Number(quote.subtotal || 0).toFixed(2)}
              </div>
              <div>
                <strong>Tax:</strong> ${" "}
                {Number(quote.tax || 0).toFixed(2)}
              </div>
              <div>
                <strong>Total:</strong> ${" "}
                {Number(quote.total || 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}