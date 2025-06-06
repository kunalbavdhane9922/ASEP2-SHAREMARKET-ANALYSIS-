import React, { useState, useEffect } from "react";
import Navbar from './Navbar';
const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual NewsAPI key
  const API_KEY = "3922ac1ea7a545b9a5ddc07cabd826e1";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=stock%20market&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading news...</p>;
  if (error) return <p>Error fetching news: {error}</p>;

  return (
    <>
    <Navbar></Navbar>
    <div style={styles.container}>
      <h1 style={styles.heading}>Top Bussiness News (India)</h1>
      {articles.length === 0 ? (
        <p>No news found.</p>
      ) : (
        articles.map((article, idx) => (
          <div key={idx} style={styles.card}>
            {article.urlToImage && (
              <img src={article.urlToImage} alt={article.title} style={styles.image} />
            )}
            <div style={styles.content}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "20px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  image: {
    width: "200px",
    objectFit: "cover",
  },
  content: {
    padding: "15px",
  },
};

export default News;
