import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get('featured') === 'true';
  const type = searchParams.get('type');
  
  try {
    const destinations = await prisma.destination.findMany({
      ...(type ? { where: { type: type as any } } : {}),
      ...(featured ? { take: 3 } : {}),
      orderBy: { name: 'asc' },
    });
    
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}
