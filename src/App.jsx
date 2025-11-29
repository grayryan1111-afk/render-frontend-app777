import React, { useState, useEffect } 
from "react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default function App() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [units, setUnits] = 
useState("");
  const [quote, setQuote] = 
useState(null);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => 
setServices(res.data))
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
      .then((res) => 
setQuote(res.data))
      .catch(() => alert("Error 
generating quote"));
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