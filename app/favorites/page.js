'use client';
import React, { useState, useEffect } from 'react';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import ExpandCollapseIcon from '@/components/ExpandCollapseIcon';

export default function FavoritesPage() {
  // State to store shows/seasons/episodes in a structured format
  const [shows, setShows] = useState({});
  // State to keep track of which episodes are selected (checkbox)
  const [selectedEpisodes, setSelectedEpisodes] = useState({});
  // State to keep track of which items (shows/seasons) are expanded
  const [expanded, setExpanded] = useState({});
  // State for the editing modal (null if not editing)
  const [editing, setEditing] = useState(null);
  // State for the edit form fields
  const [editForm, setEditForm] = useState({ id: '', name: '', season: '', episode: '' });

  // Fetch show/episode data + user selections on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/srtFiles').then((res) => res.json()),
      fetch('/api/userSRTFile').then((res) => res.json()),
    ]).then(([files, userData]) => {
      // Convert fetched files into a structure: { showName: { seasonNumber: [ {id, episode}, ... ] } }
      const structuredShows = files.reduce((acc, { name, season, id, episode }) => {
        acc[name] = acc[name] || {};
        acc[name][season] = acc[name][season] || [];
        acc[name][season].push({ id, episode });
        return acc;
      }, {});

      // Convert user’s episode IDs into a lookup for the checkboxes
      const selections = (userData.episodeIds || []).reduce((map, id) => {
        map[id] = true;
        return map;
      }, {});

      setShows(structuredShows);
      setSelectedEpisodes(selections);
    });
  }, []);

  // Expand/collapse logic for shows or seasons
  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // When the user clicks the "Edit" button on an episode
  const handleEdit = (episodeObj) => {
    setEditing(episodeObj);
    setEditForm(episodeObj);
  };

  // Handle changes to the edit form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send updated episode info to the server, then update local state
  const handleUpdate = async () => {
    await fetch('/api/srtFiles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        season: parseInt(editForm.season, 10),
        episode: parseInt(editForm.episode, 10),
      }),
    });

    // Update our local shows state to reflect the new episode number
    setShows((prev) => {
      const { name, season, id, episode } = editForm;
      return {
        ...prev,
        [name]: {
          ...prev[name],
          [season]: prev[name][season].map((ep) =>
            ep.id === id ? { ...ep, episode } : ep
          ),
        },
      };
    });

    // Close the edit modal
    setEditing(null);
  };

  // Toggle the checkbox selection of an episode
  const toggleEpisodeSelection = (id) => {
    setSelectedEpisodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto p-8">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8">Select & Edit Episodes</h1>

      {/* Main table */}
      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(shows).map(([showName, seasons]) => (
            <React.Fragment key={showName}>
              {/* Row for the entire show */}
              <tr className="bg-gray-200 border-b border-gray-300">
                <td className="p-4 w-12">
                  <button onClick={() => toggleExpand(showName)}>
                    <ExpandCollapseIcon expanded={expanded[showName]} />
                  </button>
                </td>
                {/* Use colSpan to merge columns, so we have consistent total columns */}
                <td className="p-4 text-xl font-semibold" colSpan={2}>
                  {showName}
                </td>
              </tr>

              {/* Rows for each season within the show, only if show is expanded */}
              {expanded[showName] &&
                Object.entries(seasons).map(([seasonNum, episodes]) => (
                  <React.Fragment key={seasonNum}>
                    {/* Row for the season */}
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <td className="p-4 w-12 pl-6">
                        <button onClick={() => toggleExpand(`${showName}-${seasonNum}`)}>
                          <ExpandCollapseIcon expanded={expanded[`${showName}-${seasonNum}`]} />
                        </button>
                      </td>
                      <td className="p-4 text-lg" colSpan={2}>
                        Season {seasonNum}
                      </td>
                    </tr>

                    {/* Rows for each episode within the season, only if season is expanded */}
                    {expanded[`${showName}-${seasonNum}`] &&
                      episodes.map((ep) => (
                        <tr
                          key={ep.id}
                          className="bg-white border-b border-gray-100 hover:bg-gray-50"
                        >
                          {/* Episode checkbox */}
                          <td className="p-4 pl-6 align-middle">
                            <AnimatedCheckbox
                              checked={!!selectedEpisodes[ep.id]}
                              onChange={() => toggleEpisodeSelection(ep.id)}
                            />
                          </td>
                          {/* Episode number text */}
                          <td className="p-4 align-middle">Episode {ep.episode}</td>
                          {/* Edit button */}
                          <td className="p-4 align-middle text-right">
                            <button
                              className="text-blue-600 underline"
                              onClick={() =>
                                handleEdit({
                                  ...ep,
                                  name: showName,
                                  season: seasonNum,
                                })
                              }
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal for editing an episode */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Episode</h2>

            {/* Show name field */}
            <label className="block mb-2">
              Show Name:
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </label>

            {/* Season field */}
            <label className="block mb-2">
              Season:
              <input
                type="number"
                name="season"
                value={editForm.season}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </label>

            {/* Episode field */}
            <label className="block mb-2">
              Episode:
              <input
                type="number"
                name="episode"
                value={editForm.episode}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </label>

            {/* Buttons to cancel or update */}
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
