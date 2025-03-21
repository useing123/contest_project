
// components/trips/trip-booking-form.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Check, Users, Building, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TripPackageCard from '@/components/trips/trip-package-card';

type TripBookingFormProps = {
  trip: any; // Should be properly typed in a real application
  accommodations: any[]; // Should be properly typed in a real application
};

export default function TripBookingForm({ trip, accommodations }: TripBookingFormProps) {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const { toast } = useToast();
  
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('1');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find selected package
  const selectedPackage = trip.tripPackages.find((p: any) => p.id === selectedPackageId);
  
  // Find selected accommodation
  const selectedAccommodation = accommodations.find(a => a.id === selectedAccommodationId);
  
  // Calculate trip duration in days
  const departureDate = new Date(trip.departureDate);
  const returnDate = new Date(trip.returnDate);
  const durationDays = Math.round((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate total price
  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    let total = selectedPackage.price * parseInt(passengers);
    
    if (selectedAccommodation) {
      total += selectedAccommodation.price * durationDays * parseInt(passengers);
    }
    
    return total;
  };
  
  const handleBooking = async () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book this trip.",
        variant: "destructive",
      });
      router.push('/sign-in');
      return;
    }
    
    if (!selectedPackageId) {
      toast({
        title: "Package Required",
        description: "Please select a trip package to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: trip.id,
          tripPackageId: selectedPackageId,
          accommodationId: selectedAccommodationId || null,
          passengers: parseInt(passengers),
          specialRequests: specialRequests || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      
      const booking = await response.json();
      
      toast({
        title: "Booking Successful!",
        description: "Your space journey is now reserved. Check your dashboard for details.",
        variant: "default",
      });
      
      router.push(`/dashboard/bookings/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 sticky top-24">
      <h3 className="text-xl font-semibold text-white mb-4">Book This Trip</h3>
      
      <div className="mb-6">
        <div className="flex items-center text-gray-300 mb-2">
          <Check className="h-4 w-4 mr-2 text-space-accent" />
          <span>Instant confirmation</span>
        </div>
        <div className="flex items-center text-gray-300 mb-2">
          <Check className="h-4 w-4 mr-2 text-space-accent" />
          <span>Free cancellation up to 30 days before</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Number of Passengers</label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="bg-transparent border-white/30 text-white">
              <Users className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select passengers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Passenger</SelectItem>
              <SelectItem value="2">2 Passengers</SelectItem>
              <SelectItem value="3">3 Passengers</SelectItem>
              <SelectItem value="4">4 Passengers</SelectItem>
              <SelectItem value="5">5 Passengers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {accommodations.length > 0 && (
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Accommodation (Optional)</label>
            <Select value={selectedAccommodationId} onValueChange={setSelectedAccommodationId}>
              <SelectTrigger className="bg-transparent border-white/30 text-white">
                <Building className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select accommodation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No accommodation needed</SelectItem>
                {accommodations.map((accommodation) => (
                  <SelectItem key={accommodation.id} value={accommodation.id}>
                    {accommodation.name} - ${accommodation.price.toLocaleString()}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAccommodation && (
              <div className="mt-2 text-sm text-gray-400">
                {selectedAccommodation.type.split('_').map((word: string) => 
                  word.charAt(0) + word.slice(1).toLowerCase()
                ).join(' ')} • 
                Max Occupancy: {selectedAccommodation.maxOccupancy}
              </div>
            )}
          </div>
        )}
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Special Requests (Optional)</label>
          <Textarea 
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any dietary requirements or special needs?"
            className="bg-transparent border-white/30 text-white h-24 resize-none"
          />
        </div>
      </div>
      
      <Separator className="my-6 bg-white/10" />
      
      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-3 block">Select Your Package</label>
        <div className="space-y-4">
          {trip.tripPackages.map((tripPackage: any) => (
            <div 
              key={tripPackage.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                selectedPackageId === tripPackage.id
                ? 'bg-space-accent/20 border-space-accent' 
                : 'bg-white/5 border-white/10 hover:border-space-accent/50'
              }`}
              onClick={() => setSelectedPackageId(tripPackage.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{tripPackage.name}</h4>
                  <p className="text-gray-400 text-sm">{tripPackage.seatClass.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${tripPackage.price.toLocaleString()}</div>
                  <p className="text-gray-400 text-xs">per person</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-space-accent/10 rounded-lg">
        <h4 className="text-white font-medium mb-2">Trip Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Departure</span>
            <span className="text-white">{format(departureDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Return</span>
            <span className="text-white">{format(returnDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Duration</span>
            <span className="text-white">{durationDays} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Passengers</span>
            <span className="text-white">{passengers}</span>
          </div>
          {selectedPackage && (
            <div className="flex justify-between">
              <span className="text-gray-300">Package</span>
              <span className="text-white">{selectedPackage.name}</span>
            </div>
          )}
          {selectedAccommodation && (
            <div className="flex justify-between">
              <span className="text-gray-300">Accommodation</span>
              <span className="text-white">{selectedAccommodation.name}</span>
            </div>
          )}
        </div>
      </div>
      
      {selectedPackage && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Package Cost</span>
            <span className="text-white">
              ${selectedPackage.price.toLocaleString()} x {passengers} = ${(selectedPackage.price * parseInt(passengers)).toLocaleString()}
            </span>
          </div>
          
          {selectedAccommodation && (
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Accommodation</span>
              <span className="text-white">
                ${selectedAccommodation.price.toLocaleString()} x {durationDays} nights x {passengers} = ${(selectedAccommodation.price * durationDays * parseInt(passengers)).toLocaleString()}
              </span>
            </div>
          )}
          
          <Separator className="my-3 bg-white/10" />
          
          <div className="flex justify-between font-semibold">
            <span className="text-white">Total</span>
            <span className="text-space-accent">${calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleBooking}
        disabled={!selectedPackageId || isSubmitting}
        className="w-full bg-space-accent hover:bg-space-highlight text-white"
      >
        {isSubmitting ? 'Processing...' : 'Book Now'}
      </Button>
      
      <p className="text-gray-400 text-xs text-center mt-4">
        By booking, you agree to our Terms of Service and Cancellation Policy.
      </p>
    </div>
  );
}