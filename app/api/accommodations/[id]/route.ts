import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id },
      include: {
        destination: true,
      },
    });

    if (!accommodation) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(accommodation);
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accommodation' },
      { status: 500 }
    );
  }
}