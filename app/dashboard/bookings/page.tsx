
// app/dashboard/bookings/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import { Filter, CalendarDays, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prisma } from '@/lib/db';
import BookingsList from '@/components/dashboard/bookings-list';
import Loading from '@/components/dashboard/loading';

export const metadata = {
  title: 'My Bookings | Space Travel Dubai',
  description: 'Manage your space travel bookings.',
};

export default async function BookingsPage({
  searchParams
}: {
  searchParams: { status?: string }
}) {
  const user = await currentUser();
  const status = searchParams?.status || 'all';
  
  const bookings = await prisma.booking.findMany({
    where: {
      userId: user?.id,
      ...(status !== 'all' ? { status: status as any } : {}),
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
    orderBy: [
      {
        trip: {
          departureDate: 'asc',
        },
      },
      {
        createdAt: 'desc',
      }
    ],
  });
  
  // Filter bookings by status for the tabs
  const upcomingBookings = bookings.filter(booking => 
    ['PENDING', 'CONFIRMED'].includes(booking.status) && 
    new Date(booking.trip.departureDate) > new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    ['COMPLETED', 'CANCELLED'].includes(booking.status) ||
    new Date(booking.trip.departureDate) <= new Date()
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <Button asChild className="bg-space-accent hover:bg-space-highlight">
          <Link href="/trips">
            Book New Trip
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="bg-white/5 border-white/10 p-1">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
            <CalendarDays className="h-4 w-4 mr-2" />
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-space-accent data-[state=active]:text-white">
            <ListFilter className="h-4 w-4 mr-2" />
            Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Suspense fallback={<Loading />}>
            <BookingsList bookings={upcomingBookings} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          <Suspense fallback={<Loading />}>
            <BookingsList bookings={pastBookings} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
