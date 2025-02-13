'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'file-name': selectedFile.name,
      },
      body: selectedFile,
    });

    if (response.ok) {
      alert('File uploaded successfully!');
      window.location.reload(); // Refresh the page to show the updated list
    } else {
      alert('Failed to upload file.');
    }
  };

  return (
    <div>
      <h1>Upload SRT Files</h1>
      <input type="file" accept=".srt" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <h2>Uploaded SRT Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            <strong>{file.fileName}</strong> - {file.uploadedAt}
            <pre>{file.content}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}