'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { upload } from '@vercel/blob/client';
import ProgressBar from './progress-bar';
import UploadSVG from "@/components/UploadSVG"
export default function Uploader() {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    function reset() {
        setIsUploading(false);
        setFile(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsUploading(true);

        if (file) {
            try {
                const blob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/actions/upload',
                    onUploadProgress: (progressEvent) => {
                        setProgress(progressEvent.percentage);
                    },
                });

                toast(
                    (t) => (
                        <div className="relative">
                            <div className="p-2">
                                <p className="font-semibold text-gray-900">File uploaded!</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Your file has been uploaded to{' '}
                                    <a
                                        className="font-medium text-gray-900 underline"
                                        href={blob.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {blob.url}
                                    </a>
                                </p>
                            </div>
                        </div>
                    ),
                    { duration: Number.POSITIVE_INFINITY }
                );
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    throw error;
                }
            }

            reset();
        }
    }

    function handleFileChange(file) {
        toast.dismiss();

        if (!file.name.endsWith('.srt')) {
            toast.error('We only accept .srt subtitle files');
            return;
        }

        if (file.size / 1024 / 1024 > 50) {
            toast.error('File size too big (max 50MB)');
            return;
        }

        setFile(file);
    }

    return (
        <form className="grid gap-6" onSubmit={handleSubmit}>
            <h1>Here, you can contribute subtitles to the site. These will be publicly available.</h1>
            <div>
                <div className="space-y-1 mb-4">
                    <h2 className="text-xl font-semibold">Upload a subtitle file</h2>
                </div>
                <label
                    htmlFor="subtitle-upload"
                    className="group relative mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
                >
                    <div
                        className="absolute z-[5] h-full w-full rounded-md"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(true);
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(false);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(false);

                            const file = e.dataTransfer?.files?.[0];
                            if (file) {
                                handleFileChange(file);
                            }
                        }}
                    />
                    <div
                        className={`${dragActive ? 'border-2 border-black' : ''
                            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${file
                                ? 'bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                                : 'bg-white opacity-100 hover:bg-gray-50'
                            }`}
                    >
                        <uploadSVG/>
                        
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Drag and drop or click to upload.
                        </p>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Max file size: 50MB
                        </p>
                        <span className="sr-only">Subtitle upload</span>
                    </div>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        id="subtitle-upload"
                        name="subtitle"
                        type="file"
                        accept=".srt"
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.currentTarget?.files?.[0];
                            if (file) {
                                handleFileChange(file);
                            }
                        }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                {isUploading && <ProgressBar value={progress} />}

                <button
                    type="submit"
                    disabled={isUploading || !file}
                    className="border-black bg-black text-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
                >
                    <p className="text-sm">Upload</p>
                </button>

                <button
                    type="reset"
                    onClick={reset}
                    disabled={isUploading || !file}
                    className="border-gray-200 bg-gray-100 text-gray-700 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
                >
                    Reset
                </button>
            </div>
        </form>
    );
}