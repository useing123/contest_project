// app/destinations/page.tsx
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import DestinationFilters from '@/components/destinations/destination-filters';
import DestinationSkeleton from '@/components/destinations/destination-skeleton';

export const metadata = {
  title: 'Space Destinations | Space Travel Dubai',
  description: 'Explore our space destinations including space stations, lunar bases, and more.',
};

type DestinationPageProps = {
  searchParams?: {
    type?: string;
  };
};

export default async function DestinationsPage({ searchParams }: DestinationPageProps) {
  const type = searchParams?.type;
  
  const destinations = await prisma.destination.findMany({
    ...(type ? { where: { type: type as any } } : {}),
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="min-h-screen bg-space-dark">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/destinations-hero.jpg" 
            alt="Space destinations" 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Space Destinations
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Explore our range of extraordinary destinations in space, from orbital stations to lunar resorts and beyond.
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <DestinationFilters />
        
        <div className="mt-10">
          <Suspense fallback={<DestinationSkeletonsGrid />}>
            <DestinationsGrid destinations={destinations} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function DestinationsGrid({ destinations }: { destinations: any[] }) {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-white mb-2">No destinations found</h3>
        <p className="text-gray-400">Try adjusting your filters or check back later for new destinations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {destinations.map((destination) => (
        <Link 
          href={`/destinations/${destination.id}`} 
          key={destination.id}
          className="bg-space-dark/50 rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-space-accent/20 transition-all duration-300 border border-space-light/10"
        >
          <div className="relative h-64 overflow-hidden">
            <Image 
              src={destination.imageUrl || '/images/placeholder-destination.jpg'} 
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
            <div className="absolute top-4 right-4 bg-space-accent/90 text-white text-xs px-3 py-1 rounded-full">
              {destination.type.split('_').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-space-accent transition-colors">{destination.name}</h3>
            <p className="text-gray-400 mb-4 line-clamp-3">{destination.description}</p>
            
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-1 text-space-accent" />
                <span>{destination.distance} light min from Earth</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Clock className="h-4 w-4 mr-1 text-space-accent" />
                <span>{destination.travelTime}h travel time</span>
              </div>
            </div>
            
            <Button className="w-full bg-space-dark hover:bg-space-accent transition-colors border border-space-accent/50">
              Explore Destination
            </Button>
          </div>
        </Link>
      ))}
    </div>
  );
}

function DestinationSkeletonsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <DestinationSkeleton key={i} />
      ))}
    </div>
  );
}
