// components/destinations/destination-filters.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DestinationFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [type, setType] = useState(searchParams.get('type') || '');
  
  // Update URL when filters change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    
    router.push(`/destinations?${params.toString()}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setType('');
    router.push('/destinations');
  };
  
  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [type]);

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Filters</h2>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white"
          onClick={resetFilters}
        >
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Destination Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-transparent border-white/30 text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="SPACE_STATION">Space Station</SelectItem>
              <SelectItem value="LUNAR_BASE">Lunar Base</SelectItem>
              <SelectItem value="ORBITAL_HOTEL">Orbital Hotel</SelectItem>
              <SelectItem value="MARS_COLONY">Mars Colony</SelectItem>
              <SelectItem value="ASTEROID_OUTPOST">Asteroid Outpost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Additional filters can be added here */}
      </div>
    </div>
  );
}
