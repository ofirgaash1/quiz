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
    const fileInput = document.getElementById("fileInput"); // Replace with your HTML element ID
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch("/actions/upload", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Upload SRT Files</h1>
      <input id='fileInput' type="file" accept=".srt" onChange={handleFileChange} />
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