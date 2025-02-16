import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    try {
        const { name, season, episode, language, filePath } = await req.json();

        // Validate input
        if (!name || !season || !episode || !language || !filePath) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Save metadata in NeonDB
        const srtFile = await prisma.sRTFile.create({
            data: {
                name,
                season,
                episode,
                language,
                filePath,
            },
        });

        return NextResponse.json({ message: 'File metadata saved', srtFile }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
