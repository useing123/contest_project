import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const { id } = params;
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        trip: {
          include: {
            destination: true,
          }
        },
        tripPackage: {
          include: {
            seatClass: true,
          }
        },
        accommodation: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const { id } = params;
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await req.json();
    const { status } = body;
    
    const booking = await prisma.booking.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        trip: true,
      },
    });
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    
    // If canceling, return seats to availability
    if (status === 'CANCELLED' && booking.status !== 'CANCELLED') {
      await prisma.trip.update({
        where: { id: booking.tripId },
        data: {
          availableSeats: {
            increment: booking.passengers,
          },
        },
      });
    }
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}