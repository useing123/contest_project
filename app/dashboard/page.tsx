
// app/dashboard/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Rocket, Calendar, CreditCard, MapPin, Clock, User, BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import UpcomingBookings from '@/components/dashboard/upcoming-bookings';
import LaunchCountdown from '@/components/dashboard/launch-countdown';
import TravelTips from '@/components/dashboard/travel-tips';

export default async function DashboardPage() {
  const user = await currentUser();
  
  // Get upcoming bookings
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      userId: user?.id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      trip: {
        departureDate: {
          gte: new Date(),
        },
      },
    },
    include: {
      trip: {
        include: {
          destination: true,
        }
      },
      tripPackage: true,
      accommodation: true,
    },
    orderBy: {
      trip: {
        departureDate: 'asc',
      },
    },
    take: 2,
  });
  
  // Get booking statistics
  const bookingStats = await prisma.booking.groupBy({
    by: ['status'],
    where: {
      userId: user?.id,
    },
    _count: {
      id: true,
    },
  });
  
  const totalBookings = bookingStats.reduce((sum, stat) => sum + stat._count.id, 0);
  const confirmedBookings = bookingStats.find(stat => stat.status === 'CONFIRMED')?._count.id || 0;
  const completedBookings = bookingStats.find(stat => stat.status === 'COMPLETED')?._count.id || 0;
  
  // Get next upcoming trip
  const nextTrip = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="text-gray-400">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      {nextTrip && (
        <div className="mb-8">
          <LaunchCountdown trip={nextTrip.trip} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BookMarked className="h-5 w-5 mr-2 text-space-accent" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <p className="text-sm text-gray-400 mt-1">Across all destinations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-space-accent" />
              Confirmed Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{confirmedBookings}</div>
            <p className="text-sm text-gray-400 mt-1">Ready for launch</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-space-accent" />
              Journeys Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedBookings}</div>
            <p className="text-sm text-gray-400 mt-1">Space adventures experienced</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/5 border-white/10 text-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium">Upcoming Trips</CardTitle>
                <Button asChild variant="ghost" className="text-space-accent hover:text-space-accent/80 hover:bg-transparent p-0 h-auto">
                  <Link href="/dashboard/bookings">View All</Link>
                </Button>
              </div>
              <CardDescription className="text-gray-400">Your next space adventures</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingBookings bookings={upcomingBookings} />
              
              {upcomingBookings.length === 0 && (
                <div className="text-center py-8">
                  <Rocket className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No upcoming trips</h3>
                  <p className="text-gray-400 mb-6">You don't have any trips scheduled yet.</p>
                  <Button asChild className="bg-space-accent hover:bg-space-highlight">
                    <Link href="/destinations">
                      Explore Destinations
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white/5 border-white/10 text-white h-full">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Travel Tips</CardTitle>
              <CardDescription className="text-gray-400">AI-powered recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <TravelTips destinationType={nextTrip?.trip?.destination?.type} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-white/10 hover:bg-white/5 hover:text-space-accent">
              <Link href="/destinations">
                <MapPin className="h-6 w-6 mb-2" />
                <span>Explore Destinations</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-white/10 hover:bg-white/5 hover:text-space-accent">
              <Link href="/trips">
                <Rocket className="h-6 w-6 mb-2" />
                <span>Browse Trips</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-white/10 hover:bg-white/5 hover:text-space-accent">
              <Link href="/dashboard/account">
                <User className="h-6 w-6 mb-2" />
                <span>Account Settings</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center border-white/10 hover:bg-white/5 hover:text-space-accent">
              <Link href="/dashboard/support">
                <CreditCard className="h-6 w-6 mb-2" />
                <span>Billing & Support</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
