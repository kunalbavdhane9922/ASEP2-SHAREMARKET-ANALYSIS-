import React, { useState } from "react";
import axios from "axios";

const StockAnalyzer = () => {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState("");
  const [patterns, setPatterns] = useState([]);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setForecast("");
    setPatterns([]);
    setError("");

    try {
      // Step 1: Fetch and save stock data
      await axios.post("http://localhost:5000/get-stock-data", { symbol });

      // Step 2: Analyze CSV
      const response = await axios.get("http://localhost:5000/api/data");
      setForecast(response.data.forecast);
      setPatterns(response.data.details);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>📊 Stock Candlestick Analyzer</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g. AAPL)"
          style={{ padding: "8px", width: "60%", marginRight: "10px" }}
        />
        <button onClick={handleAnalyze} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {forecast && (
        <div>
          <h3>📈 Forecast: {forecast}</h3>
          <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Date</th>
                <th>Location</th>
                <th>Volume</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((p, index) => (
                <tr key={index}>
                  <td>{p.pattern || Object.keys(p)[0]}</td>
                  <td>{p.date}</td>
                  <td>{p.location}</td>
                  <td>{p.volume.toLocaleString()}</td>
                  <td>{p.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockAnalyzer;
