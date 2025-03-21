// app/trips/[id]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, ArrowRight, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prisma } from '@/lib/db';
import TripBookingForm from '@/components/trips/trip-booking-form';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: { destination: true },
  });

  if (!trip) {
    return {
      title: 'Trip Not Found',
    };
  }

  return {
    title: `${trip.name} | Space Travel Dubai`,
    description: trip.description,
  };
}

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      destination: true,
      tripPackages: {
        include: {
          seatClass: true,
        },
      },
    },
  });

  if (!trip) {
    notFound();
  }

  // Calculate trip duration in days
  const departureDate = new Date(trip.departureDate);
  const returnDate = new Date(trip.returnDate);
  const durationDays = Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Find accommodations for the destination
  const accommodations = await prisma.accommodation.findMany({
    where: {
      destinationId: trip.destinationId,
    },
  });

  return (
    <div className="min-h-screen bg-space-dark pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/1920/1080" 
            alt={trip.name} 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-dark via-black/50 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 pb-12">
          <div className="inline-flex items-center bg-space-accent/90 text-white text-sm px-4 py-1 rounded-full mb-4">
            {format(departureDate, 'MMMM d, yyyy')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {trip.name}
          </h1>
          <div className="flex flex-wrap gap-6 text-white">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-space-accent" />
              <span>{trip.destination?.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-space-accent" />
              <span>{durationDays} days</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-space-accent" />
              <span>{trip.availableSeats} seats available</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="container mx-auto px-4 -mt-12 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">Trip Overview</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">{trip.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Departure</h3>
                  <div className="flex items-center text-gray-300 mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                    <span>{format(departureDate, 'MMMM d, yyyy')}</span>
                  </div>
                  <p className="text-gray-400 text-sm pl-6">Dubai Spaceport</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                  <h3 className="text-lg font-medium text-white mb-2">Return</h3>
                  <div className="flex items-center text-gray-300 mb-1">
                    <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                    <span>{format(returnDate, 'MMMM d, yyyy')}</span>
                  </div>
                  <p className="text-gray-400 text-sm pl-6">Dubai Spaceport</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-3">Trip Schedule</h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-medium">1</div>
                      <div className="w-0.5 bg-space-accent/30 h-full mt-2"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Launch Day</h4>
                      <p className="text-gray-400 mb-2">Early morning departure from Dubai Spaceport.</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Estimated duration: 2 hours to orbit</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-medium">2</div>
                      <div className="w-0.5 bg-space-accent/30 h-full mt-2"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Arrival at {trip.destination?.name}</h4>
                      <p className="text-gray-400 mb-2">Docking and orientation at the destination.</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Full day of orientation and settling in</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-medium">3</div>
                      <div className="w-0.5 bg-space-accent/30 h-full mt-2"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Exploration Days</h4>
                      <p className="text-gray-400 mb-2">Guided tours, activities, and free time based on your package.</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Multiple days of scheduled activities</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-medium">4</div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Return Journey</h4>
                      <p className="text-gray-400 mb-2">Departure from destination and return to Earth.</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Arrival at Dubai Spaceport on {format(returnDate, 'MMMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8 bg-white/10" />
              
              <Tabs defaultValue="packages" className="mt-8">
                <TabsList className="w-full bg-white/5 border-b border-white/10 rounded-t-lg overflow-hidden">
                  <TabsTrigger value="packages" className="flex-1 data-[state=active]:bg-space-accent text-white">
                    Trip Packages
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-space-accent text-white">
                    Trip Details
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex-1 data-[state=active]:bg-space-accent text-white">
                    Travel Information
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="packages" className="pt-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Available Trip Packages</h3>
                  <p className="text-gray-300 mb-6">
                    Select from our various packages to customize your space journey experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trip.tripPackages.map((tripPackage) => (
                      <div key={tripPackage.id} className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10 hover:border-space-accent/30 transition-all duration-300">
                        <h4 className="text-lg font-semibold text-white mb-1">{tripPackage.name}</h4>
                        <p className="text-gray-400 text-sm mb-3">{tripPackage.seatClass.name}</p>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{tripPackage.description}</p>
                        <div className="text-xl font-semibold text-white mb-3">
                          ${tripPackage.price.toLocaleString()}
                          <span className="text-gray-400 text-sm font-normal"> / person</span>
                        </div>
                        <p className="text-gray-400 text-xs mb-2">Key features:</p>
                        <ul className="text-gray-300 text-sm mb-4 space-y-1">
                          {tripPackage.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="h-3 w-3 text-space-accent mr-1 mt-1 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {tripPackage.features.length > 3 && (
                            <li className="text-space-accent text-xs">+ {tripPackage.features.length - 3} more features</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="pt-6 text-gray-300">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Destination Details</h3>
                      <p>{trip.destination?.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">What's Included</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Round-trip space transport from Dubai Spaceport
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Accommodation at the destination (varies by package)
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          All meals and refreshments during the journey and stay
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Guided activities and excursions (varies by package)
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Space gear and equipment rental
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          24/7 support from our space travel specialists
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">What's Not Included</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Personal space insurance (optional, available for purchase)
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Premium communication packages with Earth
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Specialty experiences not included in your package
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Souvenirs and personal items
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="pt-6 text-gray-300">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Health Requirements</h3>
                      <p>All travelers must pass a comprehensive space fitness assessment before departure. This includes:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Cardiovascular evaluation
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Vestibular system assessment
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Psychological readiness screening
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Basic physical fitness test
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Training</h3>
                      <p>All passengers receive pre-flight training, including:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Microgravity adaptation techniques
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Safety procedures and emergency protocols
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Space gear familiarization
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Basic space navigation
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">What to Pack</h3>
                      <p>We provide all necessary space equipment and attire. Personal items should be limited to:</p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Essential medications (must be approved by our medical team)
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Small personal keepsakes (within weight restrictions)
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-space-accent mr-2 mt-1 flex-shrink-0" />
                          Digital devices (specially prepared for space use)
                        </li>
                      </ul>
                      <p className="mt-3 text-sm flex items-start">
                        <Info className="h-4 w-4 text-space-accent mr-2 mt-0.5 flex-shrink-0" />
                        A detailed packing guide will be provided after booking.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <TripBookingForm trip={trip} accommodations={accommodations} />
          </div>
        </div>
      </section>
    </div>
  );
}
