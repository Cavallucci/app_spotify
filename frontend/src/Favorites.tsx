import React, { useEffect, useState } from 'react';
import './Favorites.css';

const fetchFavorites = async () => {
  try {
    const response = await fetch('http://localhost:3001/liked', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log('response not ok:', response);
    }
  } catch (error) {
    console.log('error on fetchStatus:', error);
  }
};

interface FavoriteItem {
  albumObj: Object;
  image: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFavorites();
        const list = data.items.map((item: { track: { album: { images: { url: string; }[]; }; }; }) => {
          return {
            albumObj: item.track.album,
            image: item.track.album.images[0].url,
          };
        });
        setFavorites(list);
      } catch (error) {
        console.log('error on fetchData:', error);
      }
    };

    fetchData();
    }, []);

    const handleNext = () => {
        if (current < favorites.length - 1) {
            setCurrent(current + 1);
        }
    };
    const handlePrevious = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    }
    return (
        <div className="favorites-container">
          <h1>Mes Titres Favoris</h1>
          <div className="album-container">
            <img src={favorites[current]?.image} alt="album cover" className="album-image" />
            <div className="button-container">
              <button onClick={handlePrevious} className="spotify-button">Previous</button>
              <button onClick={handleNext} className="spotify-button">Next</button>
            </div>
          </div>
        </div>
      );
};

export default Favorites;