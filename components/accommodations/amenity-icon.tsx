
// components/accommodations/amenity-icon.tsx
import { 
    Wifi, 
    Coffee, 
    Tv, 
    Utensils, 
    ShowerHead, 
    Bath, 
    Dumbbell, 
    Martini, 
    BookOpen, 
    Star,
    LucideIcon
  } from 'lucide-react';
  
  type AmenityIconProps = {
    name: string;
    className?: string;
  };
  
  // Map of amenity names to icons
  const amenityIcons: Record<string, LucideIcon> = {
    'wifi': Wifi,
    'coffee': Coffee,
    'tv': Tv,
    'food': Utensils,
    'shower': ShowerHead,
    'bath': Bath,
    'gym': Dumbbell,
    'bar': Martini,
    'library': BookOpen,
    'default': Star,
  };
  
  export default function AmenityIcon({ name, className = "h-5 w-5" }: AmenityIconProps) {
    // Try to match the amenity name with an icon
    const lowerName = name.toLowerCase();
    let IconComponent = amenityIcons.default;
    
    // Look for partial matches in the amenity name
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (lowerName.includes(key)) {
        IconComponent = icon;
        break;
      }
    }
    
    return <IconComponent className={className} />;
  }