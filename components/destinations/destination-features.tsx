
  // components/destinations/destination-features.tsx
  import { ShieldCheck, Rocket, Star, Sparkles, Users, Atom } from 'lucide-react';
  
  type DestinationFeaturesProps = {
    destinationType: string;
  };
  
  export default function DestinationFeatures({ destinationType }: DestinationFeaturesProps) {
    // Different features based on destination type
    const features = {
      SPACE_STATION: [
        { icon: <ShieldCheck className="h-5 w-5 text-space-accent" />, title: 'Advanced Life Support', description: 'State-of-the-art systems ensuring optimal living conditions' },
        { icon: <Rocket className="h-5 w-5 text-space-accent" />, title: 'Docking Facilities', description: 'Multiple secure docking ports for arrivals and departures' },
        { icon: <Star className="h-5 w-5 text-space-accent" />, title: 'Earth Observation', description: 'Panoramic viewing modules offering spectacular Earth views' },
        { icon: <Atom className="h-5 w-5 text-space-accent" />, title: 'Research Laboratories', description: 'Access to cutting-edge scientific research facilities' },
      ],
      LUNAR_BASE: [
        { icon: <ShieldCheck className="h-5 w-5 text-space-accent" />, title: 'Radiation Shielding', description: 'Advanced protection against solar and cosmic radiation' },
        { icon: <Sparkles className="h-5 w-5 text-space-accent" />, title: 'Gravity Control', description: 'Adjustable gravity environments for comfort and health' },
        { icon: <Users className="h-5 w-5 text-space-accent" />, title: 'Surface Excursions', description: 'Guided expeditions to explore the lunar landscape' },
        { icon: <Star className="h-5 w-5 text-space-accent" />, title: 'Earth View Dome', description: 'Specialized viewing area offering unparalleled Earth vistas' },
      ],
      ORBITAL_HOTEL: [
        { icon: <Star className="h-5 w-5 text-space-accent" />, title: 'Luxury Accommodations', description: 'Premium suites with Earth and space views' },
        { icon: <Sparkles className="h-5 w-5 text-space-accent" />, title: 'Rotating Gravity Ring', description: 'Comfortable Earth-like gravity in residential areas' },
        { icon: <Users className="h-5 w-5 text-space-accent" />, title: 'Recreation Facilities', description: 'Zero-G sports arena, spa, and entertainment center' },
        { icon: <ShieldCheck className="h-5 w-5 text-space-accent" />, title: 'Medical Center', description: 'Full-service medical facility with emergency capabilities' },
      ],
      MARS_COLONY: [
        { icon: <ShieldCheck className="h-5 w-5 text-space-accent" />, title: 'Atmospheric Control', description: 'Pressurized habitats with Earth-like atmosphere' },
        { icon: <Rocket className="h-5 w-5 text-space-accent" />, title: 'Surface Vehicles', description: 'Exploration rovers for Martian terrain adventures' },
        { icon: <Atom className="h-5 w-5 text-space-accent" />, title: 'Research Access', description: 'Participation in ongoing Mars research projects' },
        { icon: <Users className="h-5 w-5 text-space-accent" />, title: 'Pioneer Community', description: 'Engage with the first permanent human settlement on Mars' },
      ],
      ASTEROID_OUTPOST: [
        { icon: <Rocket className="h-5 w-5 text-space-accent" />, title: 'Mining Operations', description: 'Tours of active asteroid mining and processing facilities' },
        { icon: <ShieldCheck className="h-5 w-5 text-space-accent" />, title: 'Micro-Gravity Environment', description: 'Experience the unique conditions of asteroid living' },
        { icon: <Star className="h-5 w-5 text-space-accent" />, title: 'Deep Space Views', description: 'Unobstructed views of distant stars and planets' },
        { icon: <Atom className="h-5 w-5 text-space-accent" />, title: 'Resource Science', description: 'Learn about asteroid composition and resource extraction' },
      ],
    };
  
    // Default to space station if type not found
    const destinationFeatures = features[destinationType as keyof typeof features] || features.SPACE_STATION;
  
    return (
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Key Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinationFeatures.map((feature, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 mt-1">
                {feature.icon}
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-white">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  