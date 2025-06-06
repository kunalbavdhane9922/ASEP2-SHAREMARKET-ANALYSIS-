import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PatternPage({ query }) {
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatterns = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/data', {
          params: { stock: query }
        });
        setPatterns(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchPatterns();
  }, [query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;
  if (!patterns) return null;

  return (<center>
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Stock Pattern Detection</h1>
      <h2 style={{ color: '#666' }}>{query} Stock</h2>
      <h3 style={{ margin: '10px 0' }}>Total Score: {patterns.total_score}</h3>
      <h3 style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
        Forecast: {patterns.forecast}
      </h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px', // Adjust the gap between cards
          justifyContent: 'flex-start', // Align the items to the left
        }}
      >
        {patterns.patterns && (
          <center>
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '0px' }}>
            {Object.entries(patterns.patterns)
              .filter(([, entries]) => entries.length > 0)
              .map(([patternName, entries]) => (
                <div
                  key={patternName}
                  style={{
                    width: '300px', // Set a fixed width for each card
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <h4 style={{ marginBottom: '10px', color: '#444' }}>{patternName}</h4>
                  <img
                    src={`/assets/patterns/${patternName.toLowerCase().replace(/\s+/g, '_')}.png`}
                    alt={`${patternName} pattern`}
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      marginBottom: '10px',
                      borderRadius: '5px',
                    }}
                  />
                  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {entries.map((entry, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        <strong>{entry.date}</strong> - {entry.location} - Volume: {entry.volume} - Score: {entry.score}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </center>
        )}
      </div>
    </div>
    </center>
  );
}
