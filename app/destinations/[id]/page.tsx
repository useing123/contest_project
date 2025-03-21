// app/destinations/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, Calendar, Users, Rocket, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prisma } from '@/lib/db';
import DestinationFeatures from '@/components/destinations/destination-features';
import TripCard from '@/components/trips/trip-card';
import AccommodationCard from '@/components/accommodations/accommodation-card';
import BookingCta from '@/components/destinations/booking-cta';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
  });

  if (!destination) {
    return {
      title: 'Destination Not Found',
    };
  }

  return {
    title: `${destination.name} | Space Travel Dubai`,
    description: destination.description,
  };
}

export default async function DestinationPage({ params }: { params: { id: string } }) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
    include: {
      trips: {
        include: {
          tripPackages: {
            include: {
              seatClass: true,
            },
          },
        },
      },
      accommodations: true,
    },
  });

  if (!destination) {
    notFound();
  }

  // Find the cheapest package across all trips
  const allPackages = destination.trips.flatMap(trip => trip.tripPackages);
  const cheapestPackage = allPackages.length > 0
    ? allPackages.reduce((min, p) => p.price < min.price ? p : min, allPackages[0])
    : null;

  // Format the destination type for display
  const formattedType = destination.type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');

  return (
    <div className="min-h-screen bg-space-dark pb-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/1920/1080" 
            alt={destination.name} 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-black/50 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 pb-12">
          <div className="inline-flex items-center bg-space-accent/90 text-white text-sm px-4 py-1 rounded-full mb-4">
            {formattedType}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {destination.name}
          </h1>
          <div className="flex flex-wrap gap-6 text-white">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-space-accent" />
              <span>{destination.distance} light min from Earth</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-space-accent" />
              <span>{destination.travelTime}h travel time</span>
            </div>
            {cheapestPackage && (
              <div className="flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-space-accent" />
                <span>From ${cheapestPackage.price.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Destination Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">About {destination.name}</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{destination.description}</p>
              
              <Separator className="my-8 bg-white/10" />
              
              <DestinationFeatures destinationType={destination.type} />
            </div>
            
            <Tabs defaultValue="trips" className="mt-8">
              <TabsList className="w-full bg-white/5 border-b border-white/10 rounded-t-lg overflow-hidden">
                <TabsTrigger value="trips" className="flex-1 data-[state=active]:bg-space-accent text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Available Trips
                </TabsTrigger>
                <TabsTrigger value="accommodations" className="flex-1 data-[state=active]:bg-space-accent text-white">
                  <Star className="h-4 w-4 mr-2" />
                  Accommodations
                </TabsTrigger>
                <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-space-accent text-white">
                  <Info className="h-4 w-4 mr-2" />
                  Travel Information
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trips" className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Upcoming Trips to {destination.name}</h3>
                {destination.trips.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {destination.trips.map((trip) => (
                      <TripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 mb-4">No upcoming trips available for this destination.</p>
                    <Button asChild variant="outline" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
                      <Link href="/trips">
                        Browse Other Trips
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="accommodations" className="pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">Accommodations at {destination.name}</h3>
                {destination.accommodations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {destination.accommodations.map((accommodation) => (
                      <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    <p className="text-gray-400 mb-4">No accommodations available for this destination.</p>
                    <Button asChild variant="outline" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
                      <Link href="/accommodations">
                        Browse Other Accommodations
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="info" className="pt-6 text-gray-300">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Travel Information</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Journey Duration</h4>
                      <p>Traveling to {destination.name} takes approximately {destination.travelTime} hours from our launch facility in Dubai.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Health Requirements</h4>
                      <p>All travelers must pass a comprehensive space fitness assessment before departure. Our medical team will conduct this assessment prior to your journey.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Safety Measures</h4>
                      <p>We maintain the highest safety standards with state-of-the-art spacecraft and experienced crew. All travelers receive safety training before departure.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">What to Pack</h4>
                      <p>We provide all necessary space equipment and attire. You may bring personal items within the specified weight allowance for your package type.</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">Communication</h4>
                      <p>High-speed quantum communication systems allow video calls and data transmission with Earth throughout your journey and stay.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Booking CTA */}
          <div className="lg:col-span-1">
            <BookingCta destination={destination} />
          </div>
        </div>
      </section>
    </div>
  );
}