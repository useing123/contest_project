import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destinationId = searchParams.get('destinationId');
  const type = searchParams.get('type');
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
  
  let priceFilter: any = {};
  if (minPrice !== undefined || maxPrice !== undefined) {
    priceFilter.price = {};
    if (minPrice !== undefined) priceFilter.price.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.price.lte = maxPrice;
  }
  
  try {
    const accommodations = await prisma.accommodation.findMany({
      where: {
        ...(destinationId ? { destinationId } : {}),
        ...(type ? { type: type as any } : {}),
        ...priceFilter,
      },
      include: {
        destination: true,
      },
      orderBy: {
        price: 'asc',
      },
    });
    
    return NextResponse.json(accommodations);
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    );
  }
}
