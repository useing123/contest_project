// components/trips/trip-card.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Rocket, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TripCardProps = {
  trip: any; // Should be properly typed in a real application
};

export default function TripCard({ trip }: TripCardProps) {
  // Find the cheapest package
  const cheapestPackage = trip.tripPackages.length > 0
    ? trip.tripPackages.reduce((min: any, p: any) => p.price < min.price ? p : min, trip.tripPackages[0])
    : null;
  
  // Calculate trip duration in days
  const startDate = new Date(trip.departureDate);
  const endDate = new Date(trip.returnDate);
  const durationDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate days until departure
  const today = new Date();
  const daysUntilDeparture = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-space-accent/30 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Trip Image - Only visible on larger screens */}
        <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
          <Image 
            src={trip.destination?.imageUrl || '/images/placeholder-trip.jpg'} 
            alt={trip.name}
            fill
            className="object-cover"
          />
          {daysUntilDeparture <= 14 && (
            <div className="absolute top-4 left-4 bg-space-warning/90 text-white text-xs px-3 py-1 rounded-full">
              {daysUntilDeparture <= 3 ? 'Leaving Soon!' : 'Limited Availability'}
            </div>
          )}
        </div>
        
        {/* Trip Details */}
        <div className="p-6 flex-1">
          <div className="flex items-center text-gray-400 text-sm mb-2">
            <Calendar className="h-4 w-4 mr-1 text-space-accent" />
            <span>{format(new Date(trip.departureDate), 'MMMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4 mr-1 text-space-accent" />
            <span>{durationDays} days</span>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">{trip.name}</h3>
          
          <div className="flex items-center text-gray-400 text-sm mb-4">
            <MapPin className="h-4 w-4 mr-1 text-space-accent" />
            <span>{trip.destination?.name}</span>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-2">{trip.description}</p>
          
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <div className="flex items-center text-gray-400 text-sm mb-1">
                <Rocket className="h-4 w-4 mr-1 text-space-accent" />
                <span>{trip.availableSeats} seats available</span>
              </div>
              {cheapestPackage && (
                <div className="text-white font-semibold">
                  From ${cheapestPackage.price.toLocaleString()}
                  <span className="text-gray-400 text-sm font-normal"> per person</span>
                </div>
              )}
            </div>
            
            <Button asChild className="bg-space-accent hover:bg-space-highlight text-white">
              <Link href={`/trips/${trip.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
