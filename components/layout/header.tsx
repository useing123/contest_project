"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/destinations', label: 'Destinations' },
    { href: '/trips', label: 'Trips' },
    { href: '/accommodations', label: 'Accommodations' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-space-dark/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="relative h-10 w-10 mr-2">
              <Image src="/images/logo.svg" alt="Space Travel Dubai Logo" fill className="object-contain" />
            </span>
            <span className="text-xl font-semibold">SpaceTravel</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium hover:text-space-accent transition-colors ${pathname === link.href ? 'text-space-accent' : 'text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white">
                    Dashboard <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">My Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/support">Support</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <Button asChild variant="ghost" className="text-white hover:text-space-accent hover:bg-transparent">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-space-accent hover:bg-space-highlight">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-space-dark/95 backdrop-blur-md`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-base font-medium py-2 ${pathname === link.href ? 'text-space-accent' : 'text-white'}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 mt-2">
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="flex items-center text-base font-medium py-2 text-white"
                >
                  <User className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <div className="py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  className="block text-base font-medium py-2 text-white"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up" 
                  className="block text-base font-medium py-2 text-space-accent"
                >
                  Sign Up
                </Link>
              </SignedOut>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}