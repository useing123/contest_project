
// components/dashboard/dashboard-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { User } from '@clerk/nextjs/server';
import { LayoutDashboard, Rocket, Calendar, CreditCard, User as UserIcon, Settings, HelpCircle, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';

type DashboardSidebarProps = {
  user: User;
};

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Bookings',
      href: '/dashboard/bookings',
      icon: Rocket,
    },
    {
      name: 'Travel Calendar',
      href: '/dashboard/calendar',
      icon: Calendar,
    },
    {
      name: 'Account Settings',
      href: '/dashboard/account',
      icon: UserIcon,
    },
    {
      name: 'Billing',
      href: '/dashboard/billing',
      icon: CreditCard,
    },
    {
      name: 'Preferences',
      href: '/dashboard/preferences',
      icon: Settings,
    },
    {
      name: 'Support',
      href: '/dashboard/support',
      icon: HelpCircle,
    },
  ];
  
  return (
    <Card className="bg-white/5 border-white/10 text-white sticky top-24">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
            <Image 
              src={user.imageUrl || '/images/placeholder-avatar.jpg'} 
              alt={user.firstName || 'User'} 
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-400">Space Explorer</p>
          </div>
        </div>
        
        <Separator className="mb-6 bg-white/10" />
        
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive 
                  ? 'bg-space-accent text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <Separator className="my-6 bg-white/10" />
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Theme</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-300 hover:text-white"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
