'use client';
import React, { useState, useEffect } from 'react';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import ExpandCollapseIcon from '@/components/ExpandCollapseIcon';
import EditModal from '@/components/EditModal';
import ShowRow from '@/components/ShowRow';
import SeasonRow from '@/components/SeasonRow';
import EpisodeRow from '@/components/EpisodeRow';


export default function FavoritesPage() {
  // Shows structure: { [showName]: { [seasonNumber]: [ {id, episode}, ... ] } }
  const [shows, setShows] = useState({});
  // Selected episodes (checkboxes)
  const [selectedEpisodes, setSelectedEpisodes] = useState({});
  // Track which show/season is expanded
  const [expanded, setExpanded] = useState({});
  // Track editing state (null if no episode is being edited)
  const [editing, setEditing] = useState(null);
  // Edit form fields
  const [editForm, setEditForm] = useState({ id: '', name: '', season: '', episode: '' });

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/srtFiles').then((res) => res.json()),
      fetch('/api/userSRTFile').then((res) => res.json()),
    ]).then(([files, userData]) => {
      // Convert array of files into a nested { show -> season -> [episodes] } structure
      const structuredShows = files.reduce((acc, { name, season, id, episode }) => {
        acc[name] = acc[name] || {};
        acc[name][season] = acc[name][season] || [];
        acc[name][season].push({ id, episode });
        return acc;
      }, {});

      // Convert user’s episodeIds into a lookup object (true/false)
      const selections = (userData.episodeIds || []).reduce((map, id) => {
        map[id] = true;
        return map;
      }, {});

      setShows(structuredShows);
      setSelectedEpisodes(selections);
    });
  }, []);

  // Toggle expand/collapse for a given key (show or season)
  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Toggle the checkbox for a specific episode ID
  const toggleEpisodeSelection = (id) => {
    setSelectedEpisodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // When user clicks "Edit," set up the editing state
  const handleEdit = (episodeObj) => {
    setEditing(episodeObj);
    setEditForm(episodeObj);
  };

  // Handle form field changes in the Edit Modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the updated episode to the server and update local state
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

    // Update local "shows" state with new episode data
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

    // Close the modal
    setEditing(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Select & Edit Episodes</h1>

      <table className="min-w-full border-collapse">
        <tbody>
          {Object.entries(shows).map(([showName, seasons]) => (
            <React.Fragment key={showName}>
              {/* Render the show row */}
              <ShowRow
                showName={showName}
                expanded={expanded[showName]}
                onToggle={() => toggleExpand(showName)}
              />

              {/* If the show is expanded, render its seasons */}
              {expanded[showName] &&
                Object.entries(seasons).map(([seasonNum, episodes]) => (
                  <React.Fragment key={seasonNum}>
                    {/* Render the season row */}
                    <SeasonRow
                      showName={showName}
                      seasonNum={seasonNum}
                      expanded={expanded[`${showName}-${seasonNum}`]}
                      onToggle={() => toggleExpand(`${showName}-${seasonNum}`)}
                    />

                    {/* If the season is expanded, render its episodes */}
                    {expanded[`${showName}-${seasonNum}`] &&
                      episodes.map((ep) => (
                        <EpisodeRow
                          key={ep.id}
                          ep={ep}
                          showName={showName}
                          seasonNum={seasonNum}
                          selected={!!selectedEpisodes[ep.id]}
                          onCheckboxToggle={() => toggleEpisodeSelection(ep.id)}
                          onEdit={() =>
                            handleEdit({ ...ep, name: showName, season: seasonNum })
                          }
                        />
                      ))}
                  </React.Fragment>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Edit Modal (shows only when "editing" is not null) */}
      <EditModal
        editing={editing}
        editForm={editForm}
        onChange={handleChange}
        onCancel={() => setEditing(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
