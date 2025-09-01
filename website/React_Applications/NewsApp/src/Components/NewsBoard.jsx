import { useState, useEffect } from 'react';
import NewsItem from './NewsItem';

const NewsBoard = ({category}) => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${import.meta.env.VITE_API_KEY}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'ok') {
          setArticles(data.articles || []);
        } else {
          setError('News loading failed');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong');
      }
    };

    fetchData();
  }, [category]);

  return (
    <div>
      <h2 className="text-center my-3">
        Latest <span className="badge bg-danger">News</span>
      </h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {articles.length > 0 ? (
        articles.map((news, index) => (
          <NewsItem
            key={index}
            title={news.title}
            description={news.description}
            src={news.urlToImage}
            url={news.url}
          />
        ))
      ) : (
        !error && <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default NewsBoard;
