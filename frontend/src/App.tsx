import React, { useEffect, useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [statusText, setStatusText] = useState<string>('Chargement en cours...');

  const fetchData = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      if (!success) {
        const response = await fetch('http://localhost:3001/auth', {
          credentials: 'include',
        });
        if (response.ok) {
          const url = await response.json();
          window.location.href = url.url;
        } else {
          console.log('response not ok:', response);
        }
      }
      else {
        setLoading(false);
      }
    } catch (error) {
      console.log('error on fetchData:', error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/liked', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          console.log('data:', data);
          setStatusText(`Les ${data.total} musiques Spotify ont été chargées`);
        } else {
          console.log('response not ok:', response);
        }
      } catch (error) {
        console.log('error on fetchStatus:', error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>{statusText}</p>
        )}
      </header>
    </div>
  );
};

export default App;
