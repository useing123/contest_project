import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and info */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="relative h-10 w-10 mr-2">
                <Image src="/images/logo.svg" alt="Space Travel Dubai Logo" fill className="object-contain" />
              </span>
              <span className="text-xl font-semibold">SpaceTravel</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Dubai to the Stars: The Ultimate Space Travel Experience
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-space-accent">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-space-accent">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-space-accent">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-space-accent">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-space-accent">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-gray-400 hover:text-space-accent">
                  Trips
                </Link>
              </li>
              <li>
                <Link href="/accommodations" className="text-gray-400 hover:text-space-accent">
                  Accommodations
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-space-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-space-accent">
                  Space Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-space-accent">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-400 hover:text-space-accent">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-space-accent">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-space-accent">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-space-accent">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-space-accent mr-3 mt-0.5" />
                <span className="text-gray-400">contact@spacetravel.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-space-accent mr-3 mt-0.5" />
                <span className="text-gray-400">+971 4 123 4567</span>
              </li>
              <li className="text-gray-400">
                SpaceTravel Headquarters<br />
                Dubai Space Center<br />
                Sheikh Zayed Road<br />
                Dubai, UAE
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SpaceTravel Dubai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}