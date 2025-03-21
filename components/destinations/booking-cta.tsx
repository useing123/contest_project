
  // components/destinations/booking-cta.tsx
  "use client";
  
  import { useState } from 'react';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import { Calendar as CalendarIcon, Users, Rocket } from 'lucide-react';
  import { format } from 'date-fns';
  import { cn } from '@/lib/utils';
  import { Button } from '@/components/ui/button';
  import { Calendar } from '@/components/ui/calendar';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  
  type BookingCtaProps = {
    destination: any; // Should be typed properly in a real application
  };
  
  export default function BookingCta({ destination }: BookingCtaProps) {
    const router = useRouter();
    const [departureDate, setDepartureDate] = useState<Date>();
    const [passengers, setPassengers] = useState<string>("1");
    
    // Find the next available trip
    const upcomingTrips = destination.trips.filter((trip: any) => 
      new Date(trip.departureDate) > new Date()
    ).sort((a: any, b: any) => 
      new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
    );
    
    const nextTrip = upcomingTrips.length > 0 ? upcomingTrips[0] : null;
    
    // Find cheapest package
    const allPackages = destination.trips.flatMap((trip: any) => trip.tripPackages);
    const cheapestPackage = allPackages.length > 0
      ? allPackages.reduce((min: any, p: any) => p.price < min.price ? p : min, allPackages[0])
      : null;
    
    const handleSearch = () => {
      const searchParams = new URLSearchParams();
      searchParams.set('destination', destination.id);
      if (departureDate) searchParams.set('date', format(departureDate, 'yyyy-MM-dd'));
      if (passengers) searchParams.set('passengers', passengers);
      
      router.push(`/trips?${searchParams.toString()}`);
    };
  
    return (
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 sticky top-24">
        <h3 className="text-xl font-semibold text-white mb-4">Book Your Journey</h3>
        
        {nextTrip ? (
          <div className="mb-6 p-4 bg-space-accent/10 rounded-lg border border-space-accent/30">
            <div className="flex items-center mb-2">
              <Rocket className="h-4 w-4 text-space-accent mr-2" />
              <p className="text-white font-medium">Next Available Trip</p>
            </div>
            <p className="text-gray-300">
              {format(new Date(nextTrip.departureDate), 'MMMM d, yyyy')}
            </p>
            <Link href={`/trips/${nextTrip.id}`} className="text-space-accent hover:underline text-sm mt-1 block">
              View details
            </Link>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <p className="text-gray-300 text-sm">No upcoming trips scheduled for this destination yet.</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Departure Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    "bg-transparent border-white/30 text-white",
                    !departureDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "MMMM d, yyyy") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Passengers</label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="bg-transparent border-white/30 text-white">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Number of passengers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Passenger</SelectItem>
                <SelectItem value="2">2 Passengers</SelectItem>
                <SelectItem value="3">3 Passengers</SelectItem>
                <SelectItem value="4">4 Passengers</SelectItem>
                <SelectItem value="5">5+ Passengers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleSearch} className="w-full mt-6 bg-space-accent hover:bg-space-highlight">
          Search Available Trips
        </Button>
        
        {cheapestPackage && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">Starting from</p>
            <p className="text-2xl font-semibold text-white">${cheapestPackage.price.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">per person</p>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <h4 className="text-white font-medium mb-2">Need assistance?</h4>
          <p className="text-gray-400 text-sm mb-4">Our space travel specialists are ready to help you plan your journey.</p>
          <Button asChild variant="outline" className="w-full border-space-accent text-space-accent hover:bg-space-accent hover:text-white">
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    );
  }