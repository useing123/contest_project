import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  Rocket, 
  Building, 
  Tag,
  FileText,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/db';
import BookingStatusChanger from '@/components/dashboard/booking-status-changer';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { trip: true },
  });

  if (!booking) {
    return {
      title: 'Booking Not Found',
    };
  }

  return {
    title: `Booking: ${booking.trip.name} | Space Travel Dubai`,
    description: `Details for your space travel booking to ${booking.trip.name}.`,
  };
}

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }
  
  const booking = await prisma.booking.findUnique({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      trip: {
        include: {
          destination: true,
        }
      },
      tripPackage: {
        include: {
          seatClass: true,
        }
      },
      accommodation: true,
    },
  });
  
  if (!booking) {
    notFound();
  }
  
  // Calculate if the trip is upcoming or past
  const isUpcoming = new Date(booking.trip.departureDate) > new Date();
  
  // Calculate days until departure or days since return
  const now = new Date();
  const departureDate = new Date(booking.trip.departureDate);
  const returnDate = new Date(booking.trip.returnDate);
  
  let daysMessage = '';
  if (isUpcoming) {
    const daysUntil = Math.ceil((departureDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    daysMessage = `${daysUntil} days until departure`;
  } else if (now > returnDate) {
    const daysSince = Math.ceil((now.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24));
    daysMessage = `${daysSince} days since return`;
  } else {
    daysMessage = 'Trip in progress';
  }
  
  // Calculate trip duration
  const tripDuration = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get status icon and color
  const getStatusDetails = () => {
    switch (booking.status) {
      case 'PENDING':
        return { 
          icon: <AlertTriangle className="h-6 w-6 text-space-warning" />,
          color: 'border-space-warning text-space-warning',
          message: 'Your booking is pending confirmation'
        };
      case 'CONFIRMED':
        return { 
          icon: <CheckCircle className="h-6 w-6 text-space-success" />,
          color: 'border-space-success text-space-success',
          message: 'Your booking is confirmed'
        };
      case 'CANCELLED':
        return { 
          icon: <XCircle className="h-6 w-6 text-space-error" />,
          color: 'border-space-error text-space-error',
          message: 'This booking has been cancelled'
        };
      case 'COMPLETED':
        return { 
          icon: <CheckCircle className="h-6 w-6 text-gray-400" />,
          color: 'border-gray-500 text-gray-400',
          message: 'This trip has been completed'
        };
      default:
        return { 
          icon: <AlertTriangle className="h-6 w-6 text-gray-400" />,
          color: 'border-gray-500 text-gray-400',
          message: 'Status unknown'
        };
    }
  };
  
  const statusDetails = getStatusDetails();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button 
            asChild 
            variant="outline" 
            className="border-white/10 hover:bg-white/5 mr-2"
          >
            <Link href="/dashboard/bookings">
              ← Back to Bookings
            </Link>
          </Button>
        </div>
        
        {isUpcoming && booking.status !== 'CANCELLED' && (
          <BookingStatusChanger booking={booking} />
        )}
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{booking.trip.name}</h1>
            <div className="flex items-center text-gray-400 mt-1">
              <MapPin className="h-4 w-4 mr-1 text-space-accent" />
              {booking.trip.destination?.name}
              <span className="mx-2">•</span>
              <CalendarDays className="h-4 w-4 mr-1 text-space-accent" />
              {format(departureDate, 'MMMM d, yyyy')}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`px-3 py-1 text-sm flex items-center gap-1 ${statusDetails.color}`}>
              {statusDetails.icon}
              {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
            </Badge>
            
            <div className="bg-white/5 px-3 py-1 rounded-full text-sm text-gray-300">
              {daysMessage}
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 p-4 rounded-lg mb-6">
          <div className="text-gray-300 mb-2">{statusDetails.message}</div>
          <div className="text-sm text-gray-400">Booking ID: {booking.id}</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Departure</div>
            <div className="flex items-center text-white">
              <CalendarDays className="h-4 w-4 mr-1 text-space-accent" />
              {format(departureDate, 'MMMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-400 mt-1">Dubai Spaceport</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Return</div>
            <div className="flex items-center text-white">
              <CalendarDays className="h-4 w-4 mr-1 text-space-accent" />
              {format(returnDate, 'MMMM d, yyyy')}
            </div>
            <div className="text-sm text-gray-400 mt-1">Dubai Spaceport</div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Duration</div>
            <div className="flex items-center text-white">
              <Clock className="h-4 w-4 mr-1 text-space-accent" />
              {tripDuration} days
            </div>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Passengers</div>
            <div className="flex items-center text-white">
              <Users className="h-4 w-4 mr-1 text-space-accent" />
              {booking.passengers} {booking.passengers === 1 ? 'person' : 'people'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription className="text-gray-400">Complete information about your space journey</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-3">
                    <Rocket className="h-5 w-5 mr-2 text-space-accent" />
                    Trip Package
                  </h3>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium text-white">{booking.tripPackage.name}</h4>
                      <Badge variant="outline" className="border-space-accent text-space-accent">
                        {booking.tripPackage.seatClass.name}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{booking.tripPackage.description}</p>
                    
                    <h5 className="text-sm text-white mb-2">Package Features:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-4">
                      {booking.tripPackage.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="h-3 w-3 mr-2 text-space-accent flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <h5 className="text-sm text-white mb-2">Seat Class Amenities:</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {booking.tripPackage.seatClass.amenities.map((amenity: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="h-3 w-3 mr-2 text-space-accent flex-shrink-0" />
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {booking.accommodation && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-3">
                      <Building className="h-5 w-5 mr-2 text-space-accent" />
                      Accommodation
                    </h3>
                    
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="relative h-20 w-20 rounded overflow-hidden mr-4 flex-shrink-0">
                          <Image 
                            src={booking.accommodation.imageUrl || '/images/placeholder-accommodation.jpg'} 
                            alt={booking.accommodation.name} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">{booking.accommodation.name}</h4>
                            <Badge variant="outline" className="border-space-accent text-space-accent">
                              {booking.accommodation.type.split('_').map((word: string) => 
                                word.charAt(0) + word.slice(1).toLowerCase()
                              ).join(' ')}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-300 mb-3">{booking.accommodation.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Tag className="h-3 w-3 mr-1 text-space-accent" />
                              ${booking.accommodation.price.toLocaleString()} per night
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Users className="h-3 w-3 mr-1 text-space-accent" />
                              Max Occupancy: {booking.accommodation.maxOccupancy}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {booking.specialRequests && (
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-3">
                      <FileText className="h-5 w-5 mr-2 text-space-accent" />
                      Special Requests
                    </h3>
                    
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-300">{booking.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Package Cost</span>
                  <span className="text-white">
                    ${booking.tripPackage.price.toLocaleString()} x {booking.passengers}
                  </span>
                </div>
                
                {booking.accommodation && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Accommodation</span>
                    <span className="text-white">
                      ${booking.accommodation.price.toLocaleString()} x {tripDuration} nights x {booking.passengers}
                    </span>
                  </div>
                )}
                
                <Separator className="my-2 bg-white/10" />
                
                <div className="flex justify-between font-medium">
                  <span>Total Paid</span>
                  <span className="text-space-accent">${booking.totalPrice.toLocaleString()}</span>
                </div>
                
                <div className="bg-white/5 p-3 rounded text-sm text-gray-300 mt-4 flex items-start">
                  <CreditCard className="h-4 w-4 mr-2 text-space-accent flex-shrink-0 mt-1" />
                  Payment completed on {format(new Date(booking.createdAt), 'MMMM d, yyyy')}
                </div>
              </div>
              
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full border-white/20 hover:bg-white/5">
                  <Link href={`/dashboard/bookings/${booking.id}/invoice`}>
                    Download Invoice
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Need Assistance?</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-300 mb-4">
                  If you have any questions about your booking or need to make changes, our space travel specialists are here to help.
                </p>
                
                <Button asChild className="w-full bg-space-accent hover:bg-space-highlight">
                  <Link href="/dashboard/support">
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
