import React from 'react'

const Modal = (editForm, handleChange, handleUpdate, setEditing) => {
  return (
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
  )
}

export default Modal