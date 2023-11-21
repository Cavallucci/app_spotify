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
        //prendre les titres de chaque musique de l'album
        if (data.tracks) {
          const list = await Promise.all(
            data.tracks.items.map(async (item: { name: string }) => {
              return { name: item.name, isFavorite: await isFavorite(item.name, favorites) };
            }));
          setTitles(list);
        }
      } catch (error) {
        console.log('error on fetchData:', error);
      }
    };
    fetchData();
  }, [id, favorites]);

  const toggleFavorite = async (index: number) => {
    const title = titles[index];
    if (title.isFavorite) {
      //récupérer l'id de la musique
      const data = await fetchAlbums(id);
      const idTrack = data.tracks.items[index].id;
      //await fetech backend Spotify
      try {
        await fetch(`http://localhost:3001/remove?id=${idTrack}`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.log('error on toggleFavorite:', error);
      }
      setFavorites(prevFavorites => {
        const newFavorites = { ...prevFavorites };
        newFavorites[title.name] = false;
        return newFavorites;
      });
    } else {
      setFavorites(prevFavorites => {
        const newFavorites = { ...prevFavorites };
        newFavorites[title.name] = true;
        return newFavorites;
      });
    }
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