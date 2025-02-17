export default function EditModal({ editing, editForm, onChange, onCancel, onUpdate }) {
    // If not editing, don't render anything
    if (!editing) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Edit Episode</h2>
  
          {/* Show name */}
          <label className="block mb-2">
            Show Name:
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </label>
  
          {/* Season */}
          <label className="block mb-2">
            Season:
            <input
              type="number"
              name="season"
              value={editForm.season}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </label>
  
          {/* Episode */}
          <label className="block mb-2">
            Episode:
            <input
              type="number"
              name="episode"
              value={editForm.episode}
              onChange={onChange}
              className="w-full border rounded p-2"
            />
          </label>
  
          {/* Action buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button onClick={onUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
  