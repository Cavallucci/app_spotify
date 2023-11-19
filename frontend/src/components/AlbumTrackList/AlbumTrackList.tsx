import React, { useEffect, useState } from 'react';
import "./AlbumTrackList.css";
import { fetchFavorites } from '../Favorites/Favorites';

const fetchAlbums = async (id: string) => {
  try {
    //fetch avec l'id de l'album
    const response = await fetch(`http://localhost:3001/albums?id=${id}`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log('response not ok:', response);
    }
  } catch (error) {
    console.log('error on fetchAlbums:', error);
  }
};

const isFavorite = async (title: string, favorites: { [id: string]: boolean }) => {
  let favoritesData = await fetchFavorites();
  for (let i = 0; i < favoritesData.items.length; i++) {
    if (favoritesData.items[i].track.name === title) {
      return true;
    }
  }
  return false;
};

const AlbumTrackList: React.FC<{id: string}> = ({id}) => {
  const [titles, setTitles] = useState<{name: string; isFavorite: boolean}[]>([]);
  const [favorites, setFavorites] = useState<{ [id: string]: boolean}>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAlbums(id);
        console.log('data fetchalbums:', data);
        //prendre les titres de chaque musique de l'album
        const list = await Promise.all(
          data.tracks.items.map(async (item: { name: string }) => {
            console.log(`item.name: ${item.name} is favorite: ${await isFavorite(item.name, favorites)}`);
            return { name: item.name, isFavorite: await isFavorite(item.name, favorites) };
          }));
        setTitles(list);
      } catch (error) {
        console.log('error on fetchData:', error);
      }
    };

    fetchData();
  }, [id, favorites]);

  useEffect(() => {
    console.log('favorites:', favorites);
    }, [favorites]);

  const toggleFavorite = (index: number) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = { ...prevFavorites };
      const title = titles[index];
      console.log('title:', title);
      updatedFavorites[title.name] = !title.isFavorite;
      return updatedFavorites;
    });
  };  

  return (
    <div className="tracks-container">
      <h2>Titres de l'album</h2>
      <ul>
        {titles.map((title, index) => (
          <li key={index}>
            <span>{title.name}</span>
            <button onClick={() => toggleFavorite(index)}>
              {title.isFavorite ? '❤️' : '🤍'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumTrackList;