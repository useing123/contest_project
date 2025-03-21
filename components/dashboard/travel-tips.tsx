
// components/dashboard/travel-tips.tsx
import { Star, AlertTriangle, Activity, Droplet, Zap, Brain } from 'lucide-react';

type TravelTipsProps = {
  destinationType?: string;
};

export default function TravelTips({ destinationType }: TravelTipsProps) {
  // Different tips based on destination type
  const tipsByType: Record<string, string[]> = {
    SPACE_STATION: [
      "Practice floating objects control in microgravity to avoid losing items.",
      "Take frequent photos of Earth - the view changes every 90 minutes!",
      "Use handrails for movement and avoid pushing off walls with your feet.",
      "Schedule your sleep during Earth night cycles to maintain your circadian rhythm.",
    ],
    LUNAR_BASE: [
      "Lunar dust is abrasive - keep it out of your living quarters.",
      "Try the 'lunar bounce' - you can jump six times higher than on Earth!",
      "Drink extra water to combat the dehydrating effects of the controlled atmosphere.",
      "Take photos during Earth-rise and Earth-set for stunning contrasts.",
    ],
    ORBITAL_HOTEL: [
      "Request a room in the rotating section for easier sleep with artificial gravity.",
      "Try the zero-G swimming pool for a unique experience.",
      "Book your Earth-viewing time slots early - they're popular!",
      "Bring motion sickness medication just in case, even if you don't usually need it.",
    ],
    MARS_COLONY: [
      "Respect the strict water conservation protocols.",
      "Take advantage of the guided rover excursions to explore the Martian landscape.",
      "The temperature variation between day and night is extreme - layer your clothing.",
      "Participate in the colony's hydroponics program to see how food is grown on Mars.",
    ],
    ASTEROID_OUTPOST: [
      "Use the low gravity to your advantage during recreational activities.",
      "Visit the observation deck during asteroid rotation for unique stargazing.",
      "Attend the mining demonstrations to understand resource extraction.",
      "The environment is more confined - plan more digital entertainment options.",
    ],
  };
  
  // General tips for all destinations
  const generalTips = [
    "Stay hydrated - space environments often have low humidity.",
    "Take time to adapt to microgravity or reduced gravity environments.",
    "Document your journey - these are memories of a lifetime!",
    "Follow all safety protocols - they're designed for your protection.",
    "Maintain regular exercise to prevent muscle and bone density loss.",
  ];
  
  // Use destination-specific tips if available, otherwise use general tips
  const tips = destinationType && tipsByType[destinationType] 
    ? tipsByType[destinationType] 
    : generalTips;
  
  // Icons for tips
  const tipIcons = [
    <Star key="star" className="h-5 w-5 text-space-accent" />,
    <Activity key="activity" className="h-5 w-5 text-space-accent" />,
    <Droplet key="droplet" className="h-5 w-5 text-space-accent" />,
    <AlertTriangle key="alert" className="h-5 w-5 text-space-accent" />,
    <Zap key="zap" className="h-5 w-5 text-space-accent" />,
    <Brain key="brain" className="h-5 w-5 text-space-accent" />,
  ];

  return (
    <div>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {tipIcons[index % tipIcons.length]}
            </div>
            <p className="text-gray-300">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
