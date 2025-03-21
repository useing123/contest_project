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
