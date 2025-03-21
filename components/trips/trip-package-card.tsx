
// components/trips/trip-package-card.tsx
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type TripPackageCardProps = {
  tripPackage: any;
  onSelect: (packageId: string) => void;
  isSelected: boolean;
};

export default function TripPackageCard({ tripPackage, onSelect, isSelected }: TripPackageCardProps) {
  return (
    <div 
      className={`p-6 rounded-xl border transition-all duration-300 ${
        isSelected 
        ? 'bg-space-accent/20 border-space-accent' 
        : 'bg-white/5 border-white/10 hover:border-space-accent/50'
      }`}
    >
      <h3 className="text-xl font-semibold text-white mb-1">{tripPackage.name}</h3>
      <p className="text-gray-400 mb-4">{tripPackage.seatClass.name}</p>
      
      <div className="text-2xl font-bold text-white mb-4">
        ${tripPackage.price.toLocaleString()}
        <span className="text-gray-400 text-sm font-normal"> per person</span>
      </div>
      
      <p className="text-gray-300 mb-4">{tripPackage.description}</p>
      
      <div className="mb-6">
        <h4 className="text-white font-medium mb-2">Package Features</h4>
        <ul className="space-y-2">
          {tripPackage.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-space-accent mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h4 className="text-white font-medium mb-2">Seat Class Amenities</h4>
        <ul className="space-y-2">
          {tripPackage.seatClass.amenities.map((amenity: string, index: number) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-space-accent mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{amenity}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-sm text-gray-400 mb-4">
        {tripPackage.maxCapacity} seats available in this class
      </div>
      
      <Button 
        onClick={() => onSelect(tripPackage.id)} 
        className={`w-full ${
          isSelected 
          ? 'bg-white text-space-dark hover:bg-gray-200' 
          : 'bg-space-accent hover:bg-space-highlight'
        }`}
      >
        {isSelected ? 'Selected' : 'Select This Package'}
      </Button>
    </div>
  );
}
