import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Hotel,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  CreditCard,
  Lock,
  Search,
  CheckCircle2,
  User,
  Users,
  Building2,
  X,
  Heart,
  SlidersHorizontal,
  Award,
  Headphones,
  Gift,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Filter,
  LocateFixed,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RazorpayModal } from "../components/RazorpayModal";
import { toast } from "react-hot-toast";
import { recordRoomBooking } from "../utils/bookingStats";

// ─── COMPREHENSIVE INDIAN STATES & CITIES MAPPING ────────────────────────────
const INDIAN_STATES_CITIES = {
  Goa: [
    "Panaji",
    "North Goa",
    "South Goa",
    "Calangute",
    "Candolim",
    "Baga",
    "Anjuna",
  ],
  "Madhya Pradesh": [
    "Ujjain",
    "Bhopal",
    "Indore",
    "Gwalior",
    "Khajuraho",
    "Jabalpur",
  ],
  Rajasthan: [
    "Jaipur",
    "Udaipur",
    "Jodhpur",
    "Jaisalmer",
    "Pushkar",
    "Sawai Madhopur",
  ],
  "Uttar Pradesh": [
    "Varanasi",
    "Agra",
    "Mathura",
    "Ayodhya",
    "Lucknow",
    "Prayagraj",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nashik",
    "Shirdi",
    "Mahabaleshwar",
    "Aurangabad",
  ],
  Delhi: ["New Delhi"],
  Karnataka: ["Bengaluru", "Mysuru", "Hampi", "Coorg", "Gokarna"],
  "Tamil Nadu": ["Chennai", "Madurai", "Rameswaram", "Ooty", "Kanyakumari"],
  Kerala: ["Kochi", "Munnar", "Alleppey", "Kovalam", "Wayanad"],
  "Himachal Pradesh": [
    "Shimla",
    "Manali",
    "Dharamshala",
    "Spiti Valley",
    "Kasauli",
  ],
  Uttarakhand: ["Rishikesh", "Haridwar", "Dehradun", "Nainital", "Mussoorie"],
  "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Digha"],
  Gujarat: ["Ahmedabad", "Kutch", "Kevadia", "Dwarka", "Somnath"],
  Sikkim: ["Gangtok", "Pelling", "Ravangla"],
  Ladakh: ["Leh", "Nubra Valley", "Pangong Tso"],
};

// Helper: Extract state from location string
function extractState(locationStr = "") {
  if (!locationStr) return "Madhya Pradesh";
  const states = Object.keys(INDIAN_STATES_CITIES);
  for (const st of states) {
    if (locationStr.toLowerCase().includes(st.toLowerCase())) return st;
  }
  return "Madhya Pradesh";
}

// Helper: Extract city from location string
function extractCity(locationStr = "") {
  if (!locationStr) return "Ujjain";
  const states = Object.keys(INDIAN_STATES_CITIES);
  for (const st of states) {
    const cities = INDIAN_STATES_CITIES[st];
    for (const ct of cities) {
      if (locationStr.toLowerCase().includes(ct.toLowerCase())) return ct;
    }
  }
  return "Ujjain";
}

