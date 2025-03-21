// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.booking.deleteMany({})
  await prisma.tripPackage.deleteMany({})
  await prisma.trip.deleteMany({})
  await prisma.accommodation.deleteMany({})
  await prisma.destination.deleteMany({})
  await prisma.seatClass.deleteMany({})
  await prisma.user.deleteMany({})

  // Create seat classes
  const economyClass = await prisma.seatClass.create({
    data: {
      name: 'Economy Shuttle',
      description: 'Standard space travel experience with essential amenities for a comfortable journey.',
      amenities: ['Basic Life Support', 'Shared Viewing Port', 'Standard Meal Service', 'Personal Entertainment Console']
    }
  })

  const luxuryClass = await prisma.seatClass.create({
    data: {
      name: 'Luxury Cabin',
      description: 'Premium space travel with enhanced comfort and exclusive services.',
      amenities: ['Enhanced Life Support', 'Private Viewing Port', 'Gourmet Meal Service', 'Premium Entertainment System', 'Sleep Pod', 'Personal Assistant AI']
    }
  })

  const vipClass = await prisma.seatClass.create({
    data: {
      name: 'VIP Zero-G Experience',
      description: 'Ultimate space travel with exclusive zero-gravity chambers and personalized service.',
      amenities: ['Premium Life Support', 'Panoramic Viewing Dome', 'Private Chef', 'Immersive Entertainment Suite', 'Zero-G Activity Chamber', 'Human Concierge', 'Space Walk Option']
    }
  })

  // Create destinations
  const iss = await prisma.destination.create({
    data: {
      name: 'International Space Station Alpha',
      type: 'SPACE_STATION',
      description: 'The upgraded successor to the original ISS, featuring expanded modules for both research and tourism.',
      imageUrl: '/images/destinations/iss-alpha.jpg',
      distance: 1, // 1 light minute
      travelTime: 2, // 2 hours
    }
  })

  const lunarGateway = await prisma.destination.create({
    data: {
      name: 'Lunar Gateway Resort',
      type: 'LUNAR_BASE',
      description: 'Luxury lunar resort with Earth views, featuring the first gravity-controlled environment and authentic lunar surface experiences.',
      imageUrl: '/images/destinations/lunar-gateway.jpg',
      distance: 1, // 1.3 light minutes
      travelTime: 24, // 24 hours
    }
  })

  const orbitOne = await prisma.destination.create({
    data: {
      name: 'Orbit One',
      type: 'ORBITAL_HOTEL',
      description: 'The first commercial space hotel with rotating rings providing artificial gravity and luxury accommodations.',
      imageUrl: '/images/destinations/orbit-one.jpg',
      distance: 1, // 1 light minute
      travelTime: 3, // 3 hours
    }
  })

  const marsBase = await prisma.destination.create({
    data: {
      name: 'Mars Base Olympus',
      type: 'MARS_COLONY',
      description: 'The pioneering Martian colony located near Olympus Mons, offering scientific exploration and adventure tourism.',
      imageUrl: '/images/destinations/mars-olympus.jpg',
      distance: 12, // 12 light minutes
      travelTime: 120, // 5 days (120 hours)
    }
  })

  const ceresOutpost = await prisma.destination.create({
    data: {
      name: 'Ceres Mining Outpost',
      type: 'ASTEROID_OUTPOST',
      description: 'Commercial mining facility offering tours of asteroid mining operations and low-gravity experiences.',
      imageUrl: '/images/destinations/ceres-outpost.jpg',
      distance: 22, // 22 light minutes
      travelTime: 240, // 10 days (240 hours)
    }
  })

  // Create trips
  const issTrip = await prisma.trip.create({
    data: {
      name: 'ISS Explorer',
      description: 'Experience life on the International Space Station with this 3-day orbital adventure.',
      destinationId: iss.id,
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      returnDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),   // 10 days from now
      availableSeats: 50,
    }
  })

  const lunarTrip = await prisma.trip.create({
    data: {
      name: 'Lunar Vacation',
      description: 'Experience the gravity of the Moon with this week-long stay at the Lunar Gateway Resort.',
      destinationId: lunarGateway.id,
      departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),    // 3 weeks from now
      availableSeats: 30,
    }
  })

  const orbitTrip = await prisma.trip.create({
    data: {
      name: 'Orbital Luxury Getaway',
      description: 'Indulge in luxury with this weekend stay at the Orbit One space hotel.',
      destinationId: orbitOne.id,
      departureDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
      returnDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),    // 24 days from now
      availableSeats: 40,
    }
  })

  const marsTrip = await prisma.trip.create({
    data: {
      name: 'Mars Expedition',
      description: 'Join this pioneering two-week journey to the Mars Base Olympus colony.',
      destinationId: marsBase.id,
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      returnDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),    // 44 days from now
      availableSeats: 20,
    }
  })

  const ceresTrip = await prisma.trip.create({
    data: {
      name: 'Asteroid Mining Adventure',
      description: 'Experience asteroid mining operations on this unique journey to the Ceres Mining Outpost.',
      destinationId: ceresOutpost.id,
      departureDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 2 months from now
      returnDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),    // 75 days from now
      availableSeats: 15,
    }
  })

  // Create trip packages
  // ISS Trip Packages
  await prisma.tripPackage.create({
    data: {
      name: 'ISS Economy Experience',
      description: 'Standard ISS visit package with all basic amenities and guided tours.',
      tripId: issTrip.id,
      seatClassId: economyClass.id,
      price: 250000,
      features: ['Station Tour', 'Space Walk Viewing', 'Research Module Visit', 'Earth Observation Session'],
      maxCapacity: 30
    }
  })

  await prisma.tripPackage.create({
    data: {
      name: 'ISS Luxury Experience',
      description: 'Premium ISS package with enhanced accommodations and exclusive experiences.',
      tripId: issTrip.id,
      seatClassId: luxuryClass.id,
      price: 500000,
      features: ['Private Station Tour', 'Space Walk Viewing', 'Research Participation', 'Extended Earth Observation', 'Dining with Astronauts'],
      maxCapacity: 15
    }
  })

  await prisma.tripPackage.create({
    data: {
      name: 'ISS VIP Experience',
      description: 'Ultimate ISS experience with guided space walk and complete access to all station facilities.',
      tripId: issTrip.id,
      seatClassId: vipClass.id,
      price: 1000000,
      features: ['Guided Space Walk', 'Unrestricted Station Access', 'Research Collaboration', 'Private Earth Observation', 'Dining with Station Commander', 'Custom Itinerary'],
      maxCapacity: 5
    }
  })

  // Lunar Trip Packages
  await prisma.tripPackage.create({
    data: {
      name: 'Lunar Economy Package',
      description: 'Standard lunar visit with guided surface excursions and basic lunar activities.',
      tripId: lunarTrip.id,
      seatClassId: economyClass.id,
      price: 750000,
      features: ['Shared Lunar Habitat', 'Guided Surface Excursion', 'Basic Lunar Activities', 'Earth Rise Viewing'],
      maxCapacity: 20
    }
  })

  await prisma.tripPackage.create({
    data: {
      name: 'Lunar Luxury Package',
      description: 'Enhanced lunar experience with private quarters and exclusive exploration opportunities.',
      tripId: lunarTrip.id,
      seatClassId: luxuryClass.id,
      price: 1500000,
      features: ['Private Lunar Quarters', 'Extended Surface Explorations', 'Lunar Rover Experience', 'Premium Earth Viewing', 'Lunar Photography Session'],
      maxCapacity: 8
    }
  })

  await prisma.tripPackage.create({
    data: {
      name: 'Lunar VIP Package',
      description: 'Ultimate lunar vacation with private habitat and personalized experience.',
      tripId: lunarTrip.id,
      seatClassId: vipClass.id,
      price: 3000000,
      features: ['Private Lunar Habitat', 'Unlimited Surface Access', 'Personal Lunar Rover', 'Exclusive Crater Exploration', 'Custom Lunar Experience Design', 'Historic Landing Sites Visit'],
      maxCapacity: 2
    }
  })

  // Create accommodations
  // ISS Accommodations
  await prisma.accommodation.create({
    data: {
      name: 'ISS Standard Pod',
      description: 'Compact but comfortable sleeping quarters on the International Space Station.',
      imageUrl: '/images/accommodations/iss-standard.jpg',
      destinationId: iss.id,
      type: 'STANDARD_CABIN',
      price: 50000, // per night
      rating: 4.2,
      amenities: ['Sleep Restraint System', 'Personal Storage', 'Video Communication', 'Earth Viewing Window'],
      maxOccupancy: 1
    }
  })

  await prisma.accommodation.create({
    data: {
      name: 'ISS Research Quarter',
      description: 'Specialized accommodation with access to research facilities on the ISS.',
      imageUrl: '/images/accommodations/iss-research.jpg',
      destinationId: iss.id,
      type: 'RESEARCH_QUARTERS',
      price: 75000, // per night
      rating: 4.0,
      amenities: ['Sleep Restraint System', 'Research Equipment Access', 'Extended Communication Systems', 'Data Analysis Station'],
      maxOccupancy: 1
    }
  })

  // Lunar Accommodations
  await prisma.accommodation.create({
    data: {
      name: 'Lunar Dome Suite',
      description: 'Luxurious accommodation with panoramic views of the lunar landscape and Earth.',
      imageUrl: '/images/accommodations/lunar-dome.jpg',
      destinationId: lunarGateway.id,
      type: 'VIP_SUITE',
      price: 200000, // per night
      rating: 4.9,
      amenities: ['King Bed with Gravity Control', 'Panoramic Dome Ceiling', 'Private Airlock', 'Lunar Lounge', 'Gourmet Meal Service', 'Personal Butler AI'],
      maxOccupancy: 2
    }
  })

  await prisma.accommodation.create({
    data: {
      name: 'Lunar Standard Cabin',
      description: 'Comfortable cabin with all essential amenities for your lunar stay.',
      imageUrl: '/images/accommodations/lunar-standard.jpg',
      destinationId: lunarGateway.id,
      type: 'STANDARD_CABIN',
      price: 100000, // per night
      rating: 4.3,
      amenities: ['Queen Bed with Gravity Control', 'Earth View Window', 'Regolith-Filtered Air System', 'Lunar Cuisine Menu'],
      maxOccupancy: 2
    }
  })

  // Orbit One Accommodations
  await prisma.accommodation.create({
    data: {
      name: 'Orbital Luxury Pod',
      description: 'Elegant pod accommodation in the rotating section of Orbit One with Earth views.',
      imageUrl: '/images/accommodations/orbit-luxury.jpg',
      destinationId: orbitOne.id,
      type: 'LUXURY_POD',
      price: 150000, // per night
      rating: 4.7,
      amenities: ['Queen Bed', 'Partial Gravity Environment', 'Panoramic Earth View', 'Premium Food Service', 'Spa Access'],
      maxOccupancy: 2
    }
  })

  await prisma.accommodation.create({
    data: {
      name: 'Zero-G Chamber',
      description: 'Specialized accommodation in the zero-gravity section of Orbit One for the ultimate weightless experience.',
      imageUrl: '/images/accommodations/orbit-zerog.jpg',
      destinationId: orbitOne.id,
      type: 'ZERO_G_CHAMBER',
      price: 180000, // per night
      rating: 4.8,
      amenities: ['Sleep Restraint System', 'Floating Lounge', 'Zero-G Shower', 'Adaptable Living Space', '3D Entertainment System'],
      maxOccupancy: 2
    }
  })

  // Mars Accommodations
  await prisma.accommodation.create({
    data: {
      name: 'Mars Habitat Suite',
      description: 'Comfortable and secure accommodation in the Mars Base Olympus colony.',
      imageUrl: '/images/accommodations/mars-habitat.jpg',
      destinationId: marsBase.id,
      type: 'STANDARD_CABIN',
      price: 250000, // per night
      rating: 4.4,
      amenities: ['Queen Bed', 'Martian View Port', 'Advanced Life Support', 'Radiation Shielding', 'Martian Garden Access'],
      maxOccupancy: 2
    }
  })

  await prisma.accommodation.create({
    data: {
      name: 'Olympus VIP Quarters',
      description: 'Exclusive accommodations with the best views of Olympus Mons and premium amenities.',
      imageUrl: '/images/accommodations/mars-vip.jpg',
      destinationId: marsBase.id,
      type: 'VIP_SUITE',
      price: 400000, // per night
      rating: 4.9,
      amenities: ['King Bed', 'Panoramic Mars View', 'Private Airlock', 'Personal Rover Access', 'Research Lab Access', 'Gourmet Martian Cuisine'],
      maxOccupancy: 2
    }
  })

  // Ceres Accommodations
  await prisma.accommodation.create({
    data: {
      name: 'Ceres Mining Quarters',
      description: 'Authentic mining outpost accommodation with low-gravity environment.',
      imageUrl: '/images/accommodations/ceres-mining.jpg',
      destinationId: ceresOutpost.id,
      type: 'STANDARD_CABIN',
      price: 200000, // per night
      rating: 4.0,
      amenities: ['Bunk Bed with Restraints', 'Asteroid View Port', 'Mining Equipment Display', 'Recreation Area Access'],
      maxOccupancy: 2
    }
  })

  await prisma.accommodation.create({
    data: {
      name: 'Ceres Research Suite',
      description: 'Specialized accommodation for researchers with access to asteroid samples and equipment.',
      imageUrl: '/images/accommodations/ceres-research.jpg',
      destinationId: ceresOutpost.id,
      type: 'RESEARCH_QUARTERS',
      price: 250000, // per night
      rating: 4.2,
      amenities: ['Queen Bed with Restraints', 'Research Station', 'Sample Analysis Equipment', 'Data Uplink Priority', 'Private Asteroid Viewing'],
      maxOccupancy: 1
    }
  })

  console.log('Database has been seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })