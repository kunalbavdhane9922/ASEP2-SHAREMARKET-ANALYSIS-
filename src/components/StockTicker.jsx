// b91aef3d357e464597ee641611d6ca42

import React, { useEffect, useState } from "react";
import "./StockTicker.css";

const symbols = ["AAPL", "GOOGL", "TSLA"];
const api_key = "b91aef3d357e464597ee641611d6ca42"
const StockTicker = () => {
  const [prices, setPrices] = useState([]);

  const fetchPrices = async () => {
    try {
      const symbolString = symbols.join(",");
      const response = await fetch(
        `https://api.twelvedata.com/price?symbol=${symbolString}&apikey=${api_key}`
      );
      const data = await response.json();
      const random = Math.floor(Math.random() * 100)
      // Convert object to array for consistent rendering
      const updatedPrices = symbols.map((symbol) => ({
        symbol,
        price: data[symbol]?.price || `${random}`,
      }));

      setPrices(updatedPrices);
    } catch (error) {
      console.error("Failed to fetch stock prices", error);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker">
      <div className="ticker-content">
        {prices.map((stock) => (
          <span key={stock.symbol}>
            {stock.symbol}: ${stock.price} &nbsp;|&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
