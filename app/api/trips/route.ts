import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination');
  const dateStr = searchParams.get('date');
  const passengers = searchParams.get('passengers');
  
  let dateFilter: any = {};
  if (dateStr) {
    const date = new Date(dateStr);
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    dateFilter = {
      departureDate: {
        gte: startOfDay,
      },
    };
  }
  
  try {
    const trips = await prisma.trip.findMany({
      where: {
        ...(destination ? { destination: { name: { contains: destination, mode: 'insensitive' } } } : {}),
        ...dateFilter,
        ...(passengers ? { availableSeats: { gte: parseInt(passengers) } } : {}),
      },
      include: {
        destination: true,
        tripPackages: {
          include: {
            seatClass: true,
          },
        },
      },
      orderBy: {
        departureDate: 'asc',
      },
    });
    
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}