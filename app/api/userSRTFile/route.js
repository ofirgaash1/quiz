// app/api/userSRTFile/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const { episodeIds } = await request.json();
  const userId = 'user-id'; // Replace with actual user ID from session or context

  // Delete existing entries for the user
  await prisma.userSRTFile.deleteMany({
    where: {
      userId,
    },
  });

  // Add new entries
  await prisma.userSRTFile.createMany({
    data: episodeIds.map((episodeId) => ({
      userId,
      srtFileId: episodeId,
    })),
  });

  return NextResponse.json({ success: true });
}