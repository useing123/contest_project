import Image from 'next/image';
import { QuoteIcon } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "First-time space traveler",
    image: "/images/testimonials/sarah.jpg",
    quote: "The zero-gravity experience in the VIP package was absolutely life-changing. Seeing Earth from orbit made me realize how precious our planet is.",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Lunar Explorer",
    image: "/images/testimonials/james.jpg",
    quote: "Standing on the lunar surface and looking back at Earth hanging in the black sky is something everyone should experience once in their lifetime.",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Space photography enthusiast",
    image: "/images/testimonials/maria.jpg",
    quote: "The accommodations on Orbit One were beyond luxurious, and the staff made sure every moment of my journey was perfect. I can't wait to go back!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-space-gradient text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Our Travelers Say</h2>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-16">
          Hear from those who have already experienced our space adventures
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 flex flex-col"
            >
              <div className="mb-6">
                <QuoteIcon className="h-8 w-8 text-space-accent opacity-50" />
              </div>
              
              <p className="text-gray-300 italic flex-grow mb-6">{testimonial.quote}</p>
              
              <div className="flex items-center">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                  <Image 
                    src={testimonial.image || "/images/placeholder-avatar.jpg"} 
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}