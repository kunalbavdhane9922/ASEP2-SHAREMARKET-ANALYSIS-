import React, { useEffect, useState } from "react";
import "./Watchlist.css";
import Navbar from "./Navbar";
const API_KEY = "3922ac1ea7a545b9a5ddc07cabd826e1"; // Replace with your Twelve Data API key

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : ["AAPL", "GOOGL"];
  });

  const [stockData, setStockData] = useState([]);
  const [input, setInput] = useState("");

  const fetchStockData = async () => {
    if (watchlist.length === 0) return;

    try {
      const symbols = watchlist.join(",");
      const res = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${API_KEY}`
      );
      const data = await res.json();

      // Normalize data to array form
      let parsedData = [];

      if (Array.isArray(data)) {
        parsedData = data;
      } else {
        // If it's a single object, wrap in array
        parsedData = watchlist.map((sym) => data[sym] ?? null);
      }

      setStockData(parsedData);
    } catch (error) {
      console.error("Error fetching stock data", error);
    }
  };

  useEffect(() => {
    fetchStockData();
    const interval = setInterval(fetchStockData, 15000);
    return () => clearInterval(interval);
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const addStock = () => {
    const sym = input.toUpperCase().trim();
    if (sym && !watchlist.includes(sym)) {
      setWatchlist([...watchlist, sym]);
    }
    setInput("");
  };

  const removeStock = (symbol) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  return (
    <>
    <Navbar></Navbar>
    <div className="watchlist">
      <h2>📈 My Watchlist</h2>
      <div className="input-group">
        <input
          type="text"
          value={input}
          placeholder="Enter symbol (e.g., MSFT)"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addStock}>Add</button>
      </div>
      <ul>
        {stockData.map((stock, idx) => {
          if (!stock || !stock.symbol) return null;
          return (
            <li key={stock.symbol + idx}>
              <strong>{stock.symbol}</strong>: ${stock.close} &nbsp;
              <span
                className={
                  parseFloat(stock.percent_change) >= 0 ? "up" : "down"
                }
              >
                ({stock.percent_change}%)
              </span>
              <button onClick={() => removeStock(stock.symbol)}>❌</button>
            </li>
          );
        })}
      </ul>
    </div>
    </>
  );
};

export default Watchlist;
