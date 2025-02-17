import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const srtFiles = await prisma.SRTFile.findMany({
    select: {
      id: true,
      name: true,
      season: true,
      episode: true,
      language: true,
    },
  });

  return NextResponse.json(srtFiles);
}

export async function PATCH(req) {
  try {
    const { id, name, season, episode } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedFile = await prisma.SRTFile.update({
      where: { id },
      data: {
        name,
        season: Number(season),   // Convert to integer
        episode: Number(episode), // Convert to integer
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('Error updating SRT file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}
