// PatternDashboard.jsx
import React from 'react';
import PatternPage from './PatternPage';
import CandlestickChart from './CandlestickChart';
// import './GamingTheme.css'; // This line is OK here
import Navbar from "./Navbar";
const PatternDashboard = ({ query }) => {
  return (
    <>
    <Navbar></Navbar>
    <div className="gaming-bg text-light py-4">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="glow-text" style={{color : "black"}}>📈 Stock Pattern Dashboard</h1>
        </div>

        <div className="column">
          <div >
            <div className="card glass-card">
              <div className="card-body">
                <CandlestickChart />
              </div>
            </div>
          </div>
          <div >
            <div className="card glass-card">
              <div className="card-body">

                <PatternPage query={query} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PatternDashboard;
