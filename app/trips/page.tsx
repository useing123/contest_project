// app/trips/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/db';
import TripCard from '@/components/trips/trip-card';
import TripSearchFilter from '@/components/trips/trip-search-filter';

export const metadata = {
  title: 'Space Trips | Space Travel Dubai',
  description: 'Browse and book our upcoming space travel trips.',
};

type TripsPageProps = {
  searchParams?: {
    destination?: string;
    date?: string;
    passengers?: string;
  };
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const { destination, date, passengers } = searchParams || {};
  
  let dateFilter: any = {};
  if (date) {
    const selectedDate = new Date(date);
    dateFilter = {
      departureDate: {
        gte: selectedDate,
      },
    };
  }
  
  const parsedPassengers = passengers ? parseInt(passengers) : undefined;
  
  const trips = await prisma.trip.findMany({
    where: {
      ...(destination ? { destination: { name: { contains: destination, mode: 'insensitive' } } } : {}),
      ...dateFilter,
      ...(parsedPassengers ? { availableSeats: { gte: parsedPassengers } } : {}),
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

  return (
    <div className="min-h-screen bg-space-dark">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/trips-hero.jpg" 
            alt="Space trips" 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Space Trips
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Discover our upcoming space journeys and book your next adventure beyond Earth.
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Search & Filters */}
          <div className="lg:col-span-1">
            <TripSearchFilter initialValues={{
              destination: destination || '',
              date: date ? new Date(date) : undefined,
              passengers: passengers || '',
            }} />
          </div>
          
          {/* Trips List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">Available Trips</h2>
                <p className="text-gray-400 mt-1">
                  {trips.length} {trips.length === 1 ? 'trip' : 'trips'} found
                </p>
              </div>
              
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1 text-space-accent" />
                <span>Sorted by departure date</span>
              </div>
            </div>
            
            {trips.length > 0 ? (
              <div className="space-y-6">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="text-center p-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <Filter className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No trips found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search filters or check back later for new trips.</p>
                <Button 
                  variant="outline" 
                  className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white"
                  onClick={() => window.location.href = '/trips'}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
