import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import PatternPage from './PatternPage';
import PatternDashboard from './PatternDashboard';

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

function Home() {
  const [query, setQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const suggestionsRef = useRef(null);

  const handleSearch = async () => {
    if (!query.trim() || !stockList[query]) {
      setMessage('Please enter a valid stock name from the list.');
      return;
    }

    setLoading(true);
    setMessage('');
    setShowDashboard(false);

    try {
      const response = await axios.post('http://localhost:5000/get-stock-data', {
        symbol: stockList[query]
      });

      setMessage(response.data.message || 'Data fetched successfully.');
      setShowDashboard(true);
    } catch (error) {
      setMessage(`Error fetching data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.trim()) {
      const filtered = Object.keys(stockList).filter((stock) =>
        stock.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }

    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        const selected = suggestions[highlightedIndex];
        setQuery(selected);
        setSuggestions([]);
        handleSearch();
      } else {
        handleSearch();
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const styles = {
    app: {
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f4f4f4',
    },
    logo: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    searchBox: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto 20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      border: '1px solid #ddd',
    },
    suggestionsList: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: '40px',
      left: '0',
      width: '100%',
      backgroundColor: '#fff',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      zIndex: 1000,
    },
    suggestionItem: {
      padding: '10px',
      cursor: 'pointer',
    },
    highlighted: {
      backgroundColor: '#007BFF',
      color: '#fff',
    },
    buttons: {
      textAlign: 'center',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007BFF',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    message: {
      textAlign: 'center',
      color: message.includes('Error') ? 'red' : 'green',
      marginTop: '20px',
    },
    dashboardContainer: {
      marginTop: '20px',
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.logo}>
        <h1>STOCK MARKET</h1>
      </div>

      <div style={styles.searchBox} ref={suggestionsRef}>
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        {suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.map((s, index) => (
              <li
                key={s}
                style={{
                  ...styles.suggestionItem,
                  ...(index === highlightedIndex ? styles.highlighted : {}),
                }}
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.buttons}>
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{ ...styles.button, ...(loading && styles.buttonDisabled) }}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}

      {showDashboard && (
        <div style={styles.dashboardContainer}>
          <PatternDashboard query={query} />
        </div>
      )}
    </div>
  );
}

export default Home;
