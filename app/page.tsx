// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { BookOpenCheck, Rocket, MapPin, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedDestinations from '@/components/home/featured-destinations';
import HeroSearch from '@/components/home/hero-search';
import Testimonials from '@/components/home/testimonials';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-space.jpg" 
            alt="Space view from Dubai" 
            fill 
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter max-w-4xl animate-float">
            Dubai to the Stars: <span className="text-space-accent">The Ultimate Space Travel Experience</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Embark on the journey of a lifetime with the world's first commercial space travel hub.
            Explore space stations, lunar bases, and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-space-accent hover:bg-space-highlight text-white font-medium px-8">
              <Link href="/destinations">
                Explore Destinations
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="w-full max-w-4xl mt-12">
            <HeroSearch />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-space-dark text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose SpaceTravel Dubai</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-space-light/5 to-space-light/0 rounded-lg border border-space-light/10 hover:border-space-accent/50 transition-all">
              <div className="h-16 w-16 bg-space-accent/20 rounded-full flex items-center justify-center mb-4">
                <Rocket className="h-8 w-8 text-space-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cutting-Edge Technology</h3>
              <p className="text-gray-400">Powered by the latest aerospace innovations ensuring safety and comfort</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-space-light/5 to-space-light/0 rounded-lg border border-space-light/10 hover:border-space-accent/50 transition-all">
              <div className="h-16 w-16 bg-space-accent/20 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-space-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exclusive Destinations</h3>
              <p className="text-gray-400">Access to unique locations from the ISS to lunar bases and Mars colonies</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-space-light/5 to-space-light/0 rounded-lg border border-space-light/10 hover:border-space-accent/50 transition-all">
              <div className="h-16 w-16 bg-space-accent/20 rounded-full flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-space-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Experience</h3>
              <p className="text-gray-400">Premium accommodations and services tailored to your space adventure</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-space-light/5 to-space-light/0 rounded-lg border border-space-light/10 hover:border-space-accent/50 transition-all">
              <div className="h-16 w-16 bg-space-accent/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-space-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
              <p className="text-gray-400">Trained space travel specialists to make your journey unforgettable</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <FeaturedDestinations />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-space-gradient relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="/images/stars-bg.jpg" 
            alt="Stars background" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Begin Your Space Journey?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of pioneers who have already experienced the wonders of space travel from Dubai.
          </p>
          
          <Button asChild size="lg" className="bg-space-accent hover:bg-space-highlight text-white font-medium px-8 py-6 text-lg">
            <Link href="/register">
              Start Your Adventure
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}