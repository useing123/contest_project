"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Destination = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  distance: number;
  travelTime: number;
  type: string;
};

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations?featured=true');
        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        // Set some sample data in case the API fails
        setDestinations([
          {
            id: '1',
            name: 'International Space Station Alpha',
            description: 'The upgraded successor to the original ISS, featuring expanded modules for both research and tourism.',
            imageUrl: '/images/destinations/iss-alpha.jpg',
            distance: 1,
            travelTime: 2,
            type: 'SPACE_STATION'
          },
          {
            id: '2',
            name: 'Lunar Gateway Resort',
            description: 'Luxury lunar resort with Earth views, featuring the first gravity-controlled environment and authentic lunar surface experiences.',
            imageUrl: '/images/destinations/lunar-gateway.jpg',
            distance: 1,
            travelTime: 24,
            type: 'LUNAR_BASE'
          },
          {
            id: '3',
            name: 'Orbit One',
            description: 'The first commercial space hotel with rotating rings providing artificial gravity and luxury accommodations.',
            imageUrl: '/images/destinations/orbit-one.jpg',
            distance: 1,
            travelTime: 3,
            type: 'ORBITAL_HOTEL'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Destinations</h2>
        <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-16">
          Discover our most popular space destinations that offer unforgettable experiences
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-space-dark/50 rounded-lg overflow-hidden animate-pulse h-[450px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Link 
                href={`/destinations/${destination.id}`} 
                key={destination.id}
                className="bg-space-dark rounded-lg overflow-hidden group hover:shadow-lg hover:shadow-space-accent/20 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={destination.imageUrl || '/images/placeholder-destination.jpg'} 
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-20"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-space-accent transition-colors">{destination.name}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{destination.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-1 text-space-accent" />
                      <span>{destination.distance} light min from Earth</span>
                    </div>
                    <div className="flex items-center text-gray-300">
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
        )}
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
            <Link href="/destinations">
              View All Destinations
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}