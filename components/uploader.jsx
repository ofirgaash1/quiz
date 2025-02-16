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

    const reset = () => {
        setIsUploading(false);
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setIsUploading(true);
        
        try {
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/actions/upload',
                onUploadProgress: (progressEvent) => setProgress(progressEvent.percentage),
            });
            toast.success(
                <span>
                    File uploaded! <a href={blob.url} target="_blank" className="underline">View file</a>
                </span>
            );
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Upload failed');
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
