import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ← Import Link
import PatternDashboard from './PatternDashboard';
import "./FirstPage.css";
import Login from "./Login"
import News from './News';
import StockTicker from './StockTicker';
import Navbar from './Navbar';
const stockList = {
  "Apple": "AAPL",
  "Amazon": "AMZN",
  "Google": "GOOGL",
  "Microsoft": "MSFT",
  "Tesla": "TSLA",
  "NVIDIA": "NVDA",
  "Meta": "META",
  "Netflix": "NFLX",
  "Tata Motors": "TTM",
  "Reliance Industries": "RELIANCE",
};

const FirstPage = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const suggestionsRef = useRef(null);

  const cards = [
    { img: "chatbot.png", title: "AI Chatbot", desc: "Talk stocks with an intelligent assistant.", path: "/chatbot" },
    { img: "chart.png", title: "Live Charts", desc: "Visualize stock trends in real-time.", path: "/charts" },
    { img: "prediction.png", title: "Future Prediction", desc: "Get AI-based stock predictions.", path: "/prediction" },
    { img: "news.png", title: "Bussiness News", desc: "Get Bussiness News.", path: "/news" },
    { img: "watchlist.png", title: "Watch List", desc: "your Watch List.", path: "/watchlist" },
  ];

  // ...[rest of the code remains unchanged]...

  return (
    <div className="container">
<Navbar></Navbar>
<div><StockTicker></StockTicker></div>
      <center><div className="dashboard-container">
        {cards.map((card, i) => (
          <Link to={card.path} key={i} className="card-link">
            <div className="card">
              <img src={card.img} alt={card.title} className="card-img" />
              <h2 className="card-title">{card.title}</h2>
              <p className="card-desc">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div></center>

      <div className="footer">
        &copy; 2025 StockVerse. All rights reserved.
      </div>
    </div>
  );
};

export default FirstPage;
