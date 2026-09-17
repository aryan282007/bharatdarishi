require("dotenv").config();
const mongoose = require("mongoose");
const Temple = require("./models/Temple");
const Event = require("./models/Event");
const Hotel = require("./models/Hotel");
const Itinerary = require("./models/Itinerary");
const User = require("./models/User");
const Place = require("./models/Place");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mahakal_db";

const initialTemples = [
  {
    id: "shri-mahakaleshwar",
    name: "Shri Mahakaleshwar Jyotirlinga",
    title: "Shri Mahakaleshwar Jyotirlinga",
    tagline: "The Sovereign Lord of Time & Dakshinamukhi Jyotirlinga",
    location: "Mahakal Marg, Ujjain, Madhya Pradesh 456001",
    city: "Ujjain",
    coordinates: { lat: 23.1827, lng: 75.7682 },
    images: [
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
    description:
      "Shri Mahakaleshwar Temple is one of the 12 sacred Jyotirlingas in India. It is unique as the only south-facing (Dakshinamukhi) Jyotirlinga, symbolizing authority over death and time. Famous worldwide for its early morning 4:00 AM Bhasma Aarti.",
    detailedHistory:
      "According to Hindu Puranas, Lord Shiva manifested here as Mahakal to protect his devotees from the demon Dushan. The temple complex is a three-tiered structure housing Lord Mahakaleshwar at the base, Omkareshwar Mahadev in the middle tier, and Nagchandreshwar at the topmost tier which opens only once a year on Nag Panchami.",
    highlight: "360° Virtual Tour & Bhasma Aarti Booking",
    timings: "04:00 AM - 11:00 PM Daily",
    virtualTourUrl: "https://my.matterport.com/show/?m=sample360mahakal",
    facilities: [
      "Bhasma Aarti Online Booking",
      "VIP Darshan Pass",
      "Prasadam Counter",
      "Locker Room",
      "Wheelchair Access",
    ],
    reviews: [
      {
        user: "Ramesh Sharma",
        rating: 5,
        comment: "Experiencing Bhasma Aarti was divine and soul-stirring.",
      },
      {
        user: "Priya Patel",
        rating: 5,
        comment: "The Mahakal Lok Corridor design is breathtaking.",
      },
    ],
  },
  {
    id: "kal-bhairav",
    name: "Kal Bhairav Temple",
    title: "Kal Bhairav Temple",
    tagline: "Guardian Deity of Ancient Ujjain",
    location: "Jail Road, Bhairav Garh, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2125, lng: 75.7661 },
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
    description:
      "Dedicated to Kal Bhairav, the fierce manifestation of Lord Shiva associated with protection. Known for the unique ancient ritual where liquor offerings are poured into the deity's mouth.",
    detailedHistory:
      "Mentioned in the Skanda Purana, Kal Bhairav was appointed guardian commander of Avantika (Ujjain). Pilgrims traditionally visit Kal Bhairav after Mahakaleshwar to complete their pilgrimage.",
    highlight: "Ancient Tantric Shrine & Shipra Ghat View",
    timings: "05:00 AM - 10:00 PM Daily",
    virtualTourUrl: "",
    facilities: ["Puja Samagri Stalls", "Parking Available", "Shoe Counter"],
    reviews: [
      {
        user: "Amit Varma",
        rating: 5,
        comment: "Fascinating tradition and powerful spiritual energy.",
      },
    ],
  },
  {
    id: "harsiddhi-mata",
    name: "Harsiddhi Mata Temple",
    title: "Harsiddhi Mata Temple",
    tagline: "Sacred 51 Shaktipeeth & Deepstambha Glow",
    location: "Near Mahakal Temple, Ujjain 456001",
    city: "Ujjain",
    coordinates: { lat: 23.1812, lng: 75.7668 },
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1200",
    description:
      "One of the 51 holy Shaktipeeths where Goddess Sati's elbow fell. Famous for two imposing 13th-century stone lamp towers (Deepstambha) illuminated with hundreds of diyas during evening Aarti.",
    detailedHistory:
      "King Vikramaditya worshipped Harsiddhi Devi as his family deity. Historical records state Vikramaditya offered his head to Goddess Harsiddhi eleven times, restored each time by her grace.",
    highlight: "Evening Deepstambha Lighting Ritual",
    timings: "05:00 AM - 11:00 PM Daily",
    facilities: [
      "Deepstambha Lighting Booking",
      "Annakshetra Prasad",
      "Direct Pathway from Mahakal Lok",
    ],
    reviews: [
      {
        user: "Sneha Gupta",
        rating: 5,
        comment: "The evening lamp tower lighting is mesmerising!",
      },
    ],
  },
  {
    id: "chintaman-ganesh",
    name: "Chintaman Ganesh Temple",
    title: "Chintaman Ganesh Temple",
    tagline: "Remover of All Sorrows & Worries",
    location: "Fatehabad Road, Ujjain 456006",
    city: "Ujjain",
    coordinates: { lat: 23.1645, lng: 75.7362 },
    images: [
      "https://images.unsplash.com/photo-1567591370504-20b1e428cf11?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1567591370504-20b1e428cf11?auto=format&fit=crop&q=80&w=1200",
    description:
      "Houses a self-manifested idol of Lord Ganesha flanked by Riddhi and Siddhi. Devotees pray here to dissolve worries (Chinta) and receive blessings for new endeavors.",
    detailedHistory:
      "Built during the Paramara era, the shrine features ancient carved pillars and an auspicious sanctum dating back to the 11th century.",
    highlight: "Self-Manifested Swayambhu Ganesha Idol",
    timings: "06:00 AM - 09:30 PM Daily",
    facilities: ["Car Parking", "Modak Prasad Counters", "Sitting Courtyard"],
    reviews: [],
  },
  {
    id: "mangalnath-temple",
    name: "Mangalnath Temple",
    title: "Mangalnath Temple",
    tagline: "Vedic Birthplace of Planet Mars",
    location: "Mangalnath Marg, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2189, lng: 75.7725 },
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    description:
      "Situated on the banks of Shipra River, this temple is revered in astrological texts as the birthplace of planet Mars (Mangal). Renowned worldwide for Bhaum Seva & Mangal Dosh Nivaran Pujas.",
    detailedHistory:
      "In ancient Indian geography, Ujjain intersected the Prime Meridian (Tropic of Cancer). Vedic astronomers calculated planetary coordinates from Mangalnath Hill.",
    highlight: "Mangal Dosh Shanti Puja & Astrological Consultation",
    timings: "06:00 AM - 09:00 PM Daily",
    facilities: ["Puja Slot Booking", "Pandit Ji Assistance", "Ghat Seating"],
    reviews: [],
  },
  {
    id: "sandipani-ashram",
    name: "Maharshi Sandipani Ashram",
    title: "Maharshi Sandipani Ashram",
    tagline: "Sacred Gurukul of Lord Krishna, Balarama & Sudama",
    location: "Mangalnath Road, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2081, lng: 75.7758 },
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    description:
      "The historical ashram where Lord Krishna, Lord Balarama, and Sudama received education under Sage Sandipani. Lord Krishna mastered 64 Vidyas and 16 Kalas here in just 64 days.",
    detailedHistory:
      "Features the ancient Gomti Kund tank where Lord Krishna summoned waters from sacred rivers for his guru, and stone carvings depicting 64 arts.",
    highlight: "Gomti Kund & 64 Kala Display",
    timings: "07:00 AM - 08:00 PM Daily",
    facilities: ["Guided Heritage Walks", "Botanical Garden", "Library"],
    reviews: [],
  },
];

const initialEvents = [
  {
    id: "sikkim-taxi",
    title: "Sikkim Taxi",
    category: "Taxi & City Cabs",
    city: "Gangtok",
    state: "Sikkim",
    location: "M G Marg, Bazar, Gangtok - 737101",
    rating: 4.8,
    reviewsCount: 185,
    verified: true,
    openingHours: "Open until 11:00 PM",
    estYear: "Est. 2012",
    tags: ["Local Expert", "Clean Vehicles", "On-Time"],
    price: 1500,
    phone: "+91 98320 44556",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    description:
      "Reliable & trusted local city cabs and tour taxi services operating across Gangtok, MG Marg, Nathula Pass, Tsomgo Lake, and Rumtek Monastery.",
    availableTickets: 100,
  },
  {
    id: "beeranbaan-tours",
    title: "Beeranbaan Tours & Travel",
    category: "Car Rentals (Self/Driver)",
    city: "Gangtok",
    state: "Sikkim",
    location: "Tadong, Gangtok, Sikkim - 737102",
    rating: 4.5,
    reviewsCount: 95,
    verified: true,
    openingHours: "Open until 11:45 PM",
    estYear: "Est. 2019",
    tags: ["Best Price", "Great Support", "Safe Travel"],
    price: 2200,
    phone: "+91 97330 88991",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    description:
      "Premium self-drive SUV rentals and dedicated driver cabs for outstation circuits to Pelling, Lachung, Yumthang Valley, and Zuluk.",
    availableTickets: 80,
  },
  {
    id: "himalayan-car-rentals",
    title: "Himalayan Car Rentals",
    category: "Mountain & Outstation",
    city: "Gangtok",
    state: "Sikkim",
    location: "Development Area, Gangtok - 737101",
    rating: 4.9,
    reviewsCount: 320,
    verified: true,
    openingHours: "24/7 Available",
    estYear: "Est. 2015",
    tags: ["Premium Cars", "Highway Expert", "24/7 Service"],
    price: 3500,
    phone: "+91 99325 11223",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
    description:
      "High-altitude 4x4 Innova & Scorpio rentals specially equipped for rugged mountain roads across North Sikkim and Silk Route circuits.",
    availableTickets: 60,
  },
  {
    id: "gangtok-airport-express",
    title: "Pakyong & Bagdogra Airport Transfers",
    category: "Airport Transfers",
    city: "Gangtok",
    state: "Sikkim",
    location: "National Highway 10, Gangtok",
    rating: 4.8,
    reviewsCount: 210,
    verified: true,
    openingHours: "24/7 Available",
    estYear: "Est. 2016",
    tags: ["Flight Tracking", "Fixed Fares", "Punctual Drivers"],
    price: 2800,
    phone: "+91 94341 55443",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    description:
      "Seamless door-to-door airport pick & drop between Gangtok hotels and Bagdogra Airport (IXB) or Pakyong Airport (PYG).",
    availableTickets: 150,
  },
  {
    id: "sikkim-heritage-tours",
    title: "Sikkim Heritage Tours & Shuttles",
    category: "Tours & Shuttles",
    city: "Gangtok",
    state: "Sikkim",
    location: "Deorali Stand, Gangtok",
    rating: 4.7,
    reviewsCount: 140,
    verified: true,
    openingHours: "Open until 10:00 PM",
    estYear: "Est. 2014",
    tags: ["Group Shuttles", "Experienced Guide", "Monastery Circuit"],
    price: 1800,
    phone: "+91 98324 77889",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
    description:
      "Daily scheduled mini-bus shuttles and customized family tour packages covering major monasteries, waterfalls, and scenic viewpoints.",
    availableTickets: 200,
  },
  {
    id: "himalayan-tourist-guide",
    title: "Himalayan Local Tourist Guide",
    category: "Tourist Guide",
    city: "Gangtok",
    state: "Sikkim",
    location: "Ridge Park, Gangtok",
    rating: 4.9,
    reviewsCount: 110,
    verified: true,
    openingHours: "Open until 08:00 PM",
    estYear: "Est. 2011",
    tags: ["Government Approved", "Multi-lingual", "Cultural Expert"],
    price: 1200,
    phone: "+91 97332 33221",
    image:
      "https://images.unsplash.com/photo-1539635273304-0e8723e0f016?auto=format&fit=crop&q=80&w=800",
    description:
      "Certified local tour guides fluent in English, Hindi, and Nepali, providing deep cultural and historical insights into Sikkimese heritage.",
    availableTickets: 50,
  },
  {
    id: "gangtok-scooter-rentals",
    title: "Gangtok Bike & Scooter Rentals",
    category: "Home 2 Wheeler",
    city: "Gangtok",
    state: "Sikkim",
    location: "Tibet Road, Gangtok - 737101",
    rating: 4.6,
    reviewsCount: 165,
    verified: true,
    openingHours: "Open until 09:00 PM",
    estYear: "Est. 2018",
    tags: ["Free Helmets", "Well Serviced", "Minimal Deposit"],
    price: 799,
    phone: "+91 98325 99887",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
    description:
      "Rent Activa scooters and Himalayan Royal Enfield motorbikes for effortless city commuting and local sightseeing.",
    availableTickets: 75,
  },
  {
    id: "ujjn-mahakal-cab-service",
    title: "Mahakal Express Cabs & Travels",
    category: "Taxi & City Cabs",
    city: "Ujjain",
    state: "Madhya Pradesh",
    location: "Mahakal Lok Marg, Near Gate 1, Ujjain",
    rating: 4.9,
    reviewsCount: 410,
    verified: true,
    openingHours: "24/7 Available",
    estYear: "Est. 2010",
    tags: ["4 AM Bhasma Pick", "Clean AC Sedan", "Pilgrim Priority"],
    price: 999,
    phone: "+91 98260 14782",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    description:
      "24/7 dedicated cabs for early 4:00 AM Bhasma Aarti pickups, local temple circuit (Kal Bhairav, Harsiddhi, Sandipani), and Indore Airport transfers.",
    availableTickets: 300,
  },
  {
    id: "jaipur-royal-cabs",
    title: "Rajputana Royal Car Rentals",
    category: "Car Rentals (Self/Driver)",
    city: "Jaipur",
    state: "Rajasthan",
    location: "MI Road, Pink City, Jaipur",
    rating: 4.8,
    reviewsCount: 290,
    verified: true,
    openingHours: "Open until 11:30 PM",
    estYear: "Est. 2013",
    tags: ["Chauffeur Driven", "Fort Circuit", "Luxury Cars"],
    price: 2500,
    phone: "+91 94140 12345",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    description:
      "Royal luxury sedan and SUV rentals for Amer Fort, Hawa Mahal, Jal Mahal sightseeing, and outstation trips to Ajmer & Pushkar.",
    availableTickets: 120,
  },
  {
    id: "leh-himalayan-bikers",
    title: "Ladakh Royal Bikers & 4x4 Rentals",
    category: "Rent 4 Wheeler",
    city: "Leh",
    state: "Ladakh",
    location: "Fort Road, Leh, Ladakh",
    rating: 4.9,
    reviewsCount: 520,
    verified: true,
    openingHours: "24/7 Available",
    estYear: "Est. 2012",
    tags: ["Pangong Permit Desk", "4x4 Mahindra Thar", "Backup Vehicle"],
    price: 4500,
    phone: "+91 94191 77665",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    description:
      "High performance 4x4 Thar and Royal Enfield bikes equipped for Khardung La Pass, Nubra Valley, and Pangong Tso expeditions.",
    availableTickets: 90,
  },
];

const initialHotels = [
  {
    id: "surya-vyas-ujjain",
    name: "Pandit Surya Narayan Vyas Heritage Guest House",
    state: "Madhya Pradesh",
    city: "Ujjain",
    location: "Near Harsiddhi Square, Ujjain, Madhya Pradesh",
    phone: "0734-2585873",
    rating: 4.8,
    pricePerNight: 2300,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "Heritage Stay",
    amenities: [
      "AC Rooms",
      "24/7 Water",
      "Parking",
      "Free Wi-Fi",
      "Satvik Dining",
    ],
    roomTypes: ["Deluxe AC Room", "Family Suite"],
  },
  {
    id: "palace-indore",
    name: "Grand Ahilya Palace & Luxury Resort",
    state: "Madhya Pradesh",
    city: "Indore",
    location: "Vijay Nagar, Indore, Madhya Pradesh",
    phone: "0731-4001234",
    rating: 4.9,
    pricePerNight: 3499,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "5-Star Luxury",
    amenities: [
      "Swimming Pool",
      "Spa & Wellness",
      "Buffet Breakfast",
      "Free Wi-Fi",
    ],
    roomTypes: ["Royal Room", "Executive Suite"],
  },
  {
    id: "khajuraho-resort",
    name: "Temple View Heritage Resort",
    state: "Madhya Pradesh",
    city: "Khajuraho",
    location: "Airport Road, Khajuraho, Madhya Pradesh",
    phone: "07686-274100",
    rating: 4.7,
    pricePerNight: 2899,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "Heritage Resort",
    amenities: [
      "Temple Tour Desk",
      "Swimming Pool",
      "Cultural Show",
      "Restaurant",
    ],
    roomTypes: ["Garden View Room", "Luxury Room"],
  },
  {
    id: "rajputana-palace-jaipur",
    name: "The Rajputana Royal Heritage Hotel",
    state: "Rajasthan",
    city: "Jaipur",
    location: "Amer Road, Jaipur, Rajasthan",
    phone: "0141-2635100",
    rating: 4.9,
    pricePerNight: 4200,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "Royal Heritage",
    amenities: [
      "Royal Dining",
      "Folk Music Evening",
      "Swimming Pool",
      "Valet Parking",
    ],
    roomTypes: ["Heritage Suite", "Royal Deluxe"],
  },
  {
    id: "lake-palace-udaipur",
    name: "Udaipur Lakeview Heritage Retreat",
    state: "Rajasthan",
    city: "Udaipur",
    location: "Lake Pichola Promenade, Udaipur, Rajasthan",
    phone: "0294-2431100",
    rating: 4.9,
    pricePerNight: 5500,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "Lake View Luxury",
    amenities: [
      "Lake View Terrace",
      "Boat Cruise Booking",
      "Rooftop Dining",
      "Spa",
    ],
    roomTypes: ["Lakefront Suite", "Palace Room"],
  },
  {
    id: "desert-camp-jaisalmer",
    name: "Golden Fort Desert Safari & Resort",
    state: "Rajasthan",
    city: "Jaisalmer",
    location: "Sam Sand Dunes, Jaisalmer, Rajasthan",
    phone: "02992-252100",
    rating: 4.8,
    pricePerNight: 3800,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "Desert Camp",
    amenities: [
      "Camel Safari",
      "Rajasthani Folk Dance",
      "Bonfire Dinner",
      "Swiss Tents",
    ],
    roomTypes: ["Swiss Luxury Tent", "Fort Suite"],
  },
  {
    id: "varanasi-ghat-residency",
    name: "Ganga Ghat View Heritage Haveli",
    state: "Uttar Pradesh",
    city: "Varanasi",
    location: "Dashashwamedh Ghat, Varanasi, Uttar Pradesh",
    phone: "0542-2451900",
    rating: 4.8,
    pricePerNight: 2999,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "Ghatfront Haveli",
    amenities: [
      "Aarti Terrace View",
      "Boat Tour Desk",
      "Satvik Restaurant",
      "Free Wi-Fi",
    ],
    roomTypes: ["Ghat View Room", "Heritage Suite"],
  },
  {
    id: "taj-view-agra",
    name: "Taj Mahal View Luxury Stays",
    state: "Uttar Pradesh",
    city: "Agra",
    location: "Taj East Gate Road, Agra, Uttar Pradesh",
    phone: "0562-2231500",
    rating: 4.7,
    pricePerNight: 3500,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "Monument View",
    amenities: [
      "Rooftop Taj View",
      "Pool",
      "Multi-Cuisine Buffet",
      "24/7 Service",
    ],
    roomTypes: ["Taj View Room", "Executive Suite"],
  },
  {
    id: "ayodhya-dham-stay",
    name: "Shri Ram Heritage Guest House",
    state: "Uttar Pradesh",
    city: "Ayodhya",
    location: "Near Ram Mandir Pathway, Ayodhya, Uttar Pradesh",
    phone: "05278-232100",
    rating: 4.9,
    pricePerNight: 2200,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "Divine Pilgrim Stay",
    amenities: ["AC Rooms", "Free Temple Shuttle", "Satvik Dining", "Parking"],
    roomTypes: ["Family AC Room", "Deluxe Room"],
  },
  {
    id: "mumbai-marine-stay",
    name: "The Marine Promenade Hotel",
    state: "Maharashtra",
    city: "Mumbai",
    location: "Marine Drive, Churchgate, Mumbai, Maharashtra",
    phone: "022-66551234",
    rating: 4.8,
    pricePerNight: 4999,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "Sea View Luxury",
    amenities: [
      "Sea View Rooms",
      "Rooftop Lounge",
      "Gym & Spa",
      "Airport Transfer",
    ],
    roomTypes: ["Sea View Room", "Business Suite"],
  },
  {
    id: "shirdi-sai-stay",
    name: "Sai Baba Devotional Residency",
    state: "Maharashtra",
    city: "Shirdi",
    location: "Pimplewadi Road, Near Sai Temple, Shirdi, Maharashtra",
    phone: "02423-255100",
    rating: 4.7,
    pricePerNight: 1800,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "Pilgrim Special",
    amenities: [
      "Free Temple Drop",
      "AC Family Suites",
      "Pure Veg Dining",
      "Parking",
    ],
    roomTypes: ["Family Room", "AC Deluxe"],
  },
  {
    id: "goa-beach-resort",
    name: "Palolem Sunset Beach Resort & Spa",
    state: "Goa",
    city: "South Goa",
    location: "Palolem Beachfront, South Goa",
    phone: "0832-2643100",
    rating: 4.8,
    pricePerNight: 3900,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "Beachfront Resort",
    amenities: [
      "Direct Beach Access",
      "Swimming Pool",
      "Beachside Dining",
      "Water Sports",
    ],
    roomTypes: ["Ocean Cottage", "Beachfront Villa"],
  },
  {
    id: "rishikesh-ganga-resort",
    name: "Ganga Valley Yoga & Wellness Retreat",
    state: "Uttarakhand",
    city: "Rishikesh",
    location: "Laxman Jhula Marg, Rishikesh, Uttarakhand",
    phone: "0135-2431200",
    rating: 4.9,
    pricePerNight: 3200,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "Wellness Retreat",
    amenities: [
      "Daily Yoga Classes",
      "Organic Ayurvedic Meals",
      "Ganga View Balcony",
      "Rafting Desk",
    ],
    roomTypes: ["Ganga View Balcony Room", "Yoga Suite"],
  },
  {
    id: "shimla-pine-resort",
    name: "Shimla Himalayan Valley Lodge",
    state: "Himachal Pradesh",
    city: "Shimla",
    location: "Mall Road Promenade, Shimla, Himachal Pradesh",
    phone: "0177-2801200",
    rating: 4.7,
    pricePerNight: 2999,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "Mountain View",
    amenities: [
      "Pine Forest Views",
      "Heated Rooms",
      "Bonfire Evening",
      "Trekking Guides",
    ],
    roomTypes: ["Valley View Room", "Himalayan Suite"],
  },
  {
    id: "munnar-tea-resort",
    name: "Munnar Tea Hills Heritage Bungalow",
    state: "Kerala",
    city: "Munnar",
    location: "Tea Plantation Hill, Munnar, Kerala",
    phone: "04865-230100",
    rating: 4.9,
    pricePerNight: 3600,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "Plantation Resort",
    amenities: [
      "Tea Garden Tour",
      "Ayurvedic Spa",
      "Mountain View Balcony",
      "Kerala Cuisine",
    ],
    roomTypes: ["Plantation Cottage", "Tea Suite"],
  },
  {
    id: "delhi-heritage-stay",
    name: "The Imperial Capital Residency",
    state: "Delhi",
    city: "New Delhi",
    location: "Connaught Place, New Delhi",
    phone: "011-23341000",
    rating: 4.8,
    pricePerNight: 3800,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "City Center Luxury",
    amenities: [
      "Metro Access",
      "Multi-Cuisine Buffet",
      "Free Wi-Fi",
      "Airport Cab Desk",
    ],
    roomTypes: ["Business Room", "Capital Suite"],
  },
  {
    id: "gangtok-view-resort",
    name: "Kanchenjunga Ridge Resort Gangtok",
    state: "Sikkim",
    city: "Gangtok",
    location: "MG Marg Promenade, Gangtok, Sikkim",
    phone: "03592-202100",
    rating: 4.8,
    pricePerNight: 3250,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "Himalayan View",
    amenities: [
      "Kanchenjunga View",
      "Sikkimese Dining",
      "Free Wi-Fi",
      "Trekking Desk",
    ],
    roomTypes: ["Mountain Deluxe", "Heritage Room"],
  },
  {
    id: "leh-himalayan-camp",
    name: "Leh Dragon Himalayan Heritage Hotel",
    state: "Ladakh",
    city: "Leh",
    location: "Fort Road, Leh, Ladakh",
    phone: "01982-252100",
    rating: 4.9,
    pricePerNight: 3800,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "High Altitude Luxury",
    amenities: [
      "Oxygen Concentrators",
      "Ladakhi Cultural Meals",
      "Monastery Tour Desk",
    ],
    roomTypes: ["Himalayan Deluxe", "Highland Suite"],
  },
];

const initialItineraries = [
  {
    id: 1,
    days: "1 Day",
    title: "1-Day Express Mahakal & Bhasma Aarti Circuit",
    destination: "Mahakal Temple & Shipra Ghats",
    description:
      "Experience 4 AM Bhasma Aarti, explore Mahakal Lok Corridor, visit Harsiddhi Temple, and attend Shipra Evening Aarti.",
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    days: "2 Days",
    title: "2-Day Jyotirlinga & Shaktipeeth Pilgrimage",
    destination: "Ujjain & Omkareshwar Excursion",
    description:
      "Day 1 in Mahakaleshwar & Harsiddhi. Day 2 trip to Omkareshwar Jyotirlinga along Narmada River.",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    days: "3 Days",
    title: "3-Day Ujjain Heritage & Astrological Trail",
    destination: "Full Avantika Tour",
    description:
      "Covers Mahakaleshwar, Kal Bhairav, Mangalnath, Sandipani Ashram, Jantar Mantar observatory, and Chintaman Ganesh.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
  },
];

const initialPlaces = [
  {
    _id: "6aa83b2e1b1df08547d0065",
    id: "andhra-pradesh-tirupati",
    name: "Tirupati",
    subtitle:
      "Tirupati is one of India's most visited pilgrimage destinations, centered around the sacred Tirumala hills and the Sri Venkateswara Temple.",
    location: "Tirupati, Andhra Pradesh",
    city: "Tirupati",
    state: "Andhra Pradesh",
    coordinates: {
      lat: 13.6288,
      lng: 79.4192,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481411/Tirupati1_zv1ukj.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481415/Tirupati2_jsb5wh.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481423/Tirupati3_kumr9o.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Tirupati Airport (TIR)",
    nearestRailway: "Tirupati Railway Station (TPTY)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Tirupati",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Tirupati is one of India's most visited pilgrimage destinations, centered around the sacred Tirumala hills and the Sri Venkateswara Temple.",
    leadParagraphs: [
      "Tirupati is one of India's most visited pilgrimage destinations, centered around the sacred Tirumala hills and the Sri Venkateswara Temple.",
      "Whether you are visiting Tirupati for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Tirupati",
        paragraphs: [
          "Discover Tirupati and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Andhra Pradesh.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Tirupati offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Tirupati to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Tirupati. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Tirupati: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Tirupati is one of India's most visited pilgrimage destinations, centered around the sacred Tirumala hills and the Sri Venkateswara Temple.",
        "Tirupati is a featured tourism destination in Andhra Pradesh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Tirupati",
          paragraphs: [
            "Discover Tirupati and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Andhra Pradesh.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Tirupati offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Tirupati to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Tirupati. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Tirupati",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "andhra-pradesh-tirupati",
        _id: "6aa83b2e1b1df08547d00c9",
      },
      {
        title: "Explore Andhra Pradesh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "andhra-pradesh-tirupati",
        _id: "6aa83b2e1b1df08547d012d",
      },
    ],
    experiences: [
      "Explore Sri Venkateswara Temple, Tirumala",
      "Local culture and food around Tirupati",
    ],
    nearbyAttractions: [
      {
        name: "Sri Venkateswara Temple, Tirumala",
        distance: "Nearby",
        description:
          "A key attraction associated with Tirupati and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0191",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0066",
    id: "arunachal-pradesh-tawang",
    name: "Tawang",
    subtitle:
      "Tawang is a spectacular Himalayan destination known for dramatic mountain scenery, Buddhist heritage, and the historic Tawang Monastery.",
    location: "Tawang, Arunachal Pradesh",
    city: "Tawang",
    state: "Arunachal Pradesh",
    coordinates: {
      lat: 27.586,
      lng: 91.859,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481632/Tawang1_o5wauc.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481640/Tawang2_a2t6fx.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481649/Tawang3_lt8emn.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Tezpur Airport (TEZ)",
    nearestRailway: "Tezpur Railway Station (TZTB)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Tawang",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Tawang is a spectacular Himalayan destination known for dramatic mountain scenery, Buddhist heritage, and the historic Tawang Monastery.",
    leadParagraphs: [
      "Tawang is a spectacular Himalayan destination known for dramatic mountain scenery, Buddhist heritage, and the historic Tawang Monastery.",
      "Whether you are visiting Tawang for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Tawang",
        paragraphs: [
          "Discover Tawang and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Arunachal Pradesh.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Tawang offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Tawang to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Tawang. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Tawang: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Tawang is a spectacular Himalayan destination known for dramatic mountain scenery, Buddhist heritage, and the historic Tawang Monastery.",
        "Tawang is a featured tourism destination in Arunachal Pradesh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Tawang",
          paragraphs: [
            "Discover Tawang and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Arunachal Pradesh.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Tawang offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Tawang to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Tawang. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Tawang",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "arunachal-pradesh-tawang",
        _id: "6aa83b2e1b1df08547d00ca",
      },
      {
        title: "Explore Arunachal Pradesh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "arunachal-pradesh-tawang",
        _id: "6aa83b2e1b1df08547d012e",
      },
    ],
    experiences: [
      "Explore Tawang Monastery",
      "Local culture and food around Tawang",
    ],
    nearbyAttractions: [
      {
        name: "Tawang Monastery",
        distance: "Nearby",
        description:
          "A key attraction associated with Tawang and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0192",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0067",
    id: "assam-kaziranga",
    name: "Kaziranga National Park",
    subtitle:
      "Kaziranga National Park is renowned for its rich wildlife, grasslands, wetlands, and especially its population of one-horned rhinoceroses.",
    location: "Golaghat, Assam",
    city: "Golaghat",
    state: "Assam",
    coordinates: {
      lat: 26.5775,
      lng: 93.1711,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481993/Kaziranga_National_Park1_ddesny.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482002/Kaziranga_National_Park2_insli0.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482010/3Kaziranga_National_Park_l5pql8.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Jorhat Airport (JRH)",
    nearestRailway: "Furkating Junction (FKG)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Kaziranga National Park",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Kaziranga National Park is renowned for its rich wildlife, grasslands, wetlands, and especially its population of one-horned rhinoceroses.",
    leadParagraphs: [
      "Kaziranga National Park is renowned for its rich wildlife, grasslands, wetlands, and especially its population of one-horned rhinoceroses.",
      "Whether you are visiting Kaziranga National Park for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Kaziranga National Park",
        paragraphs: [
          "Discover Kaziranga National Park and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Assam.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Kaziranga National Park offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Kaziranga National Park to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Kaziranga National Park. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Kaziranga National Park: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Kaziranga National Park is renowned for its rich wildlife, grasslands, wetlands, and especially its population of one-horned rhinoceroses.",
        "Kaziranga National Park is a featured tourism destination in Assam, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Kaziranga National Park",
          paragraphs: [
            "Discover Kaziranga National Park and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Assam.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Kaziranga National Park offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Kaziranga National Park to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Kaziranga National Park. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Kaziranga National Park",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "assam-kaziranga",
        _id: "6aa83b2e1b1df08547d00cb",
      },
      {
        title: "Explore Assam: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "assam-kaziranga",
        _id: "6aa83b2e1b1df08547d012f",
      },
    ],
    experiences: [
      "Explore Kaziranga National Park",
      "Local culture and food around Kaziranga National Park",
    ],
    nearbyAttractions: [
      {
        name: "Kaziranga National Park",
        distance: "Nearby",
        description:
          "A key attraction associated with Kaziranga National Park and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0193",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0068",
    id: "bihar-bodh-gaya",
    name: "Bodh Gaya",
    subtitle:
      "Bodh Gaya is a major Buddhist pilgrimage destination associated with the enlightenment of Gautama Buddha.",
    location: "Bodh Gaya, Bihar",
    city: "Bodh Gaya",
    state: "Bihar",
    coordinates: {
      lat: 24.6961,
      lng: 84.9914,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482279/Bodh_Gaya_Bihar2_i9gm3j.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482274/Bodh_Gaya_Bihar1_axiymj.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482280/Bodh_Gaya_Bihar3_psm3cb.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Gaya Airport (GAY)",
    nearestRailway: "Gaya Junction (GAYA)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Bodh Gaya",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Bodh Gaya is a major Buddhist pilgrimage destination associated with the enlightenment of Gautama Buddha.",
    leadParagraphs: [
      "Bodh Gaya is a major Buddhist pilgrimage destination associated with the enlightenment of Gautama Buddha.",
      "Whether you are visiting Bodh Gaya for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Bodh Gaya",
        paragraphs: [
          "Discover Bodh Gaya and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Bihar.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Bodh Gaya offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Bodh Gaya to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Bodh Gaya. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Bodh Gaya: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Bodh Gaya is a major Buddhist pilgrimage destination associated with the enlightenment of Gautama Buddha.",
        "Bodh Gaya is a featured tourism destination in Bihar, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Bodh Gaya",
          paragraphs: [
            "Discover Bodh Gaya and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Bihar.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Bodh Gaya offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Bodh Gaya to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Bodh Gaya. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Bodh Gaya",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "bihar-bodh-gaya",
        _id: "6aa83b2e1b1df08547d00cc",
      },
      {
        title: "Explore Bihar: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "bihar-bodh-gaya",
        _id: "6aa83b2e1b1df08547d0130",
      },
    ],
    experiences: [
      "Explore Mahabodhi Temple",
      "Local culture and food around Bodh Gaya",
    ],
    nearbyAttractions: [
      {
        name: "Mahabodhi Temple",
        distance: "Nearby",
        description:
          "A key attraction associated with Bodh Gaya and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0194",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0069",
    id: "chhattisgarh-chitrakote",
    name: "Chitrakote Falls",
    subtitle:
      "Chitrakote Falls is a dramatic horseshoe-shaped waterfall on the Indravati River and one of Chhattisgarh's signature natural attractions.",
    location: "Bastar, Chhattisgarh",
    city: "Bastar",
    state: "Chhattisgarh",
    coordinates: {
      lat: 19.205,
      lng: 81.697,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482607/Bastar_Chhattisgarh3_uwydxe.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482601/Bastar_Chhattisgarh2_fudjgh.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482594/Bastar_Chhattisgarh1_k226pa.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Jagdalpur Airport (JGB)",
    nearestRailway: "Jagdalpur Railway Station (JDB)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Chitrakote Falls",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Chitrakote Falls is a dramatic horseshoe-shaped waterfall on the Indravati River and one of Chhattisgarh's signature natural attractions.",
    leadParagraphs: [
      "Chitrakote Falls is a dramatic horseshoe-shaped waterfall on the Indravati River and one of Chhattisgarh's signature natural attractions.",
      "Whether you are visiting Chitrakote Falls for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Chitrakote Falls",
        paragraphs: [
          "Discover Chitrakote Falls and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Chhattisgarh.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Chitrakote Falls offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Chitrakote Falls to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Chitrakote Falls. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Chitrakote Falls: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Chitrakote Falls is a dramatic horseshoe-shaped waterfall on the Indravati River and one of Chhattisgarh's signature natural attractions.",
        "Chitrakote Falls is a featured tourism destination in Chhattisgarh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Chitrakote Falls",
          paragraphs: [
            "Discover Chitrakote Falls and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Chhattisgarh.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Chitrakote Falls offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Chitrakote Falls to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Chitrakote Falls. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Chitrakote Falls",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "chhattisgarh-chitrakote",
        _id: "6aa83b2e1b1df08547d00cd",
      },
      {
        title: "Explore Chhattisgarh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "chhattisgarh-chitrakote",
        _id: "6aa83b2e1b1df08547d0131",
      },
    ],
    experiences: [
      "Explore Chitrakote Falls",
      "Local culture and food around Chitrakote Falls",
    ],
    nearbyAttractions: [
      {
        name: "Chitrakote Falls",
        distance: "Nearby",
        description:
          "A key attraction associated with Chitrakote Falls and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0195",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006a",
    id: "goa-baga-beach",
    name: "Baga Beach",
    subtitle:
      "Baga Beach is a lively coastal destination known for its sandy shoreline, water activities, restaurants, and vibrant nightlife.",
    location: "North Goa, Goa",
    city: "North Goa",
    state: "Goa",
    coordinates: {
      lat: 15.5557,
      lng: 73.7517,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482941/Baga_Beach1_x4llg1.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482949/Baga_Beach2_pape1i.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789482957/Baga_Beach3_cdd0o9.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Manohar International Airport (GOX)",
    nearestRailway: "Thivim Railway Station (THVM)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Baga Beach",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Baga Beach is a lively coastal destination known for its sandy shoreline, water activities, restaurants, and vibrant nightlife.",
    leadParagraphs: [
      "Baga Beach is a lively coastal destination known for its sandy shoreline, water activities, restaurants, and vibrant nightlife.",
      "Whether you are visiting Baga Beach for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Baga Beach",
        paragraphs: [
          "Discover Baga Beach and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Goa.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Baga Beach offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Baga Beach to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Baga Beach. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Baga Beach: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Baga Beach is a lively coastal destination known for its sandy shoreline, water activities, restaurants, and vibrant nightlife.",
        "Baga Beach is a featured tourism destination in Goa, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Baga Beach",
          paragraphs: [
            "Discover Baga Beach and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Goa.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Baga Beach offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Baga Beach to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Baga Beach. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Baga Beach",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "goa-baga-beach",
        _id: "6aa83b2e1b1df08547d00ce",
      },
      {
        title: "Explore Goa: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "goa-baga-beach",
        _id: "6aa83b2e1b1df08547d0132",
      },
    ],
    experiences: [
      "Explore Baga Beach",
      "Local culture and food around Baga Beach",
    ],
    nearbyAttractions: [
      {
        name: "Baga Beach",
        distance: "Nearby",
        description:
          "A key attraction associated with Baga Beach and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0196",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006b",
    id: "gujarat-statue-of-unity",
    name: "Statue of Unity",
    subtitle:
      "The Statue of Unity is a monumental landmark beside the Narmada River, surrounded by scenic landscapes and visitor attractions.",
    location: "Ekta Nagar, Gujarat",
    city: "Ekta Nagar",
    state: "Gujarat",
    coordinates: {
      lat: 21.838,
      lng: 73.7191,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789563243/Statue-of-Unity--Sardar_ix4swc.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483205/Gujarat2_fzpqa6.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483200/Gujarat1_obzwxe.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Vadodara Airport (BDQ)",
    nearestRailway: "Ekta Nagar Railway Station (EKNR)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Statue of Unity",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "The Statue of Unity is a monumental landmark beside the Narmada River, surrounded by scenic landscapes and visitor attractions.",
    leadParagraphs: [
      "The Statue of Unity is a monumental landmark beside the Narmada River, surrounded by scenic landscapes and visitor attractions.",
      "Whether you are visiting Statue of Unity for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Statue of Unity",
        paragraphs: [
          "Discover Statue of Unity and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Gujarat.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Statue of Unity offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Statue of Unity to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Statue of Unity. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Statue of Unity: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "The Statue of Unity is a monumental landmark beside the Narmada River, surrounded by scenic landscapes and visitor attractions.",
        "Statue of Unity is a featured tourism destination in Gujarat, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Statue of Unity",
          paragraphs: [
            "Discover Statue of Unity and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Gujarat.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Statue of Unity offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Statue of Unity to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Statue of Unity. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Statue of Unity",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "gujarat-statue-of-unity",
        _id: "6aa83b2e1b1df08547d00cf",
      },
      {
        title: "Explore Gujarat: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "gujarat-statue-of-unity",
        _id: "6aa83b2e1b1df08547d0133",
      },
    ],
    experiences: [
      "Explore Statue of Unity",
      "Local culture and food around Statue of Unity",
    ],
    nearbyAttractions: [
      {
        name: "Statue of Unity",
        distance: "Nearby",
        description:
          "A key attraction associated with Statue of Unity and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0197",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006c",
    id: "haryana-kurukshetra",
    name: "Kurukshetra",
    subtitle:
      "Kurukshetra is a historic and cultural destination associated with the Mahabharata and important pilgrimage sites.",
    location: "Kurukshetra, Haryana",
    city: "Kurukshetra",
    state: "Haryana",
    coordinates: {
      lat: 29.9695,
      lng: 76.8783,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483457/Kurukshetra_Haryana3_k7evcf.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483448/Kurukshetra_Haryana2_lge2og.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483443/Kurukshetra_Haryana1_dy67og.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Chandigarh Airport (IXC)",
    nearestRailway: "Kurukshetra Railway Station (KKDE)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Kurukshetra",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Kurukshetra is a historic and cultural destination associated with the Mahabharata and important pilgrimage sites.",
    leadParagraphs: [
      "Kurukshetra is a historic and cultural destination associated with the Mahabharata and important pilgrimage sites.",
      "Whether you are visiting Kurukshetra for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Kurukshetra",
        paragraphs: [
          "Discover Kurukshetra and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Haryana.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Kurukshetra offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Kurukshetra to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Kurukshetra. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Kurukshetra: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Kurukshetra is a historic and cultural destination associated with the Mahabharata and important pilgrimage sites.",
        "Kurukshetra is a featured tourism destination in Haryana, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Kurukshetra",
          paragraphs: [
            "Discover Kurukshetra and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Haryana.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Kurukshetra offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Kurukshetra to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Kurukshetra. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Kurukshetra",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "haryana-kurukshetra",
        _id: "6aa83b2e1b1df08547d00d0",
      },
      {
        title: "Explore Haryana: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "haryana-kurukshetra",
        _id: "6aa83b2e1b1df08547d0134",
      },
    ],
    experiences: [
      "Explore Brahma Sarovar",
      "Local culture and food around Kurukshetra",
    ],
    nearbyAttractions: [
      {
        name: "Brahma Sarovar",
        distance: "Nearby",
        description:
          "A key attraction associated with Kurukshetra and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0198",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006d",
    id: "himachal-pradesh-manali",
    name: "Manali",
    subtitle:
      "Manali is a popular Himalayan resort town surrounded by snow-capped peaks, valleys, forests, rivers, and adventure opportunities.",
    location: "Manali, Himachal Pradesh",
    city: "Manali",
    state: "Himachal Pradesh",
    coordinates: {
      lat: 32.2396,
      lng: 77.1887,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483670/Manali_Himachal_Pradesh1_in38jf.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483676/Manali_Himachal_Pradesh2_zrmgmt.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483687/Manali_Himachal_Pradesh3_qz12tp.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Kulluâ€“Manali Airport (KUU)",
    nearestRailway: "Joginder Nagar Railway Station (JDNX)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Manali",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Manali is a popular Himalayan resort town surrounded by snow-capped peaks, valleys, forests, rivers, and adventure opportunities.",
    leadParagraphs: [
      "Manali is a popular Himalayan resort town surrounded by snow-capped peaks, valleys, forests, rivers, and adventure opportunities.",
      "Whether you are visiting Manali for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Manali",
        paragraphs: [
          "Discover Manali and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Himachal Pradesh.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Manali offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Manali to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Manali. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Manali: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Manali is a popular Himalayan resort town surrounded by snow-capped peaks, valleys, forests, rivers, and adventure opportunities.",
        "Manali is a featured tourism destination in Himachal Pradesh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Manali",
          paragraphs: [
            "Discover Manali and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Himachal Pradesh.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Manali offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Manali to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Manali. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Manali",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "himachal-pradesh-manali",
        _id: "6aa83b2e1b1df08547d00d1",
      },
      {
        title: "Explore Himachal Pradesh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "himachal-pradesh-manali",
        _id: "6aa83b2e1b1df08547d0135",
      },
    ],
    experiences: [
      "Explore Solang Valley",
      "Local culture and food around Manali",
    ],
    nearbyAttractions: [
      {
        name: "Solang Valley",
        distance: "Nearby",
        description:
          "A key attraction associated with Manali and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d0199",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006e",
    id: "jharkhand-dassam-falls",
    name: "Dassam Falls",
    subtitle:
      "Dassam Falls is a scenic cascade on the Kanchi River surrounded by forested landscapes near Ranchi.",
    location: "Ranchi, Jharkhand",
    city: "Ranchi",
    state: "Jharkhand",
    coordinates: {
      lat: 23.1303,
      lng: 85.463,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483955/Ranchi_Jharkhand2_ifvvx4.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483944/Ranchi_Jharkhand1_fntc4m.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789483956/Ranchi_Jharkhand3_tk6bfe.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Birsa Munda Airport (IXR)",
    nearestRailway: "Ranchi Railway Station (RNC)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Dassam Falls",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Dassam Falls is a scenic cascade on the Kanchi River surrounded by forested landscapes near Ranchi.",
    leadParagraphs: [
      "Dassam Falls is a scenic cascade on the Kanchi River surrounded by forested landscapes near Ranchi.",
      "Whether you are visiting Dassam Falls for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Dassam Falls",
        paragraphs: [
          "Discover Dassam Falls and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Jharkhand.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Dassam Falls offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Dassam Falls to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Dassam Falls. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Dassam Falls: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Dassam Falls is a scenic cascade on the Kanchi River surrounded by forested landscapes near Ranchi.",
        "Dassam Falls is a featured tourism destination in Jharkhand, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Dassam Falls",
          paragraphs: [
            "Discover Dassam Falls and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Jharkhand.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Dassam Falls offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Dassam Falls to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Dassam Falls. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Dassam Falls",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "jharkhand-dassam-falls",
        _id: "6aa83b2e1b1df08547d00d2",
      },
      {
        title: "Explore Jharkhand: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "jharkhand-dassam-falls",
        _id: "6aa83b2e1b1df08547d0136",
      },
    ],
    experiences: [
      "Explore Dassam Falls",
      "Local culture and food around Dassam Falls",
    ],
    nearbyAttractions: [
      {
        name: "Dassam Falls",
        distance: "Nearby",
        description:
          "A key attraction associated with Dassam Falls and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019a",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d006f",
    id: "karnataka-hampi",
    name: "Hampi",
    subtitle:
      "Hampi is a UNESCO World Heritage landscape filled with monumental ruins, temples, boulders, and remnants of the Vijayanagara Empire.",
    location: "Vijayanagara, Karnataka",
    city: "Vijayanagara",
    state: "Karnataka",
    coordinates: {
      lat: 15.335,
      lng: 76.46,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789461168/hampi3_umjsww.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789461156/hampi2_jqcksf.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789461146/hampi1_ukue1i.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Jindal Vijayanagar Airport (VDY)",
    nearestRailway: "Hosapete Junction (HPT)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Hampi",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Hampi is a UNESCO World Heritage landscape filled with monumental ruins, temples, boulders, and remnants of the Vijayanagara Empire.",
    leadParagraphs: [
      "Hampi is a UNESCO World Heritage landscape filled with monumental ruins, temples, boulders, and remnants of the Vijayanagara Empire.",
      "Whether you are visiting Hampi for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Hampi",
        paragraphs: [
          "Discover Hampi and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Karnataka.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Hampi offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Hampi to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Hampi. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Hampi: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Hampi is a UNESCO World Heritage landscape filled with monumental ruins, temples, boulders, and remnants of the Vijayanagara Empire.",
        "Hampi is a featured tourism destination in Karnataka, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Hampi",
          paragraphs: [
            "Discover Hampi and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Karnataka.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Hampi offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Hampi to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Hampi. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Hampi",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "karnataka-hampi",
        _id: "6aa83b2e1b1df08547d00d3",
      },
      {
        title: "Explore Karnataka: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "karnataka-hampi",
        _id: "6aa83b2e1b1df08547d0137",
      },
    ],
    experiences: [
      "Explore Virupaksha Temple",
      "Local culture and food around Hampi",
    ],
    nearbyAttractions: [
      {
        name: "Virupaksha Temple",
        distance: "Nearby",
        description:
          "A key attraction associated with Hampi and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019b",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0070",
    id: "kerala-munnar",
    name: "Munnar",
    subtitle:
      "Munnar is a scenic hill destination famous for tea plantations, misty mountains, forests, waterfalls, and cool weather.",
    location: "Munnar, Kerala",
    city: "Munnar",
    state: "Kerala",
    coordinates: {
      lat: 10.0889,
      lng: 77.0595,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789462603/munnar3_z7sl1l.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789462594/Munnar2_oagyz7.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789462592/Munnar1_ovulyr.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Cochin International Airport (COK)",
    nearestRailway: "Aluva Railway Station (AWY)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Munnar",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Munnar is a scenic hill destination famous for tea plantations, misty mountains, forests, waterfalls, and cool weather.",
    leadParagraphs: [
      "Munnar is a scenic hill destination famous for tea plantations, misty mountains, forests, waterfalls, and cool weather.",
      "Whether you are visiting Munnar for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Munnar",
        paragraphs: [
          "Discover Munnar and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Kerala.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Munnar offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Munnar to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Munnar. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Munnar: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Munnar is a scenic hill destination famous for tea plantations, misty mountains, forests, waterfalls, and cool weather.",
        "Munnar is a featured tourism destination in Kerala, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Munnar",
          paragraphs: [
            "Discover Munnar and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Kerala.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Munnar offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Munnar to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Munnar. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Munnar",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "kerala-munnar",
        _id: "6aa83b2e1b1df08547d00d4",
      },
      {
        title: "Explore Kerala: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "kerala-munnar",
        _id: "6aa83b2e1b1df08547d0138",
      },
    ],
    experiences: [
      "Explore Eravikulam National Park",
      "Local culture and food around Munnar",
    ],
    nearbyAttractions: [
      {
        name: "Eravikulam National Park",
        distance: "Nearby",
        description:
          "A key attraction associated with Munnar and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019c",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0071",
    id: "madhya-pradesh-khajuraho",
    name: "Khajuraho",
    subtitle:
      "Khajuraho is celebrated for its magnificent group of medieval temples and finely detailed stone architecture.",
    location: "Khajuraho, Madhya Pradesh",
    city: "Khajuraho",
    state: "Madhya Pradesh",
    coordinates: {
      lat: 24.8318,
      lng: 79.9199,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463173/Khajuraho1_qh2mzl.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463177/Khajuraho2_o4i7ua.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463188/Khajuraho3_s09xvj.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Khajuraho Airport (HJR)",
    nearestRailway: "Khajuraho Railway Station (KURJ)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Khajuraho",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Khajuraho is celebrated for its magnificent group of medieval temples and finely detailed stone architecture.",
    leadParagraphs: [
      "Khajuraho is celebrated for its magnificent group of medieval temples and finely detailed stone architecture.",
      "Whether you are visiting Khajuraho for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Khajuraho",
        paragraphs: [
          "Discover Khajuraho and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Madhya Pradesh.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Khajuraho offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Khajuraho to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Khajuraho. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Khajuraho: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Khajuraho is celebrated for its magnificent group of medieval temples and finely detailed stone architecture.",
        "Khajuraho is a featured tourism destination in Madhya Pradesh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Khajuraho",
          paragraphs: [
            "Discover Khajuraho and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Madhya Pradesh.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Khajuraho offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Khajuraho to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Khajuraho. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Khajuraho",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "madhya-pradesh-khajuraho",
        _id: "6aa83b2e1b1df08547d00d5",
      },
      {
        title: "Explore Madhya Pradesh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "madhya-pradesh-khajuraho",
        _id: "6aa83b2e1b1df08547d0139",
      },
    ],
    experiences: [
      "Explore Khajuraho Group of Monuments",
      "Local culture and food around Khajuraho",
    ],
    nearbyAttractions: [
      {
        name: "Khajuraho Group of Monuments",
        distance: "Nearby",
        description:
          "A key attraction associated with Khajuraho and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019d",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0072",
    id: "maharashtra-gateway-of-india",
    name: "Gateway of India, Mumbai",
    subtitle:
      "The Gateway of India is an iconic waterfront landmark overlooking Mumbai Harbour and a classic starting point for exploring South Mumbai.",
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    coordinates: {
      lat: 18.922,
      lng: 72.8347,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463769/Gateway_of_India1_oys0xh.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463773/Gateway_of_India2_cgijdw.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789463775/Gateway_of_India3_leamba.avif",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Chhatrapati Shivaji Maharaj International Airport (BOM)",
    nearestRailway: "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Gateway of India, Mumbai",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "The Gateway of India is an iconic waterfront landmark overlooking Mumbai Harbour and a classic starting point for exploring South Mumbai.",
    leadParagraphs: [
      "The Gateway of India is an iconic waterfront landmark overlooking Mumbai Harbour and a classic starting point for exploring South Mumbai.",
      "Whether you are visiting Gateway of India, Mumbai for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Gateway of India, Mumbai",
        paragraphs: [
          "Discover Gateway of India, Mumbai and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Maharashtra.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Gateway of India, Mumbai offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Gateway of India, Mumbai to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Gateway of India, Mumbai. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Gateway of India, Mumbai: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "The Gateway of India is an iconic waterfront landmark overlooking Mumbai Harbour and a classic starting point for exploring South Mumbai.",
        "Gateway of India, Mumbai is a featured tourism destination in Maharashtra, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Gateway of India, Mumbai",
          paragraphs: [
            "Discover Gateway of India, Mumbai and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Maharashtra.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Gateway of India, Mumbai offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Gateway of India, Mumbai to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Gateway of India, Mumbai. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Gateway of India, Mumbai",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "maharashtra-gateway-of-india",
        _id: "6aa83b2e1b1df08547d00d6",
      },
      {
        title: "Explore Maharashtra: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "maharashtra-gateway-of-india",
        _id: "6aa83b2e1b1df08547d013a",
      },
    ],
    experiences: [
      "Explore Gateway of India",
      "Local culture and food around Gateway of India, Mumbai",
    ],
    nearbyAttractions: [
      {
        name: "Gateway of India",
        distance: "Nearby",
        description:
          "A key attraction associated with Gateway of India, Mumbai and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019e",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0073",
    id: "manipur-loktak-lake",
    name: "Loktak Lake",
    subtitle:
      "Loktak Lake is famous for its floating phumdis and surrounding wetland landscape, making it one of Manipur's most distinctive natural attractions.",
    location: "Bishnupur, Manipur",
    city: "Bishnupur",
    state: "Manipur",
    coordinates: {
      lat: 24.55,
      lng: 93.7833,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789464530/Loktak_Lake1_rwremw.png",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789464536/Loktak_Lake2_uj4ofu.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789464554/Loktak_Lake3_nwfr8d.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Imphal International Airport (IMF)",
    nearestRailway: "Jiribam Railway Station (JRBM)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Loktak Lake",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Loktak Lake is famous for its floating phumdis and surrounding wetland landscape, making it one of Manipur's most distinctive natural attractions.",
    leadParagraphs: [
      "Loktak Lake is famous for its floating phumdis and surrounding wetland landscape, making it one of Manipur's most distinctive natural attractions.",
      "Whether you are visiting Loktak Lake for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Loktak Lake",
        paragraphs: [
          "Discover Loktak Lake and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Manipur.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Loktak Lake offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Loktak Lake to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Loktak Lake. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Loktak Lake: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Loktak Lake is famous for its floating phumdis and surrounding wetland landscape, making it one of Manipur's most distinctive natural attractions.",
        "Loktak Lake is a featured tourism destination in Manipur, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Loktak Lake",
          paragraphs: [
            "Discover Loktak Lake and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Manipur.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Loktak Lake offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Loktak Lake to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Loktak Lake. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Loktak Lake",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "manipur-loktak-lake",
        _id: "6aa83b2e1b1df08547d00d7",
      },
      {
        title: "Explore Manipur: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "manipur-loktak-lake",
        _id: "6aa83b2e1b1df08547d013b",
      },
    ],
    experiences: [
      "Explore Keibul Lamjao National Park",
      "Local culture and food around Loktak Lake",
    ],
    nearbyAttractions: [
      {
        name: "Keibul Lamjao National Park",
        distance: "Nearby",
        description:
          "A key attraction associated with Loktak Lake and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d019f",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0074",
    id: "meghalaya-cherrapunji",
    name: "Cherrapunji (Sohra)",
    subtitle:
      "Sohra is known for dramatic cliffs, lush valleys, living root bridges, caves, and spectacular waterfalls.",
    location: "Sohra, Meghalaya",
    city: "Sohra",
    state: "Meghalaya",
    coordinates: {
      lat: 25.2689,
      lng: 91.7314,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789476925/Cherrapunji_Sohra_1_kel0mm.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789476933/Cherrapunji_Sohra_2_erhzvo.avif",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789476940/Cherrapunji_Sohra_3_jvyxjz.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Shillong Airport (SHL)",
    nearestRailway: "Guwahati Railway Station (GHY)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Cherrapunji (Sohra)",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Sohra is known for dramatic cliffs, lush valleys, living root bridges, caves, and spectacular waterfalls.",
    leadParagraphs: [
      "Sohra is known for dramatic cliffs, lush valleys, living root bridges, caves, and spectacular waterfalls.",
      "Whether you are visiting Cherrapunji (Sohra) for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Cherrapunji (Sohra)",
        paragraphs: [
          "Discover Cherrapunji (Sohra) and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Meghalaya.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Cherrapunji (Sohra) offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Cherrapunji (Sohra) to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Cherrapunji (Sohra). Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Cherrapunji (Sohra): A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Sohra is known for dramatic cliffs, lush valleys, living root bridges, caves, and spectacular waterfalls.",
        "Cherrapunji (Sohra) is a featured tourism destination in Meghalaya, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Cherrapunji (Sohra)",
          paragraphs: [
            "Discover Cherrapunji (Sohra) and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Meghalaya.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Cherrapunji (Sohra) offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Cherrapunji (Sohra) to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Cherrapunji (Sohra). Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Cherrapunji (Sohra)",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "meghalaya-cherrapunji",
        _id: "6aa83b2e1b1df08547d00d8",
      },
      {
        title: "Explore Meghalaya: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "meghalaya-cherrapunji",
        _id: "6aa83b2e1b1df08547d013c",
      },
    ],
    experiences: [
      "Explore Nohkalikai Falls",
      "Local culture and food around Cherrapunji (Sohra)",
    ],
    nearbyAttractions: [
      {
        name: "Nohkalikai Falls",
        distance: "Nearby",
        description:
          "A key attraction associated with Cherrapunji (Sohra) and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a0",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0075",
    id: "mizoram-aizawl",
    name: "Aizawl",
    subtitle:
      "Aizawl is a picturesque hill city with sweeping views, lively local culture, markets, and a distinctly Mizo character.",
    location: "Aizawl, Mizoram",
    city: "Aizawl",
    state: "Mizoram",
    coordinates: {
      lat: 23.7271,
      lng: 92.7176,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477197/Aizawl2_nc1m2j.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477208/Aizawl3_aahpef.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477213/Aizawl4_v3kd7m.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Lengpui Airport (AJL)",
    nearestRailway: "Silchar Railway Station (SCL)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Aizawl",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Aizawl is a picturesque hill city with sweeping views, lively local culture, markets, and a distinctly Mizo character.",
    leadParagraphs: [
      "Aizawl is a picturesque hill city with sweeping views, lively local culture, markets, and a distinctly Mizo character.",
      "Whether you are visiting Aizawl for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Aizawl",
        paragraphs: [
          "Discover Aizawl and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Mizoram.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Aizawl offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Aizawl to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Aizawl. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Aizawl: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Aizawl is a picturesque hill city with sweeping views, lively local culture, markets, and a distinctly Mizo character.",
        "Aizawl is a featured tourism destination in Mizoram, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Aizawl",
          paragraphs: [
            "Discover Aizawl and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Mizoram.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Aizawl offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Aizawl to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Aizawl. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Aizawl",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "mizoram-aizawl",
        _id: "6aa83b2e1b1df08547d00d9",
      },
      {
        title: "Explore Mizoram: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "mizoram-aizawl",
        _id: "6aa83b2e1b1df08547d013d",
      },
    ],
    experiences: [
      "Explore Durtlang Hills",
      "Local culture and food around Aizawl",
    ],
    nearbyAttractions: [
      {
        name: "Durtlang Hills",
        distance: "Nearby",
        description:
          "A key attraction associated with Aizawl and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a1",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0076",
    id: "nagaland-dzukou-valley",
    name: "Dzukou Valley",
    subtitle:
      "Dzukou Valley is a high-altitude valley known for rolling green landscapes, seasonal flowers, and trekking routes near Kohima.",
    location: "Kohima, Nagaland",
    city: "Kohima",
    state: "Nagaland",
    coordinates: {
      lat: 25.575,
      lng: 94.105,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477495/Dzukou_Valley2_jkarx5.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477505/Dzukou_Valley3_tu4nu0.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477513/Dzukou_Valley1_xouujg.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Dimapur Airport (DMU)",
    nearestRailway: "Dimapur Railway Station (DMV)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Dzukou Valley",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Dzukou Valley is a high-altitude valley known for rolling green landscapes, seasonal flowers, and trekking routes near Kohima.",
    leadParagraphs: [
      "Dzukou Valley is a high-altitude valley known for rolling green landscapes, seasonal flowers, and trekking routes near Kohima.",
      "Whether you are visiting Dzukou Valley for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Dzukou Valley",
        paragraphs: [
          "Discover Dzukou Valley and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Nagaland.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Dzukou Valley offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Dzukou Valley to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Dzukou Valley. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Dzukou Valley: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Dzukou Valley is a high-altitude valley known for rolling green landscapes, seasonal flowers, and trekking routes near Kohima.",
        "Dzukou Valley is a featured tourism destination in Nagaland, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Dzukou Valley",
          paragraphs: [
            "Discover Dzukou Valley and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Nagaland.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Dzukou Valley offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Dzukou Valley to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Dzukou Valley. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Dzukou Valley",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "nagaland-dzukou-valley",
        _id: "6aa83b2e1b1df08547d00da",
      },
      {
        title: "Explore Nagaland: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "nagaland-dzukou-valley",
        _id: "6aa83b2e1b1df08547d013e",
      },
    ],
    experiences: [
      "Explore Dzukou Valley",
      "Local culture and food around Dzukou Valley",
    ],
    nearbyAttractions: [
      {
        name: "Dzukou Valley",
        distance: "Nearby",
        description:
          "A key attraction associated with Dzukou Valley and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a2",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0077",
    id: "odisha-puri",
    name: "Jagannath Temple, Puri",
    subtitle:
      "Puri is a major pilgrimage and coastal destination, best known for the sacred Jagannath Temple and its long sandy beach.",
    location: "Puri, Odisha",
    city: "Puri",
    state: "Odisha",
    coordinates: {
      lat: 19.8049,
      lng: 85.817,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477770/Jagannath_Temple_Puri1_ozizni.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477777/Jagannath_Temple_Puri2_gjcics.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789477787/Odisha3_bkvyas.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Biju Patnaik International Airport (BBI)",
    nearestRailway: "Puri Railway Station (PURI)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Jagannath Temple, Puri",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Puri is a major pilgrimage and coastal destination, best known for the sacred Jagannath Temple and its long sandy beach.",
    leadParagraphs: [
      "Puri is a major pilgrimage and coastal destination, best known for the sacred Jagannath Temple and its long sandy beach.",
      "Whether you are visiting Jagannath Temple, Puri for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Jagannath Temple, Puri",
        paragraphs: [
          "Discover Jagannath Temple, Puri and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Odisha.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Jagannath Temple, Puri offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Jagannath Temple, Puri to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Jagannath Temple, Puri. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Jagannath Temple, Puri: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Puri is a major pilgrimage and coastal destination, best known for the sacred Jagannath Temple and its long sandy beach.",
        "Jagannath Temple, Puri is a featured tourism destination in Odisha, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Jagannath Temple, Puri",
          paragraphs: [
            "Discover Jagannath Temple, Puri and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Odisha.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Jagannath Temple, Puri offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Jagannath Temple, Puri to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Jagannath Temple, Puri. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Jagannath Temple, Puri",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "odisha-puri",
        _id: "6aa83b2e1b1df08547d00db",
      },
      {
        title: "Explore Odisha: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "odisha-puri",
        _id: "6aa83b2e1b1df08547d013f",
      },
    ],
    experiences: [
      "Explore Jagannath Temple",
      "Local culture and food around Jagannath Temple, Puri",
    ],
    nearbyAttractions: [
      {
        name: "Jagannath Temple",
        distance: "Nearby",
        description:
          "A key attraction associated with Jagannath Temple, Puri and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a3",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0078",
    id: "punjab-golden-temple",
    name: "Golden Temple, Amritsar",
    subtitle:
      "The Golden Temple is the spiritual center of Sikhism and one of India's most recognizable heritage and pilgrimage landmarks.",
    location: "Amritsar, Punjab",
    city: "Amritsar",
    state: "Punjab",
    coordinates: {
      lat: 31.62,
      lng: 74.8765,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478018/Golden_Temple_Amritsar1_rpjnyn.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478026/Golden_Temple_Amritsar2_d48ink.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478032/Golden_Temple_Amritsar3_qbbg6j.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Sri Guru Ram Dass Jee International Airport (ATQ)",
    nearestRailway: "Amritsar Junction (ASR)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Golden Temple, Amritsar",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "The Golden Temple is the spiritual center of Sikhism and one of India's most recognizable heritage and pilgrimage landmarks.",
    leadParagraphs: [
      "The Golden Temple is the spiritual center of Sikhism and one of India's most recognizable heritage and pilgrimage landmarks.",
      "Whether you are visiting Golden Temple, Amritsar for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Golden Temple, Amritsar",
        paragraphs: [
          "Discover Golden Temple, Amritsar and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Punjab.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Golden Temple, Amritsar offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Golden Temple, Amritsar to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Golden Temple, Amritsar. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Golden Temple, Amritsar: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "The Golden Temple is the spiritual center of Sikhism and one of India's most recognizable heritage and pilgrimage landmarks.",
        "Golden Temple, Amritsar is a featured tourism destination in Punjab, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Golden Temple, Amritsar",
          paragraphs: [
            "Discover Golden Temple, Amritsar and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Punjab.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Golden Temple, Amritsar offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Golden Temple, Amritsar to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Golden Temple, Amritsar. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Golden Temple, Amritsar",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "punjab-golden-temple",
        _id: "6aa83b2e1b1df08547d00dc",
      },
      {
        title: "Explore Punjab: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "punjab-golden-temple",
        _id: "6aa83b2e1b1df08547d0140",
      },
    ],
    experiences: [
      "Explore Golden Temple",
      "Local culture and food around Golden Temple, Amritsar",
    ],
    nearbyAttractions: [
      {
        name: "Golden Temple",
        distance: "Nearby",
        description:
          "A key attraction associated with Golden Temple, Amritsar and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a4",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0079",
    id: "rajasthan-jaipur",
    name: "Jaipur",
    subtitle:
      "Jaipur, the Pink City, combines grand forts, palaces, historic markets, architecture, crafts, and Rajasthan's vibrant cultural traditions.",
    location: "Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    coordinates: {
      lat: 26.9124,
      lng: 75.7873,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478240/Jaipur1_bo5ktg.webp",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478247/Jaipur2_er5yfp.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478254/Jaipur3_xuuyho.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Jaipur International Airport (JAI)",
    nearestRailway: "Jaipur Junction (JP)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Jaipur",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Jaipur, the Pink City, combines grand forts, palaces, historic markets, architecture, crafts, and Rajasthan's vibrant cultural traditions.",
    leadParagraphs: [
      "Jaipur, the Pink City, combines grand forts, palaces, historic markets, architecture, crafts, and Rajasthan's vibrant cultural traditions.",
      "Whether you are visiting Jaipur for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Jaipur",
        paragraphs: [
          "Discover Jaipur and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Rajasthan.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Jaipur offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Jaipur to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Jaipur. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Jaipur: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Jaipur, the Pink City, combines grand forts, palaces, historic markets, architecture, crafts, and Rajasthan's vibrant cultural traditions.",
        "Jaipur is a featured tourism destination in Rajasthan, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Jaipur",
          paragraphs: [
            "Discover Jaipur and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Rajasthan.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Jaipur offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Jaipur to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Jaipur. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Jaipur",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "rajasthan-jaipur",
        _id: "6aa83b2e1b1df08547d00dd",
      },
      {
        title: "Explore Rajasthan: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "rajasthan-jaipur",
        _id: "6aa83b2e1b1df08547d0141",
      },
    ],
    experiences: ["Explore Amber Fort", "Local culture and food around Jaipur"],
    nearbyAttractions: [
      {
        name: "Amber Fort",
        distance: "Nearby",
        description:
          "A key attraction associated with Jaipur and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a5",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007a",
    id: "sikkim-gangtok",
    name: "Gangtok",
    subtitle:
      "Gangtok is a scenic Himalayan capital known for mountain views, monasteries, viewpoints, and access to Sikkim's high-altitude landscapes.",
    location: "Gangtok, Sikkim",
    city: "Gangtok",
    state: "Sikkim",
    coordinates: {
      lat: 27.3389,
      lng: 88.6065,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478428/Gangtok1_be3jrh.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478436/Gangtok2_ipu0qy.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478445/Gangtok3_cg6vsq.jpg",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Pakyong Airport (PYG)",
    nearestRailway: "New Jalpaiguri Railway Station (NJP)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Gangtok",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Gangtok is a scenic Himalayan capital known for mountain views, monasteries, viewpoints, and access to Sikkim's high-altitude landscapes.",
    leadParagraphs: [
      "Gangtok is a scenic Himalayan capital known for mountain views, monasteries, viewpoints, and access to Sikkim's high-altitude landscapes.",
      "Whether you are visiting Gangtok for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Gangtok",
        paragraphs: [
          "Discover Gangtok and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Sikkim.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Gangtok offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Gangtok to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Gangtok. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Gangtok: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Gangtok is a scenic Himalayan capital known for mountain views, monasteries, viewpoints, and access to Sikkim's high-altitude landscapes.",
        "Gangtok is a featured tourism destination in Sikkim, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Gangtok",
          paragraphs: [
            "Discover Gangtok and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Sikkim.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Gangtok offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Gangtok to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Gangtok. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Gangtok",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "sikkim-gangtok",
        _id: "6aa83b2e1b1df08547d00de",
      },
      {
        title: "Explore Sikkim: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "sikkim-gangtok",
        _id: "6aa83b2e1b1df08547d0142",
      },
    ],
    experiences: [
      "Explore Rumtek Monastery",
      "Local culture and food around Gangtok",
    ],
    nearbyAttractions: [
      {
        name: "Rumtek Monastery",
        distance: "Nearby",
        description:
          "A key attraction associated with Gangtok and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a6",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007b",
    id: "tamil-nadu-ooty",
    name: "Ooty",
    subtitle:
      "Ooty is a classic Nilgiri hill station known for tea gardens, cool weather, lakes, gardens, and mountain railway journeys.",
    location: "Ooty, Tamil Nadu",
    city: "Ooty",
    state: "Tamil Nadu",
    coordinates: {
      lat: 11.4102,
      lng: 76.695,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478619/Ooty1_xzbj4d.png",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478626/Ooty2_nlxdgq.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478635/Ooty3_frza7d.jpg0",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Coimbatore International Airport (CJB)",
    nearestRailway: "Udhagamandalam Railway Station (UAM)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Ooty",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Ooty is a classic Nilgiri hill station known for tea gardens, cool weather, lakes, gardens, and mountain railway journeys.",
    leadParagraphs: [
      "Ooty is a classic Nilgiri hill station known for tea gardens, cool weather, lakes, gardens, and mountain railway journeys.",
      "Whether you are visiting Ooty for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Ooty",
        paragraphs: [
          "Discover Ooty and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Tamil Nadu.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Ooty offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Ooty to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Ooty. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Ooty: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Ooty is a classic Nilgiri hill station known for tea gardens, cool weather, lakes, gardens, and mountain railway journeys.",
        "Ooty is a featured tourism destination in Tamil Nadu, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Ooty",
          paragraphs: [
            "Discover Ooty and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Tamil Nadu.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Ooty offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Ooty to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Ooty. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Ooty",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "tamil-nadu-ooty",
        _id: "6aa83b2e1b1df08547d00df",
      },
      {
        title: "Explore Tamil Nadu: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "tamil-nadu-ooty",
        _id: "6aa83b2e1b1df08547d0143",
      },
    ],
    experiences: [
      "Explore Nilgiri Mountain Railway",
      "Local culture and food around Ooty",
    ],
    nearbyAttractions: [
      {
        name: "Nilgiri Mountain Railway",
        distance: "Nearby",
        description:
          "A key attraction associated with Ooty and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a7",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007c",
    id: "telangana-charminar",
    name: "Charminar, Hyderabad",
    subtitle:
      "Charminar is Hyderabad's iconic historic monument, surrounded by traditional markets and the distinctive culture and cuisine of the Old City.",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: {
      lat: 17.3616,
      lng: 78.4747,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478863/Charminar_Hyderabad1_bpekke.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478868/Charminar_Hyderabad2_b3p131.jpg",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789478877/Charminar_Hyderabad3_ejk2x7.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Rajiv Gandhi International Airport (HYD)",
    nearestRailway: "Hyderabad Deccan Railway Station (HYB)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Charminar, Hyderabad",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Charminar is Hyderabad's iconic historic monument, surrounded by traditional markets and the distinctive culture and cuisine of the Old City.",
    leadParagraphs: [
      "Charminar is Hyderabad's iconic historic monument, surrounded by traditional markets and the distinctive culture and cuisine of the Old City.",
      "Whether you are visiting Charminar, Hyderabad for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Charminar, Hyderabad",
        paragraphs: [
          "Discover Charminar, Hyderabad and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Telangana.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Charminar, Hyderabad offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Charminar, Hyderabad to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Charminar, Hyderabad. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Charminar, Hyderabad: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Charminar is Hyderabad's iconic historic monument, surrounded by traditional markets and the distinctive culture and cuisine of the Old City.",
        "Charminar, Hyderabad is a featured tourism destination in Telangana, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Charminar, Hyderabad",
          paragraphs: [
            "Discover Charminar, Hyderabad and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Telangana.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Charminar, Hyderabad offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Charminar, Hyderabad to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Charminar, Hyderabad. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Charminar, Hyderabad",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "telangana-charminar",
        _id: "6aa83b2e1b1df08547d00e0",
      },
      {
        title: "Explore Telangana: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "telangana-charminar",
        _id: "6aa83b2e1b1df08547d0144",
      },
    ],
    experiences: [
      "Explore Charminar",
      "Local culture and food around Charminar, Hyderabad",
    ],
    nearbyAttractions: [
      {
        name: "Charminar",
        distance: "Nearby",
        description:
          "A key attraction associated with Charminar, Hyderabad and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a8",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007d",
    id: "tripura-ujjayanta-palace",
    name: "Ujjayanta Palace",
    subtitle:
      "Ujjayanta Palace is a grand historic palace in Agartala surrounded by gardens, water features, and cultural institutions.",
    location: "Agartala, Tripura",
    city: "Agartala",
    state: "Tripura",
    coordinates: {
      lat: 23.8315,
      lng: 91.2868,
    },
    image:
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481124/Ujjayanta_Palace3_oz5tnw.jpg",
    images: [
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481117/Ujjayanta_Palace2_obel1f.webp",
      "https://res.cloudinary.com/drplbtg3q/image/upload/v1789481108/Ujjayanta_Palace1_gm4niz.webp",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Maharaja Bir Bikram Airport (IXA)",
    nearestRailway: "Agartala Railway Station (AGTL)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Ujjayanta Palace",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Ujjayanta Palace is a grand historic palace in Agartala surrounded by gardens, water features, and cultural institutions.",
    leadParagraphs: [
      "Ujjayanta Palace is a grand historic palace in Agartala surrounded by gardens, water features, and cultural institutions.",
      "Whether you are visiting Ujjayanta Palace for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Ujjayanta Palace",
        paragraphs: [
          "Discover Ujjayanta Palace and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Tripura.",
        ],
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Ujjayanta Palace offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Ujjayanta Palace to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Ujjayanta Palace. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Ujjayanta Palace: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Ujjayanta Palace is a grand historic palace in Agartala surrounded by gardens, water features, and cultural institutions.",
        "Ujjayanta Palace is a featured tourism destination in Tripura, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Ujjayanta Palace",
          paragraphs: [
            "Discover Ujjayanta Palace and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Tripura.",
          ],
          image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Ujjayanta Palace offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Ujjayanta Palace to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Ujjayanta Palace. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Ujjayanta Palace",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "tripura-ujjayanta-palace",
        _id: "6aa83b2e1b1df08547d00e1",
      },
      {
        title: "Explore Tripura: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "tripura-ujjayanta-palace",
        _id: "6aa83b2e1b1df08547d0145",
      },
    ],
    experiences: [
      "Explore Ujjayanta Palace",
      "Local culture and food around Ujjayanta Palace",
    ],
    nearbyAttractions: [
      {
        name: "Ujjayanta Palace",
        distance: "Nearby",
        description:
          "A key attraction associated with Ujjayanta Palace and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a9",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007e",
    id: "uttar-pradesh-taj-mahal",
    name: "Taj Mahal, Agra",
    subtitle:
      "The Taj Mahal is one of India's most celebrated monuments, renowned worldwide for its architecture, gardens, marble craftsmanship, and history.",
    location: "Agra, Uttar Pradesh",
    city: "Agra",
    state: "Uttar Pradesh",
    coordinates: {
      lat: 27.1751,
      lng: 78.0421,
    },
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Agra Airport (AGR)",
    nearestRailway: "Agra Cantt Railway Station (AGC)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Taj Mahal, Agra",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "The Taj Mahal is one of India's most celebrated monuments, renowned worldwide for its architecture, gardens, marble craftsmanship, and history.",
    leadParagraphs: [
      "The Taj Mahal is one of India's most celebrated monuments, renowned worldwide for its architecture, gardens, marble craftsmanship, and history.",
      "Whether you are visiting Taj Mahal, Agra for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Taj Mahal, Agra",
        paragraphs: [
          "Discover Taj Mahal, Agra and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Uttar Pradesh.",
        ],
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Taj Mahal, Agra offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Taj Mahal, Agra to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Taj Mahal, Agra. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Taj Mahal, Agra: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "The Taj Mahal is one of India's most celebrated monuments, renowned worldwide for its architecture, gardens, marble craftsmanship, and history.",
        "Taj Mahal, Agra is a featured tourism destination in Uttar Pradesh, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Taj Mahal, Agra",
          paragraphs: [
            "Discover Taj Mahal, Agra and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Uttar Pradesh.",
          ],
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Taj Mahal, Agra offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Taj Mahal, Agra to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Taj Mahal, Agra. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Taj Mahal, Agra",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "uttar-pradesh-taj-mahal",
        _id: "6aa83b2e1b1df08547d00e2",
      },
      {
        title: "Explore Uttar Pradesh: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "uttar-pradesh-taj-mahal",
        _id: "6aa83b2e1b1df08547d0146",
      },
    ],
    experiences: [
      "Explore Taj Mahal",
      "Local culture and food around Taj Mahal, Agra",
    ],
    nearbyAttractions: [
      {
        name: "Taj Mahal",
        distance: "Nearby",
        description:
          "A key attraction associated with Taj Mahal, Agra and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01a6",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d007f",
    id: "uttarakhand-valley-of-flowers",
    name: "Valley of Flowers",
    subtitle:
      "The Valley of Flowers is a spectacular Himalayan alpine valley known for seasonal wildflowers, dramatic mountains, and trekking.",
    location: "Chamoli, Uttarakhand",
    city: "Chamoli",
    state: "Uttarakhand",
    coordinates: {
      lat: 30.728,
      lng: 79.605,
    },
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Jolly Grant Airport, Dehradun (DED)",
    nearestRailway: "Rishikesh Railway Station (RKSH)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Valley of Flowers",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "The Valley of Flowers is a spectacular Himalayan alpine valley known for seasonal wildflowers, dramatic mountains, and trekking.",
    leadParagraphs: [
      "The Valley of Flowers is a spectacular Himalayan alpine valley known for seasonal wildflowers, dramatic mountains, and trekking.",
      "Whether you are visiting Valley of Flowers for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Valley of Flowers",
        paragraphs: [
          "Discover Valley of Flowers and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Uttarakhand.",
        ],
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Valley of Flowers offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Valley of Flowers to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Valley of Flowers. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title:
        "Valley of Flowers: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "The Valley of Flowers is a spectacular Himalayan alpine valley known for seasonal wildflowers, dramatic mountains, and trekking.",
        "Valley of Flowers is a featured tourism destination in Uttarakhand, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Valley of Flowers",
          paragraphs: [
            "Discover Valley of Flowers and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of Uttarakhand.",
          ],
          image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Valley of Flowers offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Valley of Flowers to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Valley of Flowers. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Valley of Flowers",
        image:
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "uttarakhand-valley-of-flowers",
        _id: "6aa83b2e1b1df08547d00e3",
      },
      {
        title: "Explore Uttarakhand: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "uttarakhand-valley-of-flowers",
        _id: "6aa83b2e1b1df08547d0147",
      },
    ],
    experiences: [
      "Explore Valley of Flowers National Park",
      "Local culture and food around Valley of Flowers",
    ],
    nearbyAttractions: [
      {
        name: "Valley of Flowers National Park",
        distance: "Nearby",
        description:
          "A key attraction associated with Valley of Flowers and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01ab",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
  {
    _id: "6aa83b2e1b1df08547d0080",
    id: "west-bengal-darjeeling",
    name: "Darjeeling",
    subtitle:
      "Darjeeling is a renowned Himalayan hill station celebrated for tea gardens, mountain views, colonial heritage, and the Darjeeling Himalayan Railway.",
    location: "Darjeeling, West Bengal",
    city: "Darjeeling",
    state: "West Bengal",
    coordinates: {
      lat: 27.041,
      lng: 88.2663,
    },
    image:
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    images: [
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    ],
    timings: {
      opening: "06:00 AM",
      closing: "06:00 PM",
      display:
        "Typical visiting hours - 06:00 AM | Closing time - 06:00 PM | Verify locally",
    },
    weather: {
      tempRange: "Varies by season",
      month: "Best season varies by destination",
    },
    nearestAirport: "Bagdogra Airport (IXB)",
    nearestRailway: "New Jalpaiguri Railway Station (NJP)",
    experienceCard: {
      label: "Experience",
      title: "Travel guide - Experiences around Darjeeling",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
    },
    description:
      "Darjeeling is a renowned Himalayan hill station celebrated for tea gardens, mountain views, colonial heritage, and the Darjeeling Himalayan Railway.",
    leadParagraphs: [
      "Darjeeling is a renowned Himalayan hill station celebrated for tea gardens, mountain views, colonial heritage, and the Darjeeling Himalayan Railway.",
      "Whether you are visiting Darjeeling for the first time, planning a family trip, exploring heritage, seeking nature, or looking for memorable photographs, there is plenty to discover.",
    ],
    sections: [
      {
        title: "Explore Darjeeling",
        paragraphs: [
          "Discover Darjeeling and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of West Bengal.",
        ],
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Capture Beautiful Moments",
        paragraphs: [
          "Darjeeling offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
        ],
      },
      {
        title: "Discover Local Culture",
        paragraphs: [
          "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Darjeeling to make the visit more meaningful.",
        ],
      },
      {
        title: "Plan Your Visit",
        paragraphs: [
          "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Darjeeling. Timings and access conditions can change, so verify locally before travel.",
        ],
      },
    ],
    blog: {
      title: "Darjeeling: A Complete Guide to Exploring This Destination",
      author: "BharatDarshi Editorial Team",
      readTime: "8 min read",
      publishDate: "September 2026",
      leadParagraphs: [
        "Darjeeling is a renowned Himalayan hill station celebrated for tea gardens, mountain views, colonial heritage, and the Darjeeling Himalayan Railway.",
        "Darjeeling is a featured tourism destination in West Bengal, offering travelers a mix of experiences and local discoveries.",
      ],
      sections: [
        {
          title: "Explore Darjeeling",
          paragraphs: [
            "Discover Darjeeling and experience the landscapes, heritage, culture, and local character that make this destination a signature attraction of West Bengal.",
          ],
          image:
            "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        },
        {
          title: "Capture Beautiful Moments",
          paragraphs: [
            "Darjeeling offers memorable views and photography opportunities, from its main landmark and surrounding scenery to local streets, architecture, and natural landscapes.",
          ],
        },
        {
          title: "Discover Local Culture",
          paragraphs: [
            "Spend time exploring the traditions, food, crafts, stories, and everyday culture around Darjeeling to make the visit more meaningful.",
          ],
        },
        {
          title: "Plan Your Visit",
          paragraphs: [
            "Plan transport, local travel, weather, visitor guidelines, accommodation, and the best season before visiting Darjeeling. Timings and access conditions can change, so verify locally before travel.",
          ],
        },
      ],
    },
    relatedExperiences: [
      {
        title: "Discover the best experiences around Darjeeling",
        image:
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "west-bengal-darjeeling",
        _id: "6aa83b2e1b1df08547d00e4",
      },
      {
        title: "Explore West Bengal: culture, food and landscapes",
        image:
          "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
        targetPlaceId: "west-bengal-darjeeling",
        _id: "6aa83b2e1b1df08547d0148",
      },
    ],
    experiences: [
      "Explore Darjeeling Himalayan Railway",
      "Local culture and food around Darjeeling",
    ],
    nearbyAttractions: [
      {
        name: "Darjeeling Himalayan Railway",
        distance: "Nearby",
        description:
          "A key attraction associated with Darjeeling and an important part of the destination experience.",
        _id: "6aa83b2e1b1df08547d01c0",
      },
    ],
    __v: 0,
    createdAt: "2026-09-15T00:00:00.000Z",
    updatedAt: "2026-09-15T00:00:00.000Z",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    await Temple.deleteMany({});
    await Event.deleteMany({});
    await Hotel.deleteMany({});
    await Itinerary.deleteMany({});
    await Place.deleteMany({});

    await Temple.insertMany(initialTemples);
    await Event.insertMany(initialEvents);
    await Hotel.insertMany(initialHotels);
    await Itinerary.insertMany(initialItineraries);
    await Place.insertMany(initialPlaces);

    let adminUser = await User.findOne({ email: "admin@mahakal.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Mahakal Administrator",
        email: "admin@mahakal.com",
        password: "admin123",
        role: "official",
        isApproved: true,
      });
      console.log("Seeded Mahakal Admin user: admin@mahakal.com / admin123");
    }

    console.log(
      "Successfully seeded all Mahakal Temple data directly into MongoDB!",
    );
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error("Error Seeding MongoDB:", err);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
