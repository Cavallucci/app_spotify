import React from 'react';
import './App.css';

const App: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLoading(false);
      } else {
        console.log('response not ok');
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
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
        )}
      </header>
    </div>
  );
};

export default App;