// ─── RICH LOCAL HOMESTAYS & VILLAGE STAYS DATA ───────────────────────────────
const LOCAL_STAYS_DATA = [
  {
    id: "local-stay-1",
    _id: "local-stay-1",
    name: "Sikkimese Traditional Heritage Homestay",
    state: "Sikkim",
    city: "Gangtok",
    location: "Upper Burtuk, Gangtok, Sikkim 737101",
    phone: "+91 98320 12345",
    rating: 4.9,
    reviewsCount: 210,
    pricePerNight: 1299,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    badge: "🏡 Traditional Wooden Homestay",
    roomType: "Deluxe Wooden Attic Room",
    amenities: [
      "Home-cooked Meals",
      "Free Wi-Fi",
      "Kanchenjunga View",
      "Local Organic Tea",
      "Bonfire",
    ],
    description:
      "Nestled amidst lush green hills of Gangtok, stay with a welcoming Bhutia family in a traditional wooden home enjoying fresh organic farm-to-table meals and panoramic views of Kanchenjunga.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
  {
    id: "local-stay-2",
    _id: "local-stay-2",
    name: "Pelling Organic Farmstay & Eco Cottage",
    state: "Sikkim",
    city: "Pelling",
    location: "Lower Pelling Village, West Sikkim 737113",
    phone: "+91 98320 67890",
    rating: 4.85,
    reviewsCount: 165,
    pricePerNight: 1499,
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=800",
    badge: "🌱 Rural Village Farmstay",
    roomType: "Organic Farm View Suite",
    amenities: [
      "Farm-Fresh Dining",
      "Mountain Trek Guide",
      "Free Wi-Fi",
      "Campfire",
      "Pet Friendly",
    ],
    description:
      "Experience serene village life in an authentic wooden hut surrounded by cardamom plantations, pine forests, and home-brewed local beverages served by host Dorjee and family.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
  {
    id: "local-stay-3",
    _id: "local-stay-3",
    name: "Mahakal Corridor Heritage Courtyard Stay",
    state: "Madhya Pradesh",
    city: "Ujjain",
    location: "Near Mahakal Corridor & Kshipra Ghat, Ujjain, MP",
    phone: "+91 94250 11223",
    rating: 4.92,
    reviewsCount: 280,
    pricePerNight: 1199,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    badge: "🔱 Sacred Heritage Courtyard",
    roomType: "Spiritual Courtyard Room",
    amenities: [
      "Pure Veg Satvik Meals",
      "5 Mins to Temple",
      "Free Wi-Fi",
      "24/7 Hot Water",
      "Temple Tour Guide",
    ],
    description:
      "A peaceful traditional Indian courtyard residence with red clay tiles and carved wooden doors situated steps away from Mahakaleshwar Temple with home-cooked Satvik food and local family hospitality.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
  {
    id: "local-stay-4",
    _id: "local-stay-4",
    name: "Pink City Royal Haveli Local Homestay",
    state: "Rajasthan",
    city: "Jaipur",
    location: "Amer Fort Road, Jaipur, Rajasthan 302002",
    phone: "+91 98290 55443",
    rating: 4.88,
    reviewsCount: 195,
    pricePerNight: 1799,
    image:
      "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&q=80&w=800",
    badge: "👑 Authentic Local Haveli",
    roomType: "Jharokha Heritage Suite",
    amenities: [
      "Rajasthani Thali",
      "Rooftop Fort View",
      "Free Wi-Fi",
      "Folk Music Evenings",
      "AC Rooms",
    ],
    description:
      "Stay in an authentic 120-year-old Rajasthani Haveli with Jharokha archways managed by local hosts offering homemade Dal Baati Churma, rooftop views of Nahargarh, and evening folk music.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
  {
    id: "local-stay-5",
    _id: "local-stay-5",
    name: "Ladakhi Stone & Mud Village Homestay",
    state: "Ladakh",
    city: "Leh",
    location: "Upper Changspa Village, Leh, Ladakh 194101",
    phone: "+91 94191 77889",
    rating: 4.95,
    reviewsCount: 140,
    pricePerNight: 1599,
    image:
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800",
    badge: "🏔️ Himalayan Village Home",
    roomType: "Traditional Heated Wooden Room",
    amenities: [
      "Authentic Thukpa & Momos",
      "Bukhari Heating",
      "Free Wi-Fi",
      "Stargazing Terrace",
      "Airport Pickup",
    ],
    description:
      "Immerse yourself in authentic Ladakhi culture inside a stone & timber mud-plastered village home featuring prayer flags, home-cooked Thukpa, butter tea, and starry mountain night views.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
  {
    id: "local-stay-6",
    _id: "local-stay-6",
    name: "Varanasi Ganges Alleyway Local Stay",
    state: "Uttar Pradesh",
    city: "Varanasi",
    location: "Assi Ghat Alleyways, Varanasi, UP 221005",
    phone: "+91 94152 33445",
    rating: 4.87,
    reviewsCount: 230,
    pricePerNight: 1099,
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&q=80&w=800",
    badge: "🌊 Riverside Heritage Alley Stay",
    roomType: "River View Balcony Room",
    amenities: [
      "Assi Ghat Sunrise View",
      "Morning Banarasi Tea",
      "Free Wi-Fi",
      "Boat Ride Help",
      "Air Conditioned",
    ],
    description:
      "Charming alleyway family stay with warm wooden interiors just 2 minutes from Assi Ghat. Enjoy morning Shehnai melodies, homemade Banarasi breakfast, and rooftop Ganges sunrise views.",
    isFreeCancellation: true,
    hasBreakfast: true,
    hasWifi: true,
    hasPool: false,
    isLocalStay: true,
  },
];

export function Hotels({ user, onOpenAuth }) {
  const navigate = useNavigate();

  // MongoDB Fetched Data State & Stay Category ("Hotels" | "Local Stays")
  const [hotelsList, setHotelsList] = useState([]);
  const [stayCategory, setStayCategory] = useState("Hotels");
  const [loading, setLoading] = useState(true);

  // Search Bar States & Location Auto-Detection
  const [selectedDestination, setSelectedDestination] = useState("All");
  const [customDestinations, setCustomDestinations] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
  );
  const [guestsCount, setGuestsCount] = useState("2 Adults, 1 Room");
  const [showSearchForm, setShowSearchForm] = useState(true);

  // Handle Device Location Auto Detection with IP Fallback
  const handleDetectLocation = () => {
    setIsLocating(true);
    toast.loading("Detecting your current location...", { id: "geo-toast-hotel" });

    const fetchIpLocation = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/", { timeout: 4000 });
        if (res.data && (res.data.city || res.data.region)) {
          const locName = res.data.city || res.data.region;

          setCustomDestinations((prev) =>
            prev.includes(locName) ? prev : [locName, ...prev]
          );
          setSelectedDestination(locName);
          toast.success(`Location set to: ${locName}`, { id: "geo-toast-hotel" });
          return true;
        }
      } catch (e1) {
        try {
          const res2 = await axios.get("https://ip-api.com/json/?fields=city,regionName,country", { timeout: 4000 });
          if (res2.data && res2.data.city) {
            const locName = res2.data.city;
            setCustomDestinations((prev) =>
              prev.includes(locName) ? prev : [locName, ...prev]
            );
            setSelectedDestination(locName);
            toast.success(`Location set to: ${locName}`, { id: "geo-toast-hotel" });
            return true;
          }
        } catch (e2) {
          console.error("IP Geolocation error:", e2);
        }
      }
      return false;
    };

    if (!navigator.geolocation) {
      fetchIpLocation().then((success) => {
        setIsLocating(false);
        if (!success) {
          toast.error("Location unavailable. Please select your city manually.", { id: "geo-toast-hotel" });
        }
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { timeout: 5000 }
          );
          const address = response.data?.address;
          const locationName =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.suburb ||
            address?.county ||
            "My Location";

          setCustomDestinations((prev) =>
            prev.includes(locationName) ? prev : [locationName, ...prev]
          );
          setSelectedDestination(locationName);
          toast.success(`Location set to: ${locationName}`, { id: "geo-toast-hotel" });
        } catch (err) {
          console.error("Reverse geocoding error, trying IP location:", err);
          const success = await fetchIpLocation();
          if (!success) {
            const fallbackLoc = `GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
            setCustomDestinations((prev) =>
              prev.includes(fallbackLoc) ? prev : [fallbackLoc, ...prev]
            );
            setSelectedDestination(fallbackLoc);
            toast.success("Set to GPS location", { id: "geo-toast-hotel" });
          }
        } finally {
          setIsLocating(false);
        }
      },
      async (error) => {
        console.warn("Browser geolocation failed or blocked, switching to IP location...", error);
        const success = await fetchIpLocation();
        setIsLocating(false);
        if (!success) {
          toast.error("Location unavailable. Please select your city manually.", { id: "geo-toast-hotel" });
        }
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  // Filters State
  const [priceMax, setPriceMax] = useState(15000);
  const [popularFilters, setPopularFilters] = useState({
    freeCancellation: false,
    breakfastIncluded: false,
    pool: false,
    freeWifi: false,
    beachfront: false,
    parking: false,
  });
  const [starRatingFilter, setStarRatingFilter] = useState([]); // Array of selected stars, e.g. [5, 4]
  const [guestRatingFilter, setGuestRatingFilter] = useState([]); // Array of selected guest ratings, e.g. [4.5, 4.0]
  const [sortBy, setSortBy] = useState("Recommended");

  // Wishlist State
  const [wishlist, setWishlist] = useState({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 4;

  // Room Booking Modal States
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [nights, setNights] = useState(3);
  const [guestPhone, setGuestPhone] = useState("");
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");

  // Razorpay & Success States
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestName(user.name || "");
      setGuestEmail(user.email || "");
    } else {
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    }
  }, [user, selectedHotel]);

  // FETCH ALL HOTEL DATA EXCLUSIVELY FROM MONGODB BACKEND
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchHotelsFromBackend() {
      try {
        setLoading(true);
        const [hotelsRes, roomsRes] = await Promise.all([
          axios.get("/api/hotels").catch(() => ({ data: [] })),
          axios.get("/api/rooms/available").catch(() => ({ data: [] })),
        ]);

        const mongoHotels = Array.isArray(hotelsRes.data) ? hotelsRes.data : [];
        const mongoRooms = Array.isArray(roomsRes.data) ? roomsRes.data : [];

        const combined = [
          ...mongoHotels.map((h, idx) => ({
            id: h._id || h.id || `hotel-${idx}`,
            _id: h._id || h.id,
            name: h.name,
            state: h.state || extractState(h.location),
            city: h.city || extractCity(h.location),
            location: h.location,
            phone: h.phone || "+91 98765 43210",
            rating: h.rating || 4.6,
            reviewsCount: 120 + ((idx * 97) % 450),
            pricePerNight: h.pricePerNight || 2499,
            image:
              h.image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
            badge: h.badge || "Free Cancellation",
            roomType:
              Array.isArray(h.roomTypes) && h.roomTypes[0]
                ? h.roomTypes[0]
                : "Deluxe AC Room",
            amenities:
              h.amenities && h.amenities.length > 0
                ? h.amenities
                : ["Free Wi-Fi", "Pool", "Breakfast"],
            isFreeCancellation: true,
            hasBreakfast: true,
            hasWifi: true,
            hasPool: true,
            isMongoHotel: true,
          })),
          ...mongoRooms.map((r, idx) => ({
            id: r._id || `room-${idx}`,
            _id: r._id,
            name: r.hotelName || "Partner Verified Hotel",
            state: r.state || extractState(r.location),
            city: r.city || extractCity(r.location),
            location: r.location || "Central District",
            phone: r.phone || "+91 98765 43210",
            rating: r.rating || 4.8,
            reviewsCount: 85 + ((idx * 63) % 300),
            pricePerNight: r.pricePerNight || 1499,
            image:
              r.images && r.images[0]
                ? r.images[0]
                : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            badge: r.badge || "Verified Partner",
            roomType: r.roomType || "Deluxe Room",
            amenities:
              r.amenities && r.amenities.length > 0
                ? r.amenities
                : ["Free Wi-Fi", "24/7 Water"],
            isFreeCancellation: true,
            hasBreakfast: false,
            hasWifi: true,
            hasPool: false,
            isApiRoom: true,
            originalRoom: r,
          })),
        ];

        setHotelsList(combined);
      } catch (err) {
        console.error("Failed to fetch hotels from MongoDB backend:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelsFromBackend();
  }, []);

  // Update nights calculation
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 1);
    }
  }, [checkInDate, checkOutDate]);

  // Toggle Wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Recommendation Places dynamic mapping directly from fetched MongoDB hotels dataset
  const popularDestinations = useMemo(() => {
    if (!hotelsList || hotelsList.length === 0) {
      return [
        {
          name: "Agra",
          image:
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600",
          minPrice: 3500,
        },
        {
          name: "Mumbai",
          image:
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600",
          minPrice: 4999,
        },
        {
          name: "Shirdi",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600",
          minPrice: 1800,
        },
        {
          name: "Goa",
          image:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=600",
          minPrice: 1999,
        },
        {
          name: "Ujjain",
          image:
            "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=600",
          minPrice: 1499,
        },
      ];
    }

    const placeMap = {};
    hotelsList.forEach((hotel) => {
      const placeName =
        hotel.city ||
        extractCity(hotel.location) ||
        hotel.state ||
        "Destination";
      if (!placeName) return;

      if (!placeMap[placeName]) {
        placeMap[placeName] = {
          name: placeName,
          image:
            hotel.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
          minPrice: hotel.pricePerNight || 1999,
          count: 1,
          rating: hotel.rating || 4.5,
        };
      } else {
        placeMap[placeName].count += 1;
        if (
          hotel.pricePerNight &&
          hotel.pricePerNight < placeMap[placeName].minPrice
        ) {
          placeMap[placeName].minPrice = hotel.pricePerNight;
        }
        if (hotel.rating && hotel.rating > placeMap[placeName].rating) {
          placeMap[placeName].rating = hotel.rating;
          if (hotel.image) placeMap[placeName].image = hotel.image;
        }
      }
    });

    const list = Object.values(placeMap);
    list.sort((a, b) => b.count - a.count || a.minPrice - b.minPrice);
    return list.slice(0, 5);
  }, [hotelsList]);

  const displayedSource = useMemo(() => {
    return stayCategory === "Hotels" ? hotelsList : LOCAL_STAYS_DATA;
  }, [stayCategory, hotelsList]);

  // Filter backend hotels / local stays based on all interactive criteria
  const filteredHotels = useMemo(() => {
    let result = displayedSource.filter((hotel) => {
      // Destination filter
      if (selectedDestination !== "All") {
        const destLower = selectedDestination.toLowerCase();
        const matchesDest =
          hotel.city?.toLowerCase().includes(destLower) ||
          hotel.state?.toLowerCase().includes(destLower) ||
          hotel.location?.toLowerCase().includes(destLower);
        if (!matchesDest) return false;
      }

      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          hotel.name.toLowerCase().includes(term) ||
          hotel.location.toLowerCase().includes(term) ||
          hotel.city?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Price filter
      if (hotel.pricePerNight > priceMax) return false;

      // Popular filter checkboxes
      if (popularFilters.freeCancellation && !hotel.isFreeCancellation)
        return false;
      if (
        popularFilters.breakfastIncluded &&
        !hotel.amenities.some((a) => a.toLowerCase().includes("breakfast"))
      )
        return false;
      if (
        popularFilters.pool &&
        !hotel.amenities.some((a) => a.toLowerCase().includes("pool"))
      )
        return false;
      if (
        popularFilters.freeWifi &&
        !hotel.amenities.some(
          (a) =>
            a.toLowerCase().includes("wi-fi") ||
            a.toLowerCase().includes("wifi"),
        )
      )
        return false;
      if (
        popularFilters.parking &&
        !hotel.amenities.some((a) => a.toLowerCase().includes("parking"))
      )
        return false;

      // Star rating filter (Multi-select)
      if (Array.isArray(starRatingFilter) && starRatingFilter.length > 0) {
        const hRating = Math.floor(hotel.rating || 4);
        if (!starRatingFilter.includes(hRating)) return false;
      } else if (typeof starRatingFilter === "number") {
        const hRating = Math.floor(hotel.rating || 4);
        if (hRating !== starRatingFilter) return false;
      }

      // Guest rating filter (Multi-select)
      if (Array.isArray(guestRatingFilter) && guestRatingFilter.length > 0) {
        const hRating = hotel.rating || 4.5;
        const matchesAny = guestRatingFilter.some((minR) => hRating >= minR);
        if (!matchesAny) return false;
      } else if (typeof guestRatingFilter === "number") {
        if ((hotel.rating || 4.5) < guestRatingFilter) return false;
      }

      return true;
    });

    // Sorting logic
    if (sortBy === "PriceLowHigh") {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === "PriceHighLow") {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    displayedSource,
    selectedDestination,
    searchTerm,
    priceMax,
    popularFilters,
    starRatingFilter,
    guestRatingFilter,
    sortBy,
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedDestination("All");
    setSearchTerm("");
    setPriceMax(25000);
    setPopularFilters({
      freeCancellation: false,
      breakfastIncluded: false,
      pool: false,
      freeWifi: false,
      beachfront: false,
      parking: false,
    });
    setStarRatingFilter([]);
    setGuestRatingFilter([]);
    setSortBy("Recommended");
    setCurrentPage(1);
    setShowSearchForm(true);
  };

  // Perform search and collapse search box to show results
  const handlePerformSearch = () => {
    setCurrentPage(1);
    setShowSearchForm(false);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage) || 1;
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * hotelsPerPage;
    return filteredHotels.slice(start, start + hotelsPerPage);
  }, [filteredHotels, currentPage]);

  // Step 1: Navigate to dedicated Hotel Details Route (/hotel/:id)
  const handleOpenBookingModal = (hotel) => {
    navigate(`/hotel/${hotel.id || hotel._id}`, { state: { hotel } });
  };

  // Step 2: Form submit -> Navigate to dedicated Payment Page (/payment)
  const handleProceedToRazorpay = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a hotel room.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates.");
      return;
    }
    if (!guestPhone || guestPhone.trim().length < 8) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    navigate("/payment", {
      state: {
        hotel: selectedHotel,
        checkInDate,
        checkOutDate,
        nights,
        guestsCount,
        guestName: guestName || user?.name || "Guest",
        guestPhone,
        finalTotalPayment: (selectedHotel?.pricePerNight || 2000) * nights,
        basePriceTotal: (selectedHotel?.pricePerNight || 2000) * nights,
        discountAmount: 0,
        addOnsTotal: 0,
        serviceFee: 0,
      },
    });
  };

  // Step 3: Razorpay Payment Success -> Save Booking to MongoDB & Issue Account E-Ticket
  const handlePaymentSuccess = async (paymentDetails) => {
    setIsRazorpayOpen(false);
    setLoadingBooking(true);

    const totalPrice = (selectedHotel.pricePerNight || 2000) * nights;
    const ticketCode = `BHARAT-STAY-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;

    try {
      if (selectedHotel.isApiRoom && selectedHotel._id) {
        await axios.post(`/api/rooms/book/${selectedHotel._id}`, {
          checkInDate,
          checkOutDate,
          nights,
          guestPhone,
          paymentId: paymentDetails.paymentId,
        });
      } else {
        await axios.post("/api/hotels/book", {
          hotelId: selectedHotel.id || selectedHotel._id,
          roomType: selectedHotel.roomType,
          nights,
          checkInDate,
          guestName: guestName || user?.name,
          paymentId: paymentDetails.paymentId,
        });
      }
    } catch (err) {
      console.warn("Backend hotel booking submission:", err.message);
    } finally {
      setLoadingBooking(false);
    }

    // Refresh analytics & user profile tickets
    recordRoomBooking(selectedHotel.name);
    window.dispatchEvent(new Event("mahakal-booking-success"));
    window.dispatchEvent(new Event("bharat_darshi_booking_success"));
    window.dispatchEvent(new Event("india_booking_success"));

    setBookingSuccessTicket({
      ticketCode,
      paymentId: paymentDetails.paymentId,
      hotelName: selectedHotel.name,
      roomType: selectedHotel.roomType || "Deluxe Room",
      location: selectedHotel.location,
      checkInDate,
      checkOutDate,
      nights,
      guestName: guestName || user?.name,
      guestPhone,
      totalPrice,
    });

    setSelectedHotel(null);
    toast.success(
      `Booking Confirmed! E-Ticket issued for ${selectedHotel.name}! 🏨`,
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#f7f6f0",
        minHeight: "100vh",
        paddingTop: "90px",
        paddingBottom: "60px",
        color: "#1a1a1e",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="container-fluid px-xl-5 px-lg-4 px-md-3 px-3">
        {/* ─── SPLIT DASHBOARD LAYOUT WITH SPACIOUS BORDER PADDING ─── */}
        <div className="row g-4">
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* LEFT SIDE PANEL (HERO SEARCH + SEARCHED HOTELS / AVAILABLE STAYS) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="col-xl-8 col-lg-7 col-12 d-flex flex-column gap-4">
            {/* 1. HERO BANNER OR COMPACT TOP SUMMARY BAR */}
            {showSearchForm ? (
              <div className="position-relative mb-2">
                <div
                  className="position-relative rounded-4 overflow-hidden shadow-md"
                  style={{
                    height: "360px",
                    backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.8) 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    padding: "2.5rem 3rem",
                  }}
                >
                  <div className="max-w-550 text-white mb-4">
                    <span
                      className="badge px-3.5 py-2 rounded-pill mb-3 fw-semibold shadow-sm"
                      style={{
                        backgroundColor: "#f59e0b",
                        color: "#000",
                        fontSize: "0.82rem",
                      }}
                    >
                      Find Your Perfect
                    </span>
                    <h1
                      className="display-5 fw-extrabold mb-3 force-white-text"
                      style={{
                        letterSpacing: "-0.5px",
                        lineHeight: "1.2",
                        color: "#ffffff",
                      }}
                    >
                      Stay Experience
                    </h1>
                    <p
                      className="fs-6 mb-0 lh-relaxed force-white-text"
                      style={{ color: "#ffffff" }}
                    >
                      Discover and book amazing verified hotels at the best
                      prices worldwide.
                    </p>
                  </div>
                </div>

                {/* Floating Search Bar */}
                <div
                  className="position-relative mx-auto rounded-4 p-4 shadow-xl bg-white border"
                  style={{
                    marginTop: "-55px",
                    maxWidth: "96%",
                    zIndex: 20,
                    borderColor: "rgba(245, 158, 11, 0.35)",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="row g-3 align-items-center">
                    {/* Destination */}
                    <div className="col-md-6 col-12">
                      <label
                        className="form-label text-dark fw-bold mb-1"
                        style={{ fontSize: "0.84rem" }}
                      >
                        Destination
                      </label>

                      <div className="d-flex align-items-center gap-2">
                        <div className="position-relative flex-grow-1">
                          <MapPin
                            size={17}
                            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                            style={{ zIndex: 5 }}
                          />
                          <select
                            className="form-select ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                            value={selectedDestination}
                            onChange={(e) => {
                              if (e.target.value === "AUTO_DETECT") {
                                handleDetectLocation();
                              } else {
                                setSelectedDestination(e.target.value);
                              }
                            }}
                            style={{
                              fontSize: "0.88rem",
                              height: "44px",
                              borderRadius: "10px",
                            }}
                          >
                            <option value="All">All Places</option>
                            <option value="AUTO_DETECT">
                              Auto-Detect My Location
                            </option>

                            {/* Custom detected location options */}
                            {customDestinations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}

                            {Object.keys(INDIAN_STATES_CITIES).map((st) => (
                              <optgroup key={st} label={st}>
                                {INDIAN_STATES_CITIES[st].map((ct) => (
                                  <option key={ct} value={ct}>
                                    {ct}, {st}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        </div>

                        {/* Location Icon Button OUTSIDE of the input box */}
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={isLocating}
                          className="btn btn-warning rounded-3 p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm hover-scale"
                          title="Auto-detect my location"
                          style={{
                            backgroundColor: "#facc15",
                            borderColor: "#facc15",
                            color: "#000000",
                            height: "44px",
                            width: "44px",
                            borderRadius: "10px",
                          }}
                        >
                          {isLocating ? (
                            <span
                              className="spinner-border spinner-border-sm text-dark"
                              role="status"
                              style={{ width: 14, height: 14 }}
                            />
                          ) : (
                            <LocateFixed size={18} className="text-dark" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Check-in */}
                    <div className="col-md-6 col-12">
                      <label
                        className="form-label text-dark fw-bold mb-1"
                        style={{ fontSize: "0.84rem" }}
                      >
                        Check-in
                      </label>
                      <div className="position-relative">
                        <Calendar
                          size={17}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                          style={{ zIndex: 5 }}
                        />
                        <input
                          type="date"
                          className="form-control ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          style={{
                            fontSize: "0.88rem",
                            height: "44px",
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                    </div>

                    {/* Check-out */}
                    <div className="col-md-6 col-12">
                      <label
                        className="form-label text-dark fw-bold mb-1"
                        style={{ fontSize: "0.84rem" }}
                      >
                        Check-out
                      </label>
                      <div className="position-relative">
                        <Calendar
                          size={17}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                          style={{ zIndex: 5 }}
                        />
                        <input
                          type="date"
                          className="form-control ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          style={{
                            fontSize: "0.88rem",
                            height: "44px",
                            borderRadius: "10px",
                          }}
                        />
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="col-md-6 col-12">
                      <label
                        className="form-label text-dark fw-bold mb-1"
                        style={{ fontSize: "0.84rem" }}
                      >
                        Guests
                      </label>
                      <div className="position-relative">
                        <Users
                          size={17}
                          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                          style={{ zIndex: 5 }}
                        />
                        <select
                          className="form-select ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(e.target.value)}
                          style={{
                            fontSize: "0.88rem",
                            height: "44px",
                            borderRadius: "10px",
                          }}
                        >
                          <option value="1 Adult, 1 Room">1 Adult, 1 Room</option>
                          <option value="2 Adults, 1 Room">2 Adults, 1 Room</option>
                          <option value="2 Adults, 2 Rooms">
                            2 Adults, 2 Rooms
                          </option>
                          <option value="3 Adults, 2 Rooms">
                            3 Adults, 2 Rooms
                          </option>
                          <option value="4 Adults, 2 Rooms">
                            4 Adults, 2 Rooms
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="col-12 mt-2.5">
                      <button
                        type="button"
                        onClick={handlePerformSearch}
                        className="btn w-100 py-3 px-4 rounded-3 text-white fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          border: "none",
                          fontSize: "0.95rem",
                        }}
                      >
                        <Search size={18} />
                        <span>Search Hotels</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="position-relative mb-4">
                <div
                  className="rounded-4 p-4 px-4.5 shadow-sm bg-white border d-flex flex-wrap align-items-center justify-content-between gap-3.5"
                  style={{
                    borderColor: "rgba(245, 158, 11, 0.35)",
                    boxShadow:
                      "0 10px 20px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <div className="d-flex flex-wrap align-items-center gap-3 gap-md-3.5">
                    {/* Destination Pill */}
                    <div className="d-flex align-items-center gap-3 p-2.5 px-3.5 rounded-3 bg-light">
                      <div
                        className="p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#d97706",
                          width: "36px",
                          height: "36px",
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <small
                          className="text-muted fw-bold text-uppercase d-block"
                          style={{
                            fontSize: "0.64rem",
                            letterSpacing: "0.5px",
                            color: "#64748b",
                          }}
                        >
                          Destination
                        </small>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.88rem" }}
                        >
                          {selectedDestination === "All"
                            ? "All Places"
                            : selectedDestination}
                        </span>
                      </div>
                    </div>

                    {/* Dates Pill */}
                    <div className="d-flex align-items-center gap-3 p-2.5 px-3.5 rounded-3 bg-light">
                      <div
                        className="p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#d97706",
                          width: "36px",
                          height: "36px",
                        }}
                      >
                        <Calendar size={18} />
                      </div>
                      <div>
                        <small
                          className="text-muted fw-bold text-uppercase d-block"
                          style={{
                            fontSize: "0.64rem",
                            letterSpacing: "0.5px",
                            color: "#64748b",
                          }}
                        >
                          Dates
                        </small>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.88rem" }}
                        >
                          {checkInDate} to {checkOutDate}
                        </span>
                      </div>
                    </div>

                    {/* Guests Pill */}
                    <div className="d-flex align-items-center gap-3 p-2.5 px-3.5 rounded-3 bg-light">
                      <div
                        className="p-2 rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#fef3c7",
                          color: "#d97706",
                          width: "36px",
                          height: "36px",
                        }}
                      >
                        <User size={18} />
                      </div>
                      <div>
                        <small
                          className="text-muted fw-bold text-uppercase d-block"
                          style={{
                            fontSize: "0.64rem",
                            letterSpacing: "0.5px",
                            color: "#64748b",
                          }}
                        >
                          Guests
                        </small>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "0.88rem" }}
                        >
                          {guestsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSearchForm(true)}
                    className="btn px-4 py-2.5 rounded-3 fw-bold d-flex align-items-center gap-2 text-white shadow-sm ms-auto"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      border: "none",
                      fontSize: "0.86rem",
                    }}
                  >
                    <SlidersHorizontal size={15} />
                    <span>Modify Search ✏️</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. SEARCHED HOTELS / AVAILABLE STAYS RESULTS SECTION */}
            <div
              id="hotel-results-section"
              className="bg-white rounded-4 p-4 shadow-sm border"
            >
              {/* Category Selector Tabs: Hotels vs Local Stays */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 p-2 bg-light rounded-4 border">
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStayCategory("Hotels");
                      setCurrentPage(1);
                    }}
                    className={`btn px-3.5 py-2 rounded-3 fw-bold transition-all d-flex align-items-center gap-2 ${
                      stayCategory === "Hotels"
                        ? "btn-warning text-dark shadow-sm"
                        : "btn-white text-secondary border bg-white"
                    }`}
                    style={{
                      backgroundColor:
                        stayCategory === "Hotels" ? "#facc15" : "#ffffff",
                      borderColor:
                        stayCategory === "Hotels" ? "#facc15" : "#e2e8f0",
                      fontSize: "0.88rem",
                    }}
                  >
                    <Building2 size={17} />
                    <span>Verified Hotels ({hotelsList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStayCategory("Local Stays");
                      setCurrentPage(1);
                    }}
                    className={`btn px-3.5 py-2 rounded-3 fw-bold transition-all d-flex align-items-center gap-2 ${
                      stayCategory === "Local Stays"
                        ? "btn-warning text-dark shadow-sm"
                        : "btn-white text-secondary border bg-white"
                    }`}
                    style={{
                      backgroundColor:
                        stayCategory === "Local Stays" ? "#facc15" : "#ffffff",
                      borderColor:
                        stayCategory === "Local Stays" ? "#facc15" : "#e2e8f0",
                      fontSize: "0.88rem",
                    }}
                  >
                    <Heart size={17} className="text-danger" />
                    <span>Local Stays ({LOCAL_STAYS_DATA.length})</span>
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted fw-semibold" style={{ fontSize: "0.8rem" }}>Sort by:</small>
                  <select
                    className="form-select form-select-sm border bg-white fw-bold text-dark shadow-none cursor-pointer p-2 px-3 rounded-3"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: "160px", fontSize: "0.82rem" }}
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="PriceLowHigh">Price: Low-High</option>
                    <option value="PriceHighLow">Price: High-Low</option>
                    <option value="Rating">Rating</option>
                  </select>
                </div>
              </div>

              {/* Title & Property Count Bar */}
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 px-1">
                <div>
                  <h5 className="fw-bold mb-1 text-dark">
                    {stayCategory === "Hotels" ? "Available Hotels" : "Local Stays & Homestays"}
                  </h5>
                  <small className="text-muted" style={{ fontSize: "0.82rem" }}>
                    Showing {filteredHotels.length} verified properties
                  </small>
                </div>
              </div>

              {/* Hotel Cards List */}
              {loading ? (
                <div className="text-center py-5 bg-light rounded-4 border p-4">
                  <div
                    className="spinner-border spinner-border-sm mb-2"
                    style={{ color: "#f59e0b" }}
                    role="status"
                  />
                  <p className="small text-muted mb-0">Loading Stays...</p>
                </div>
              ) : paginatedHotels.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4 border p-4">
                  <h6 className="fw-bold text-dark mb-2">No Stays Found</h6>
                  <p className="small text-muted mb-3">
                    No hotels matched your selected criteria
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-sm text-white fw-bold px-4 py-2.5 rounded-3 shadow-sm"
                    style={{ backgroundColor: "#d97706" }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {paginatedHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="bg-white rounded-4 overflow-hidden border shadow-sm hover-lift transition-all"
                      style={{ border: "1px solid rgba(0,0,0,0.08)" }}
                    >
                      <div className="row g-0">
                        {/* Image */}
                        <div
                          className="col-md-5 col-12 position-relative"
                          style={{ minHeight: "200px" }}
                        >
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                          <button
                            onClick={() => toggleWishlist(hotel.id)}
                            className="btn position-absolute top-0 start-0 m-3 p-2 rounded-circle bg-white shadow-sm border-0 d-flex align-items-center justify-content-center"
                            style={{ zIndex: 10 }}
                          >
                            <Heart
                              size={16}
                              fill={wishlist[hotel.id] ? "#ef4444" : "none"}
                              color={wishlist[hotel.id] ? "#ef4444" : "#6b7280"}
                            />
                          </button>
                        </div>

                        {/* Content with Generous 24px Padding (p-4) */}
                        <div className="col-md-7 col-12 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                              <h5
                                className="fw-bold mb-0 text-dark"
                                style={{
                                  fontSize: "1.08rem",
                                  lineHeight: "1.3",
                                }}
                              >
                                {hotel.name}
                              </h5>
                              <div
                                className="d-flex align-items-center gap-1.5 px-3 py-1 rounded-pill text-white fw-bold flex-shrink-0"
                                style={{
                                  backgroundColor: "#0f172a",
                                  fontSize: "0.78rem",
                                }}
                              >
                                <Star
                                  size={13}
                                  fill="#f59e0b"
                                  color="#f59e0b"
                                />
                                <span>{hotel.rating}</span>
                              </div>
                            </div>

                            <small
                              className="text-muted d-block mb-3"
                              style={{ fontSize: "0.82rem" }}
                            >
                              <MapPin
                                size={14}
                                className="me-1.5"
                                style={{ color: "#d97706" }}
                              />
                              {hotel.location}
                            </small>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {hotel.amenities.slice(0, 4).map((a, i) => (
                                <span
                                  key={i}
                                  className="badge bg-light text-secondary border px-2.5 py-1.5 rounded-pill fw-normal"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  ✓ {a}
                                </span>
                              ))}
                            </div>

                            {hotel.badge && (
                              <span
                                className="badge px-3 py-1.5 rounded-pill text-warning bg-amber-50"
                                style={{
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                  fontSize: "0.75rem",
                                }}
                              >
                                {hotel.badge}
                              </span>
                            )}
                          </div>

                          <div className="d-flex align-items-center justify-content-between pt-2 mt-3">
                            <div>
                              <span
                                className="fw-bold text-dark font-mono"
                                style={{ fontSize: "1.18rem" }}
                              >
                                ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                              </span>
                              <small
                                className="text-muted ms-1"
                                style={{ fontSize: "0.78rem" }}
                              >
                                / night
                              </small>
                            </div>

                            <button
                              onClick={() => handleOpenBookingModal(hotel)}
                              className="btn btn-sm text-white fw-bold px-4 py-2.5 rounded-3 shadow-sm"
                              style={{
                                background:
                                  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                border: "none",
                                fontSize: "0.88rem",
                              }}
                            >
                              View Details & Book
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-center gap-2 mt-4 pt-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center shadow-2xs"
                    style={{ width: "36px", height: "36px", padding: 0 }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm rounded-circle fw-bold d-inline-flex align-items-center justify-content-center ${
                          currentPage === page
                            ? "text-white shadow-sm"
                            : "btn-light border"
                        }`}
                        style={{
                          width: "36px",
                          height: "36px",
                          padding: 0,
                          backgroundColor:
                            currentPage === page ? "#f59e0b" : undefined,
                          borderColor:
                            currentPage === page ? "#f59e0b" : "#e5e7eb",
                          fontSize: "0.85rem",
                          lineHeight: 1,
                        }}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="btn btn-sm btn-light border rounded-circle d-inline-flex align-items-center justify-content-center shadow-2xs"
                    style={{ width: "36px", height: "36px", padding: 0 }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE PANEL (FILTERS DASHBOARD + RECOMMENDATION PLACES) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div className="col-xl-4 col-lg-5 col-12 d-flex flex-column gap-4">
            {/* Header Summary Bar with Generous Internal Spacing & Border Clearance */}
            <div
              className="bg-white rounded-4 p-4 border shadow-sm d-flex align-items-center gap-4"
              style={{ borderColor: "#e2e8f0" }}
            >
              <div
                className="p-2.5 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  backgroundColor: "#fef3c7",
                  color: "#d97706",
                  width: "42px",
                  height: "42px",
                  marginRight: "4px",
                }}
              >
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-grow-1 ps-1">
                <h6
                  className="fw-bold mb-1 text-dark text-truncate"
                  style={{ fontSize: "1.05rem", letterSpacing: "-0.2px" }}
                >
                  {selectedDestination !== "All"
                    ? selectedDestination
                    : "All Destinations"}
                </h6>
                <small
                  className="text-muted d-block text-truncate"
                  style={{ fontSize: "0.82rem", lineHeight: "1.4" }}
                >
                  {checkInDate} – {checkOutDate} • {guestsCount}
                </small>
              </div>
            </div>

            {/* 1. FILTER STAYS DASHBOARD CARD WITH SPACIOUS PADDING */}
            <div
              className="bg-white rounded-4 p-4 shadow-sm border"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-2.5 rounded-circle"
                    style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
                  >
                    <SlidersHorizontal size={20} />
                  </div>
                  <div>
                    <h6
                      className="fw-bold mb-0 text-dark"
                      style={{ fontSize: "1.05rem" }}
                    >
                      Filter Stays & Preferences
                    </h6>
                    <small
                      className="text-muted d-block mt-0.5"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Price, amenities & ratings
                    </small>
                  </div>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="btn btn-link p-0 text-decoration-none small fw-bold ms-2"
                  style={{ color: "#d97706", fontSize: "0.82rem" }}
                >
                  Clear Filters ✕
                </button>
              </div>

              <div className="row g-3.5">
                {/* Search Hotel Name */}
                <div className="col-12 mb-3">
                  <label
                    className="form-label fw-bold text-muted text-uppercase mb-2 d-block"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
                  >
                    Hotel Name Keyword
                  </label>
                  <div className="position-relative">
                    <Search
                      size={16}
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                    />
                    <input
                      type="text"
                      className="form-control rounded-3 ps-5 py-2.5 px-3"
                      placeholder="Search resort, villa, hotel name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: "0.88rem" }}
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="col-12 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2.5">
                    <label
                      className="form-label fw-bold text-muted text-uppercase mb-0"
                      style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
                    >
                      Price Range Per Night
                    </label>
                    <span
                      className="fw-bold small font-mono"
                      style={{ color: "#d97706", fontSize: "0.9rem" }}
                    >
                      Up to ₹{priceMax.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range my-2 px-1 w-100"
                    min="500"
                    max="25000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    style={{ accentColor: "#f59e0b" }}
                  />
                </div>

                {/* Popular Filters */}
                <div className="col-12 mb-4">
                  <label
                    className="form-label fw-bold text-muted text-uppercase mb-3 d-block"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
                  >
                    Popular Filters (Select Multiple)
                  </label>
                  <div className="d-flex flex-column gap-2.5">
                    {[
                      { key: "freeCancellation", label: "Free Cancellation" },
                      {
                        key: "breakfastIncluded",
                        label: "Breakfast Included",
                      },
                      { key: "pool", label: "Swimming Pool" },
                      { key: "freeWifi", label: "Free High-Speed Wi-Fi" },
                      { key: "parking", label: "Free Parking" },
                    ].map((item) => {
                      const isChecked = !!popularFilters[item.key];
                      return (
                        <div
                          key={item.key}
                          onClick={() =>
                            setPopularFilters((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key],
                            }))
                          }
                          className="p-3 px-3.5 rounded-3 border cursor-pointer user-select-none d-flex align-items-center justify-content-between transition-all"
                          style={{
                            backgroundColor: isChecked ? "#fffbeb" : "#ffffff",
                            borderColor: isChecked ? "#d97706" : "#e2e8f0",
                            boxShadow: isChecked
                              ? "0 2px 4px rgba(217, 119, 6, 0.12)"
                              : "none",
                          }}
                        >
                          <span
                            className={`small fw-bold px-1 ${isChecked ? "text-dark" : "text-secondary"}`}
                            style={{ fontSize: "0.86rem" }}
                          >
                            {item.label}
                          </span>
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 ms-2 transition-all"
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: isChecked
                                ? "#d97706"
                                : "#f1f5f9",
                              color: isChecked ? "#ffffff" : "#94a3b8",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                            }}
                          >
                            {isChecked ? "✓" : "+"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Rating */}
                <div className="col-12 mb-4">
                  <label
                    className="form-label fw-bold text-muted text-uppercase mb-2.5 d-block"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.5px" }}
                  >
                    Guest Rating
                  </label>
                  <div className="row g-2.5">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => {
                      const isSelected =
                        Array.isArray(guestRatingFilter) &&
                        guestRatingFilter.includes(rating);
                      return (
                        <div key={rating} className="col-6">
                          <button
                            type="button"
                            onClick={() =>
                              setGuestRatingFilter((prev) =>
                                Array.isArray(prev)
                                  ? prev.includes(rating)
                                    ? prev.filter((r) => r !== rating)
                                    : [...prev, rating]
                                  : [rating],
                              )
                            }
                            className={`btn btn-sm w-100 rounded-3 py-2.5 px-3 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                              isSelected
                                ? "text-white shadow-sm"
                                : "btn-light text-dark border"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? "#d97706"
                                : undefined,
                              borderColor: isSelected ? "#d97706" : "#e5e7eb",
                              fontSize: "0.82rem",
                            }}
                          >
                            <span>{rating}+ Rated</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="col-12 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className="btn w-100 py-3 rounded-3 text-white fw-bold shadow-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      border: "none",
                      fontSize: "0.92rem",
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* 2. RECOMMENDATION PLACES SECTION WITH SPACIOUS CARD PADDING */}
            <div
              className="bg-white rounded-4 p-4 shadow-sm border"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                  <h6
                    className="fw-bold mb-1 text-dark"
                    style={{ fontSize: "1.05rem" }}
                  >
                    Recommendation Places
                  </h6>
                  <small
                    className="text-muted d-block"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Popular trending destinations & handpicked luxury stays
                  </small>
                </div>
              </div>

              {/* Destination Cards Grid */}
              <div className="row g-3 mb-4">
                {popularDestinations.map((dest) => (
                  <div key={dest.name} className="col-md-4 col-6">
                    <div
                      onClick={() => {
                        setSelectedDestination(dest.name);
                        setCurrentPage(1);
                      }}
                      className="position-relative rounded-3 overflow-hidden shadow-sm cursor-pointer hover-lift transition-all"
                      style={{ height: "150px" }}
                    >
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.85) 100%)",
                        }}
                      />
                      <div className="position-absolute bottom-0 start-0 p-3 text-white">
                        <span
                          className="fw-bold d-block text-white mb-0.5"
                          style={{ fontSize: "0.92rem" }}
                        >
                          {dest.name}
                        </span>
                        <small
                          className="opacity-90 d-block font-mono"
                          style={{ fontSize: "0.72rem" }}
                        >
                          From ₹{dest.minPrice.toLocaleString("en-IN")}/night
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Handpicked Recommended Stays */}
              <div>
                <h6
                  className="fw-bold text-dark mb-3 small text-uppercase font-mono opacity-75"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Featured Stays Recommendations
                </h6>
                <div className="d-flex flex-column gap-3">
                  {hotelsList.slice(0, 3).map((hotel) => (
                    <div
                      key={`rec-${hotel.id}`}
                      onClick={() => handleOpenBookingModal(hotel)}
                      className="p-3.5 px-4 rounded-3 border bg-light d-flex align-items-center justify-content-between gap-3 cursor-pointer hover-lift transition-all"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="rounded-2 object-fit-cover flex-shrink-0"
                          style={{ width: 56, height: 56 }}
                        />
                        <div>
                          <h6
                            className="fw-bold text-dark mb-1 small"
                            style={{ fontSize: "0.88rem" }}
                          >
                            {hotel.name}
                          </h6>
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.75rem" }}
                          >
                            <MapPin size={12} className="me-1 text-warning" />
                            {hotel.location}
                          </small>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span
                          className="fw-bold font-mono text-dark d-block"
                          style={{ fontSize: "0.92rem" }}
                        >
                          ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                        </span>
                        <span
                          className="badge text-dark font-mono px-2 py-1 mt-1"
                          style={{
                            fontSize: "0.7rem",
                            backgroundColor: "#fef3c7",
                          }}
                        >
                          ★ {hotel.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
