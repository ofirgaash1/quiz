'use client';
import React, { useState, useEffect } from 'react';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import ExpandCollapseIcon from '@/components/ExpandCollapseIcon';

export default function FavoritesPage() {
  const [shows, setShows] = useState({});
  const [selectedEpisodes, setSelectedEpisodes] = useState({});
  const [expanded, setExpanded] = useState({});

  // Fetch and group episodes by show and season.
  useEffect(() => {
    fetch('/api/srtFiles')
      .then((res) => res.json())
      .then((data) => {
        const grouped = data.reduce((acc, file) => {
          acc[file.name] = acc[file.name] || {};
          acc[file.name][file.season] = acc[file.name][file.season] || [];
          acc[file.name][file.season].push({ id: file.id, episode: file.episode });
          return acc;
        }, {});
        setShows(grouped);
      });
  }, []);

  // On page load, fetch the user's saved favorites and mark them as selected.
  useEffect(() => {
    fetch('/api/userSRTFile')
      .then((res) => res.json())
      .then((data) => {
        if (data.episodeIds) {
          const favs = {};
          data.episodeIds.forEach((id) => {
            favs[id] = true;
          });
          setSelectedEpisodes(favs);
        }
      })
      .catch((err) => {
        console.error('Error fetching favorites:', err);
      });
  }, []);

  // Toggle expand/collapse for a given key.
  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle selection for the given episode IDs.
  const toggleSelection = (ids) => {
    const allSelected = ids.every((id) => selectedEpisodes[id]);
    setSelectedEpisodes((prev) => {
      const updated = { ...prev };
      ids.forEach((id) => {
        updated[id] = !allSelected;
      });
      return updated;
    });
  };

  // Compute selection state for a list of episodes.
  const getSelectionState = (episodes) => {
    const total = episodes.length;
    const selectedCount = episodes.filter((ep) => selectedEpisodes[ep.id]).length;
    if (selectedCount === total && total !== 0) return { checked: true, indeterminate: false };
    if (selectedCount === 0) return { checked: false, indeterminate: false };
    return { checked: false, indeterminate: true };
  };

  // Save selected episodes.
  const handleSave = async () => {
    const selectedIds = Object.keys(selectedEpisodes).filter((id) => selectedEpisodes[id]);
    await fetch('/api/userSRTFile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episodeIds: selectedIds }),
    });
    alert('Favorites saved successfully!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Select Your Favorite Episodes
      </h1>
      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(shows).map(([showName, seasons]) => {
            // All episodes for the show.
            const showEpisodes = Object.values(seasons).flat();
            const showSelection = getSelectionState(showEpisodes);
            return (
              <React.Fragment key={showName}>
                {/* Show row with a distinctive background */}
                <tr className="bg-gray-200 border-b border-gray-300">
                  <td className="p-4 w-12">
                    <button onClick={() => toggleExpand(showName)} className="focus:outline-none">
                      <ExpandCollapseIcon expanded={expanded[showName]} />
                    </button>
                  </td>
                  <td className="p-4 w-12">
                    <AnimatedCheckbox
                      checked={showSelection.checked}
                      indeterminate={showSelection.indeterminate}
                      onChange={() => toggleSelection(showEpisodes.map((ep) => ep.id))}
                    />
                  </td>
                  <td
                    className="p-4 text-xl font-semibold cursor-pointer"
                    onClick={() => toggleSelection(showEpisodes.map((ep) => ep.id))}
                  >
                    {showName}
                  </td>
                </tr>

                {/* Season rows */}
                {expanded[showName] &&
                  Object.entries(seasons).map(([season, episodes]) => {
                    const seasonKey = `${showName}-${season}`;
                    const seasonSelection = getSelectionState(episodes);
                    return (
                      <React.Fragment key={seasonKey}>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <td className="p-4 pl-8 w-12">
                            <button onClick={() => toggleExpand(seasonKey)} className="focus:outline-none">
                              <ExpandCollapseIcon expanded={expanded[seasonKey]} />
                            </button>
                          </td>
                          <td className="p-4 w-12">
                            <AnimatedCheckbox
                              checked={seasonSelection.checked}
                              indeterminate={seasonSelection.indeterminate}
                              onChange={() => toggleSelection(episodes.map((ep) => ep.id))}
                            />
                          </td>
                          <td
                            className="p-4 text-lg cursor-pointer"
                            onClick={() => toggleSelection(episodes.map((ep) => ep.id))}
                          >
                            Season {season}
                          </td>
                        </tr>

                        {/* Episode rows with a distinct white background */}
                        {expanded[seasonKey] &&
                          episodes.map((ep) => (
                            <tr key={ep.id} className="bg-white border-b border-gray-100">
                              <td className="p-4 pl-16"></td>
                              <td className="p-4">
                                <AnimatedCheckbox
                                  checked={!!selectedEpisodes[ep.id]}
                                  indeterminate={false}
                                  onChange={() => toggleSelection([ep.id])}
                                />
                              </td>
                              <td
                                className="p-4 text-base cursor-pointer"
                                onClick={() => toggleSelection([ep.id])}
                              >
                                Episode {ep.episode}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="mt-8 text-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Save Favorites
        </button>
      </div>
    </div>
  );
}
