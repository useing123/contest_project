// components/dashboard/bookings-list.tsx
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Calendar, Users, Building, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

type BookingsListProps = {
  bookings: any[]; // Should be properly typed in a real application
};

export default function BookingsList({ bookings }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
        <p className="text-gray-400 mb-6">You don't have any bookings in this category.</p>
        <Button asChild className="bg-space-accent hover:bg-space-highlight">
          <Link href="/trips">
            Browse Trips
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-gray-300">Trip</TableHead>
            <TableHead className="text-gray-300">Dates</TableHead>
            <TableHead className="text-gray-300">Package</TableHead>
            <TableHead className="text-gray-300">Accommodations</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Total</TableHead>
            <TableHead className="text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded overflow-hidden mr-3 flex-shrink-0">
                    <Image 
                      src={booking.trip.destination?.imageUrl || '/images/placeholder-destination.jpg'} 
                      alt={booking.trip.destination?.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white">{booking.trip.name}</div>
                    <div className="text-xs text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-space-accent" />
                      {booking.trip.destination?.name}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-gray-300">
                  <Calendar className="h-4 w-4 mr-1 text-space-accent" />
                  <span>{format(new Date(booking.trip.departureDate), 'MMM d, yyyy')}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-gray-300">{booking.tripPackage.name}</div>
                <div className="text-xs text-gray-400">{booking.tripPackage.seatClass.name}</div>
              </TableCell>
              <TableCell>
                {booking.accommodation ? (
                  <div className="flex items-center text-gray-300">
                    <Building className="h-4 w-4 mr-1 text-space-accent" />
                    {booking.accommodation.name}
                  </div>
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`
                  ${booking.status === 'CONFIRMED' ? 'border-space-success text-space-success' : ''}
                  ${booking.status === 'PENDING' ? 'border-space-warning text-space-warning' : ''}
                  ${booking.status === 'CANCELLED' ? 'border-space-error text-space-error' : ''}
                  ${booking.status === 'COMPLETED' ? 'border-gray-500 text-gray-400' : ''}
                `}>
                  {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                ${booking.totalPrice.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm" className="text-space-accent hover:text-white hover:bg-space-accent/20">
                  <Link href={`/dashboard/bookings/${booking.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
