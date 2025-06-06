import React from 'react';
import { Link } from 'react-router-dom';
import Login from './Login'; // Adjust the path as needed

const Navbar = () => {
  return (
    <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <div className="navbar-logo">
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none', color: '#333' }}>
          StockVerse
        </Link>
      </div>
      <div className="navbar-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/chatbot" style={{ textDecoration: 'none', color: '#555' }}>Chatbot</Link>
        <Link to="/charts" style={{ textDecoration: 'none', color: '#555' }}>Charts</Link>
        <Link to="/prediction" style={{ textDecoration: 'none', color: '#555' }}>Prediction</Link>
        <Login />
      </div>
    </div>
  );
};

export default Navbar;
