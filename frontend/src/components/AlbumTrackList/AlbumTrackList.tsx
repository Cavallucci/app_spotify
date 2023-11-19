import React, { useEffect, useState } from 'react';
import "./AlbumTrackList.css";

const fetchAlbums = async (id: string) => {
  console.log('id in front:', id);
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
    console.log('error on fetchStatus:', error);
  }
};

const AlbumTrackList: React.FC<{id: string}> = ({id}) => {
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAlbums(id);
        //prendre les titres de chaque musique de l'album
        const list = data.tracks.items.map((item: { name: string; }) => {
          return item.name;
        });
        setTitles(list);
      } catch (error) {
        console.log('error on fetchData:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="tracks-container">
        <h2>Titres de l'album</h2>
      <ul>
        {titles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumTrackList;