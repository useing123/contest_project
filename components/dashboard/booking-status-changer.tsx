
// components/dashboard/booking-status-changer.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type BookingStatusChangerProps = {
  booking: any; // Should be properly typed in a real application
};

export default function BookingStatusChanger({ booking }: BookingStatusChangerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Only allow cancellation if the status is PENDING or CONFIRMED
  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);
  
  const handleCancellation = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
        variant: "default",
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "There was a problem cancelling your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };
  
  if (!canCancel) {
    return null;
  }

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsDialogOpen(true)}
        className="bg-space-error hover:bg-space-error/80"
      >
        Cancel Booking
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-space-dark border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to cancel this booking? This action cannot be undone.
              {booking.trip.departureDate && new Date(booking.trip.departureDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <div className="mt-2 text-space-warning">
                  Note: Cancellations within 30 days of departure may be subject to cancellation fees.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5 hover:text-white">
              Nevermind
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancellation}
              disabled={isLoading}
              className="bg-space-error hover:bg-space-error/80"
            >
              {isLoading ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}