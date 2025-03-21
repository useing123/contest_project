// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';

export const metadata = {
  title: 'User Dashboard | Space Travel Dubai',
  description: 'Manage your space travel bookings and profile.',
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-space-dark pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <DashboardSidebar user={user} />
          </div>
          <div className="lg:w-3/4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
