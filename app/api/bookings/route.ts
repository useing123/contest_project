import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs';

export async function GET(req: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const body = await req.json();
    const { tripId, tripPackageId, accommodationId, passengers, specialRequests } = body;
    
    // Fetch trip and package to calculate total price
    const tripPackage = await prisma.tripPackage.findUnique({
      where: { id: tripPackageId },
    });
    
    if (!tripPackage) {
      return NextResponse.json(
        { error: 'Trip package not found' },
        { status: 404 }
      );
    }
    
    let accommodationPrice = 0;
    let accommodationDays = 0;
    
    if (accommodationId) {
      const accommodation = await prisma.accommodation.findUnique({
        where: { id: accommodationId },
      });
      
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });
      
      if (accommodation && trip) {
        // Calculate number of days for accommodation
        const departureDate = new Date(trip.departureDate);
        const returnDate = new Date(trip.returnDate);
        const days = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
        
        accommodationDays = days;
        accommodationPrice = accommodation.price * days;
      }
    }
    
    // Calculate total price
    const tripPrice = tripPackage.price * passengers;
    const totalPrice = tripPrice + accommodationPrice;
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        tripId,
        tripPackageId,
        accommodationId,
        status: 'PENDING',
        totalPrice,
        passengers,
        specialRequests,
      },
    });
    
    // Update available seats
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        availableSeats: {
          decrement: passengers,
        },
      },
    });
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
