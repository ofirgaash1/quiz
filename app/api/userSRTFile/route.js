// app/api/userSRTFile/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUserID } from '@/app/actions/currentUserID';

// GET endpoint to fetch saved favorite episode IDs for the current user.
export async function GET(request) {
  const userId = await currentUserID();
  if (!userId) {
    return NextResponse.json({ episodeIds: [] });
  }

  // Fetch the user's favorite SRT files and extract the srtFileId values.
  const favorites = await prisma.userSRTFile.findMany({
    where: { userId },
    select: { srtFileId: true },
  });
  const episodeIds = favorites.map(record => record.srtFileId);

  return NextResponse.json({ episodeIds });
}

// POST endpoint to save favorite episodes for the current user.
export async function POST(request) {
  const { episodeIds } = await request.json();
  const userId = await currentUserID();

  // Delete existing entries for the user.
  await prisma.userSRTFile.deleteMany({
    where: { userId },
  });

  // Add new favorite entries.
  await prisma.userSRTFile.createMany({
    data: episodeIds.map((episodeId) => ({
      userId,
      srtFileId: episodeId,
    })),
  });

  return NextResponse.json({ success: true });
}
