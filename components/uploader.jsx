'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';
import ProgressBar from './progress-bar';
import UploadSVG from './UploadSVG';

export default function Uploader() {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // Metadata fields
    const [name, setName] = useState('');
    const [season, setSeason] = useState('');
    const [episode, setEpisode] = useState('');
    const [language, setLanguage] = useState('hebrew'); // Default to Hebrew

    const reset = () => {
        setIsUploading(false);
        setFile(null);
        setName('');
        setSeason('');
        setEpisode('');
        setLanguage('hebrew');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !name || !season || !episode || !language) {
            return toast.error('All fields are required');
        }
        setIsUploading(true);
        
        try {
            // Upload to Vercel Blob
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/actions/upload',
                onUploadProgress: (progressEvent) => setProgress(progressEvent.percentage),
            });

            // Save metadata in NeonDB
            const res = await fetch('/api/upload-srt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    season: parseInt(season, 10),
                    episode: parseInt(episode, 10),
                    language,
                    filePath: blob.url,
                }),
            });

            if (!res.ok) throw new Error('Failed to save metadata');

            toast.success(
                <span>
                    File uploaded! <a href={blob.url} target="_blank" className="underline">View file</a>
                </span>
            );
        } catch (error) {
            toast.error(error.message || 'Upload failed');
        }

        reset();
    };

    const handleFileChange = (file) => {
        toast.dismiss();
        if (!file.name.endsWith('.srt')) return toast.error('Only .srt files allowed');
        if (file.size > 50 * 1024 * 1024) return toast.error('Max file size: 50MB');
        setFile(file);
    };

    const handleDrag = (e, isActive) => {
        e.preventDefault();
        setDragActive(isActive);
    };

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <h1>Upload subtitle files for public use.</h1>
            <h2 className="text-lg font-semibold">Upload a subtitle file</h2>

            {/* Series Name */}
            <input
                type="text"
                placeholder="Series name"
                className="border p-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            {/* Season */}
            <input
                type="number"
                placeholder="Season"
                className="border p-2 rounded-md"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
            />

            {/* Episode */}
            <input
                type="number"
                placeholder="Episode"
                className="border p-2 rounded-md"
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
            />

            {/* Language Dropdown */}
            <select
                className="border p-2 rounded-md"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="hebrew">Hebrew</option>
                <option value="english">English</option>
            </select>

            {/* File Upload */}
            <label
                htmlFor="subtitle-upload"
                className={`relative flex h-32 cursor-pointer items-center justify-center rounded-md border p-4 transition ${dragActive ? 'border-2 border-black' : 'border-gray-300'}`}
                onDragOver={(e) => handleDrag(e, true)}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={(e) => {
                    handleDrag(e, false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileChange(file);
                }}
            >
                <UploadSVG dragActive={dragActive} />
                <p className="text-sm text-gray-500">Drag & drop or click to upload (Max 50MB)</p>
                <input
                    id="subtitle-upload"
                    type="file"
                    accept=".srt"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
            </label>
            
            {isUploading && <ProgressBar value={progress} />}

            <button
                type="submit"
                disabled={!file || isUploading}
                className="h-10 w-full rounded-md bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
                Upload
            </button>
            
            <button
                type="button"
                onClick={reset}
                disabled={!file || isUploading}
                className="h-10 w-full rounded-md bg-gray-200 text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed"
            >
                Reset
            </button>
        </form>
    );
}
