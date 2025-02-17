'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AnimatedCheckbox: an animated checkbox that supports checked, unchecked, and indeterminate states.
function AnimatedCheckbox({ checked, indeterminate, onChange, size = 24 }) {
  const state = checked ? 'checked' : indeterminate ? 'indeterminate' : 'unchecked';
  const variants = {
    unchecked: { backgroundColor: '#fff', borderColor: '#ccc' },
    indeterminate: { backgroundColor: '#93c5fd', borderColor: '#93c5fd' },
    checked: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  };

  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        onChange(e);
      }}
      animate={state}
      variants={variants}
      transition={{ duration: 0.2 }}
      style={{ width: size, height: size }}
      className="border-2 rounded flex items-center justify-center cursor-pointer"
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            key="check"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-3 h-3 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
        {!checked && indeterminate && (
          <motion.div
            key="indeterminate"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-3 h-0.5 bg-white"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ExpandCollapseIcon: an animated chevron that rotates when expanded.
function ExpandCollapseIcon({ expanded }) {
  return (
    <motion.svg
      animate={{ rotate: expanded ? 90 : 0 }}
      transition={{ duration: 0.2 }}
      className="w-6 h-6 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </motion.svg>
  );
}

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
