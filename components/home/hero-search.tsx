// components/home/hero-search.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Search, Users } from 'lucide-react';
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

export default function HeroSearch() {
  const router = useRouter();
  const [destination, setDestination] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [passengers, setPassengers] = useState<string>("1");

  const handleSearch = () => {
    // Construct query params for search
    const searchParams = new URLSearchParams();
    
    if (destination) searchParams.set('destination', destination);
    if (departureDate) searchParams.set('date', format(departureDate, 'yyyy-MM-dd'));
    if (passengers) searchParams.set('passengers', passengers);
    
    // Navigate to trips page with search params
    router.push(`/trips?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger className="bg-transparent border-white/30 h-12 w-full text-white">
            <SelectValue placeholder="Select Destination" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iss">International Space Station Alpha</SelectItem>
            <SelectItem value="lunar">Lunar Gateway Resort</SelectItem>
            <SelectItem value="orbit">Orbit One</SelectItem>
            <SelectItem value="mars">Mars Base Olympus</SelectItem>
            <SelectItem value="ceres">Ceres Mining Outpost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:w-64">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "bg-transparent border-white/30 h-12 w-full justify-start text-left font-normal text-white",
                !departureDate && "text-gray-300"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? format(departureDate, "PPP") : <span>Departure Date</span>}
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

      <div className="md:w-48">
        <Select value={passengers} onValueChange={setPassengers}>
          <SelectTrigger className="bg-transparent border-white/30 h-12 w-full text-white">
            <Users className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Passengers" />
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

      <Button 
        className="h-12 bg-space-accent hover:bg-space-highlight text-white"
        onClick={handleSearch}
      >
        <Search className="mr-2 h-4 w-4" />
        Find Trips
      </Button>
    </div>
  );
}