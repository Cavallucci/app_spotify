import React from 'react';
import './App.css';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth');
      if (response.ok) {
        const url = await response.json();
        console.log('url = ', url);
        window.location.href = url.url;
        setLoading(false);
      } else {
        console.log('response not ok:', response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <p>
            loaded
          </p>
        )}
      </header>
    </div>
  );
};

export default App;