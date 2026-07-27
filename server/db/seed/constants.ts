export const EVENT_CATEGORIES = [
  "Technology & Innovation",
  "Music & Concerts",
  "Business & Networking",
  "Design & Creative Arts",
  "Food & Beverage",
  "Gaming & Esports",
  "Sports & Fitness",
] as const;

export const SAMPLE_EVENTS = [
  {
    title: "Global Tech Summit 2026",
    description:
      "The world's leading technology conference bringing together innovators, AI researchers, software engineers, and industry visionaries to discuss the next decade of technology.",
    location: "Eko Convention Centre, Victoria Island, Lagos",
    bannerUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Early Bird Pass", price: "49.99", quantity: 200 },
      { name: "Regular Pass", price: "99.99", quantity: 500 },
      { name: "VIP Executive Pass", price: "299.99", quantity: 50 },
    ],
  },
  {
    title: "Neon Beats Afro-Electronic Fest",
    description:
      "An extraordinary night of high-energy electronic music mixed with vibrant Afrobeat rhythms. Features top international DJs, light installations, and immersive audio visual stages.",
    location: "Landmark Beach & Event Center, Oniru, Lagos",
    bannerUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "General Access", price: "25.00", quantity: 1500 },
      { name: "VIP Lounge", price: "120.00", quantity: 250 },
      { name: "VVIP Table (Group of 6)", price: "500.00", quantity: 20 },
    ],
  },
  {
    title: "West Africa Developer Conference (DevCon '26)",
    description:
      "Two days of hands-on tech workshops, open-source deep dives, architectural keynotes, and networking with over 3,000 active developers across Africa.",
    location: "The Dome, Abuja International Conference Centre, FCT",
    bannerUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Student Developer Ticket", price: "15.00", quantity: 300 },
      { name: "General Developer Pass", price: "45.00", quantity: 800 },
      { name: "Workshop + Conference Pass", price: "110.00", quantity: 150 },
    ],
  },
  {
    title: "Artisanal Coffee & Gourmet Street Food Expo",
    description:
      "Experience world-class coffee roasters, artisanal bakeries, live culinary demonstrations, and tasting menus from top chefs across the continent.",
    location: "Metropolitan Park Pavilion, Ikeja, Lagos",
    bannerUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Day Tasting Pass", price: "20.00", quantity: 600 },
      { name: "Weekend Unlimited Pass", price: "45.00", quantity: 300 },
    ],
  },
  {
    title: "Indie Game Developers & Esports Championship",
    description:
      "Play upcoming indie game titles, participate in live tournament matches, meet game designers, and watch the regional Tekken & Valorant finals.",
    location: "Grand Arena, National Stadium Complex, Surulere",
    bannerUrl:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Gamer Pass", price: "18.00", quantity: 1000 },
      { name: "Tournament Competitor Pass", price: "35.00", quantity: 128 },
      { name: "Spectator VIP Ticket", price: "60.00", quantity: 200 },
    ],
  },
  {
    title: "Future Design & Spatial UX Summit",
    description:
      "A boutique design conference focusing on spatial computing, generative UI systems, design leadership, and human-centered design principles.",
    location: "Transcorp Hilton Conference Hall, Abuja",
    bannerUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Standard Design Pass", price: "85.00", quantity: 400 },
      { name: "Design Lead Masterclass Pass", price: "210.00", quantity: 75 },
    ],
  },
  {
    title: "Venture Pitch Night & Founder Expo",
    description:
      "Watch 15 shortlisted startups pitch to prominent venture capital funds and angel investors. Features panel discussions on venture scaling and exits.",
    location: "Capital Club Auditorium, Victoria Island, Lagos",
    bannerUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Founder Ticket", price: "30.00", quantity: 150 },
      { name: "Investor / Ecosystem Partner Pass", price: "150.00", quantity: 100 },
    ],
  },
  {
    title: "International Jazz & Blues Evening",
    description:
      "An elegant outdoor evening of smooth jazz ensembles, blues vocalists, fine dining, and curated wine pairings under the stars.",
    location: "Lekki Conservation Park Outdoor Amphitheatre, Lagos",
    bannerUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80",
    ticketTypes: [
      { name: "Lawn Seating Pass", price: "40.00", quantity: 500 },
      { name: "Reserved Table Seating", price: "90.00", quantity: 150 },
      { name: "VIP Dining Experience", price: "180.00", quantity: 50 },
    ],
  },
] as const;

export const SCANNER_LOCATIONS = [
  "Main Gate Entrance A",
  "VIP Gate Entrance B",
  "Exhibition Hall South Gate",
  "Backstage Gate C",
  "East Pedestrian Gate",
] as const;

export const DEMO_USERS = {
  organizer: {
    name: "Jane Organizer",
    email: "organizer@etickets.com",
    role: "organizer" as const,
    password: "hashed_password_placeholder",
  },
  attendee: {
    name: "Alex Attendee",
    email: "attendee@etickets.com",
    role: "attendee" as const,
    password: "hashed_password_placeholder",
  },
  admin: {
    name: "Sam Admin",
    email: "admin@etickets.com",
    role: "organizer" as const,
    password: "hashed_password_placeholder",
  },
};
