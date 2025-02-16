// app/favorites/page.js
'use client';

import { useState, useEffect } from 'react';

export default function FavoritesPage() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodes, setSelectedEpisodes] = useState([]);

  useEffect(() => {
    fetch('/api/srtFiles')
      .then((response) => response.json())
      .then((data) => {
        const uniqueShows = [...new Set(data.map((file) => file.name))];
        setShows(uniqueShows);
      });
  }, []);

  const handleShowSelect = (show) => {
    setSelectedShow(show);
    fetch(`/api/srtFiles?show=${show}`)
      .then((response) => response.json())
      .then((data) => {
        const uniqueSeasons = [...new Set(data.map((file) => file.season))];
        setSeasons(uniqueSeasons);
      });
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    fetch(`/api/srtFiles?show=${selectedShow}&season=${season}`)
      .then((response) => response.json())
      .then((data) => {
        setEpisodes(data);
      });
  };

  const handleEpisodeSelect = (episodeId) => {
    const updatedEpisodes = selectedEpisodes.includes(episodeId)
      ? selectedEpisodes.filter((id) => id !== episodeId)
      : [...selectedEpisodes, episodeId];
    setSelectedEpisodes(updatedEpisodes);
    updateUserSRTFile(updatedEpisodes);
  };

  const updateUserSRTFile = async (episodeIds) => {
    await fetch('/api/userSRTFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ episodeIds }),
    });
  };

  return (
    <div>
      <h1>Select Your Favorite SRT Files</h1>
      <div>
        <h2>Shows</h2>
        <ul>
          {shows.map((show) => (
            <li key={show} onClick={() => handleShowSelect(show)}>
              {show}
            </li>
          ))}
        </ul>
      </div>
      {selectedShow && (
        <div>
          <h2>Seasons</h2>
          <ul>
            {seasons.map((season) => (
              <li key={season} onClick={() => handleSeasonSelect(season)}>
                Season {season}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedSeason && (
        <div>
          <h2>Episodes</h2>
          <ul>
            {episodes.map((episode) => (
              <li key={episode.id} onClick={() => handleEpisodeSelect(episode.id)}>
                Episode {episode.episode}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}