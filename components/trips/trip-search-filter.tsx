
// components/trips/trip-search-filter.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Users, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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

type TripSearchFilterProps = {
  initialValues?: {
    destination?: string;
    date?: Date;
    passengers?: string;
  };
};

export default function TripSearchFilter({ initialValues }: TripSearchFilterProps) {
  const router = useRouter();
  
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(initialValues?.date);
  const [passengers, setPassengers] = useState(initialValues?.passengers || '');
  
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (departureDate) params.set('date', format(departureDate, 'yyyy-MM-dd'));
    if (passengers) params.set('passengers', passengers);
    
    router.push(`/trips?${params.toString()}`);
  };
  
  const resetFilters = () => {
    setDestination('');
    setDepartureDate(undefined);
    setPassengers('');
    router.push('/trips');
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Search Trips</h3>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white p-0 h-auto"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Destination</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search destinations" 
              className="pl-10 bg-transparent border-white/30 text-white" 
            />
          </div>
        </div>
        
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
                {departureDate ? format(departureDate, "PPP") : <span>Pick a date</span>}
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
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5+ Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={applyFilters} className="w-full bg-space-accent hover:bg-space-highlight">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10">
        <h4 className="text-white font-medium mb-3">Popular Destinations</h4>
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white w-full justify-start"
            onClick={() => {
              setDestination('International Space Station Alpha');
              applyFilters();
            }}
          >
            International Space Station Alpha
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white w-full justify-start"
            onClick={() => {
              setDestination('Lunar Gateway Resort');
              applyFilters();
            }}
          >
            Lunar Gateway Resort
          </Button>
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white w-full justify-start"
            onClick={() => {
              setDestination('Orbit One');
              applyFilters();
            }}
          >
            Orbit One
          </Button>
        </div>
      </div>
    </div>
  );
}
