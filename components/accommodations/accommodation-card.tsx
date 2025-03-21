
// components/accommodations/accommodation-card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AccommodationCardProps = {
  accommodation: any; // Should be properly typed in a real application
};

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  // Format the accommodation type for display
  const formattedType = accommodation.type.split('_').map((word: string) => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-space-accent/30 transition-all duration-300">
      <div className="relative h-48">
        <Image 
          src={accommodation.imageUrl || '/images/placeholder-accommodation.jpg'} 
          alt={accommodation.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-space-dark to-transparent h-24"></div>
        <div className="absolute top-4 right-4 bg-space-accent/90 text-white text-xs px-3 py-1 rounded-full">
          {formattedType}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{accommodation.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-space-warning fill-current" />
            <span className="ml-1 text-white">{accommodation.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 text-space-accent" />
          <span>{accommodation.destination?.name}</span>
        </div>
        
        <p className="text-gray-300 mb-4 line-clamp-2">{accommodation.description}</p>
        
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <Users className="h-4 w-4 mr-1 text-space-accent" />
          <span>Max Occupancy: {accommodation.maxOccupancy}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">
            ${accommodation.price.toLocaleString()}
            <span className="text-gray-400 text-sm font-normal"> per night</span>
          </div>
          
          <Button asChild className="bg-transparent hover:bg-space-accent text-white border border-space-accent/50">
            <Link href={`/accommodations/${accommodation.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
