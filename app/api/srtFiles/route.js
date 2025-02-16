// app/api/srtFiles/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const srtFiles = await prisma.sRTFile.findMany({
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