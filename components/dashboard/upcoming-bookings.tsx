
// components/dashboard/upcoming-bookings.tsx
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Rocket, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type UpcomingBookingsProps = {
  bookings: any[]; // Should be properly typed in a real application
};

export default function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  if (bookings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div 
          key={booking.id}
          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-space-accent/30 transition-colors"
        >
          <div className="flex items-start">
            <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <Image 
                src={booking.trip.destination?.imageUrl || '/images/placeholder-destination.jpg'} 
                alt={booking.trip.destination?.name} 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-white">{booking.trip.name}</h3>
                <Badge variant="outline" className={`
                  ${booking.status === 'CONFIRMED' ? 'border-space-success text-space-success' : ''}
                  ${booking.status === 'PENDING' ? 'border-space-warning text-space-warning' : ''}
                  ${booking.status === 'CANCELLED' ? 'border-space-error text-space-error' : ''}
                `}>
                  {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                </Badge>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <MapPin className="h-3 w-3 mr-1 text-space-accent" />
                <span>{booking.trip.destination?.name}</span>
                <span className="mx-2">•</span>
                <Calendar className="h-3 w-3 mr-1 text-space-accent" />
                <span>{format(new Date(booking.trip.departureDate), 'MMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-400">Package: </span>
                  <span className="text-white">{booking.tripPackage.name}</span>
                </div>
                
                <Button asChild variant="ghost" size="sm" className="text-space-accent hover:text-space-accent/80 hover:bg-transparent p-0 h-auto">
                  <Link href={`/dashboard/bookings/${booking.id}`}>
                    View Details <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// components/dashboard/launch-countdown.tsx
"use client";

import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type LaunchCountdownProps = {
  trip: any; // Should be properly typed in a real application
};

export default function LaunchCountdown({ trip }: LaunchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  useEffect(() => {
    // Calculate time left
    const calculateTimeLeft = () => {
      const departureDate = new Date(trip.departureDate);
      const now = new Date();
      const difference = departureDate.getTime() - now.getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [trip.departureDate]);

  return (
    <Card className="bg-gradient-to-r from-space-accent/20 to-space-dark border-space-accent/30">
      <CardContent className="p-6">
        <div className="flex items-center">
          <Rocket className="h-8 w-8 text-space-accent mr-4 animate-pulse" />
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Countdown to Launch: {trip.name}</h2>
            <p className="text-gray-300">Your next space adventure is approaching!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-gray-400 text-sm">Days</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-gray-400 text-sm">Hours</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-gray-400 text-sm">Minutes</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-gray-400 text-sm">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
