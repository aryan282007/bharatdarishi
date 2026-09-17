import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  User,
  Heart,
  Share2,
  ChevronLeft,
  Wifi,
  Bed,
  Bath,
  Utensils,
  Maximize2,
  CheckCircle2,
  CreditCard,
  Lock,
  Sparkles,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RazorpayModal } from "../components/RazorpayModal";
import { toast } from "react-hot-toast";
import { recordRoomBooking } from "../utils/bookingStats";

// Available Extra Features Add-ons Data
const EXTRA_FEATURES_LIST = [
  { id: "pet", name: "Allow to bring pet", price: 500, label: "+₹500" },
  {
    id: "breakfast",
    name: "Daily Breakfast / person",
    price: 350,
    label: "+₹350",
  },
  {
    id: "shuttle",
    name: "Airport Shuttle Transfer",
    price: 800,
    label: "+₹800",
  },
  { id: "parking", name: "Parking a day", price: 0, label: "Free" },
  { id: "pillow", name: "Extra pillow & blanket", price: 0, label: "Free" },
];

// Mock 5-Star Reviews Data
const HOTEL_REVIEWS = [
  {
    id: 1,
    name: "Rohan Sharma",
    avatar: "RS",
    rating: 5,
    date: "2 days ago",
    comment:
      "Exceptional hospitality! The room view was breathtaking and the room service was super fast. Highly recommended for family stays.",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "PP",
    rating: 5,
    date: "1 week ago",
    comment:
      "Super clean rooms, smooth check-in process, and top-notch amenities. The location made traveling around the city effortless.",
  },
  {
    id: 3,
    name: "Ananya Gupta",
    avatar: "AG",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Loved the breakfast options and the peaceful ambience. The staff was incredibly warm and helpful throughout our stay.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "VS",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "One of the best hotels I have stayed in! The suite was spacious, beds were super comfy, and booking through Bharat Stay was seamless.",
  },
  {
    id: 5,
    name: "Kavita Reddy",
    avatar: "KR",
    rating: 5,
    date: "1 month ago",
    comment:
      "Beautiful decor, great food at the restaurant, and great value for money. Will definitely book again on my next trip.",
  },
];

export function HotelDetails({ user, onOpenAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State initialization from location.state if passed
  const passedHotel = location.state?.hotel;

  const [hotel, setHotel] = useState(passedHotel || null);
  const [loading, setLoading] = useState(!passedHotel);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Booking Form States
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().substring(0, 10),
  );
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
  );
  const [guestsCount, setGuestsCount] = useState("2 Adults, 1 Children");
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestPhone, setGuestPhone] = useState("");

  // Custom Extra Features Selection State (Defaulting to breakfast added)
  const [selectedFeatureIds, setSelectedFeatureIds] = useState(["breakfast"]);

  const toggleFeature = (featureId) => {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  };

  // Razorpay & Booking Confirmation State
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState(null);

  // Fetch hotel details if not passed via route state
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchHotel() {
      if (passedHotel) {
        setHotel(passedHotel);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [resHotels, resRooms] = await Promise.all([
          axios.get("/api/hotels").catch(() => ({ data: [] })),
          axios.get("/api/rooms/available").catch(() => ({ data: [] })),
        ]);

        const allHotels = [...(resHotels.data || []), ...(resRooms.data || [])];
        const found = allHotels.find(
          (h) => String(h._id || h.id) === String(id),
        );

        if (found) {
          setHotel({
            id: found._id || found.id,
            _id: found._id || found.id,
            name: found.name,
            location: found.location,
            rating: found.rating || 4.8,
            pricePerNight: found.pricePerNight || 3010,
            image:
              found.image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
            roomType: found.roomType || "Deluxe Suite",
            amenities: found.amenities || [
              "Wi-Fi",
              "King Bed",
              "Bathtub",
              "Breakfast Included",
            ],
            badge: found.badge || "Top Value",
            isApiRoom: !!found.isApiRoom,
          });
        } else {
          // Fallback demo hotel object matching design
          setHotel({
            id: id || "demo-hotel",
            name: "Maxone Ascent Hotel Luxury Stay",
            location: "Jln. Diponegoro V No. 12, Kota Malang",
            rating: 5.0,
            pricePerNight: 3010,
            image:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
            roomType: "Luxury Studio Suite",
            amenities: ["Wi-Fi", "King Bed", "Bathtub", "Breakfast"],
            badge: "Top Value",
          });
        }
      } catch (err) {
        console.warn("Failed to fetch hotel details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotel();
  }, [id, passedHotel]);

  useEffect(() => {
    if (user) {
      setGuestName(user.name || "");
    }
  }, [user]);

  // Calculate Nights
  const nights = React.useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  // Calculate Itemized Pricing
  const pricePerNight = hotel?.pricePerNight || 3010;
  const basePriceTotal = pricePerNight * nights;
  const discountAmount = Math.round(basePriceTotal * 0.2); // 20% OFF
  const addOnsTotal = selectedFeatureIds.reduce((sum, featureId) => {
    const feat = EXTRA_FEATURES_LIST.find((f) => f.id === featureId);
    if (!feat) return sum;
    if (feat.id === "breakfast") return sum + feat.price * nights;
    return sum + feat.price;
  }, 0);
  const serviceFee = 250;
  const finalTotalPayment =
    basePriceTotal - discountAmount + addOnsTotal + serviceFee;

  // Handle Book Now Click -> Validate & Navigate to Payment Page (/payment)
  const handleInitiateBooking = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to complete your hotel booking.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }

    const phoneToUse = guestPhone?.trim() || user?.contactPhone || user?.phone || "+91 98765 43210";

    navigate("/payment", {
      state: {
        hotel,
        checkInDate,
        checkOutDate,
        nights,
        guestsCount,
        guestName: guestName || user?.name || "Devotee Guest",
        guestPhone: phoneToUse,
        selectedFeatureIds,
        finalTotalPayment,
        basePriceTotal,
        discountAmount,
        addOnsTotal,
        serviceFee,
      },
    });
  };

  if (loading || !hotel) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh", paddingTop: "100px" }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-warning mb-3"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          />
          <p className="fw-bold text-muted">Loading Property Details...</p>
        </div>
      </div>
    );
  }

  // Gallery Photos
  const galleryPhotos = [
    hotel.image,
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  ];

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <div className="container" style={{ maxWidth: "1240px" }}>
        {/* Back Navigation Bar */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-light bg-white border rounded-pill px-3 py-2 fw-bold text-dark d-inline-flex align-items-center gap-2 shadow-2xs hover-lift"
          >
            <ChevronLeft size={18} />
            <span>Back to Stays</span>
          </button>
          <small className="text-muted fw-semibold">
            Stays &gt; {hotel.location} &gt; {hotel.name}
          </small>
        </div>

        {/* MAIN CARD CONTAINER - MATCHING THE DESIGN IN ATTACHED SCREENSHOT */}
        <div
          className="bg-white rounded-4 p-4 p-md-4.5 shadow-md border"
          style={{ borderColor: "#e2e8f0" }}
        >
          <div className="row g-4">
            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* LEFT COLUMN (2/3 WIDTH) - PHOTO GALLERY, BADGES, TABS & DETAILS */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="col-lg-8 col-12">
              {/* 1. TOP PHOTO GALLERY GRID (MATCHING SCREENSHOT LAYOUT) */}
              <div className="row g-3 mb-4">
                {/* Left Large Photo */}
                <div className="col-md-7 col-12">
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs position-relative"
                    style={{ height: "360px" }}
                  >
                    <img
                      src={galleryPhotos[0]}
                      alt={hotel.name}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>

                {/* Right Stacked 2 Photos */}
                <div className="col-md-5 col-12 d-flex flex-column gap-3">
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs"
                    style={{ height: "172px" }}
                  >
                    <img
                      src={galleryPhotos[1]}
                      alt="Hotel Interior"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs position-relative"
                    style={{ height: "172px" }}
                  >
                    <img
                      src={galleryPhotos[2]}
                      alt="Hotel Pool"
                      className="w-100 h-100 object-fit-cover"
                    />
                    {/* +12 Photos Overlay Badge */}
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.45)",
                        backdropFilter: "blur(4px)",
                        fontSize: "1rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      +12 Photos
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. BADGES ROW (RATING, TAGS, STARS & BOOKMARK/SHARE) */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  {/* Rating Badge */}
                  <span
                    className="badge px-3 py-2 rounded-3 fw-bold d-inline-flex align-items-center"
                    style={{
                      backgroundColor: "#dcfce7",
                      color: "#15803d",
                      fontSize: "0.86rem",
                      gap: "8px",
                    }}
                  >
                    <Star
                      size={14}
                      style={{ fill: "#15803d", color: "#15803d" }}
                    />
                    <span>{hotel.rating || 4.7}</span>
                    <span style={{ marginLeft: "4px" }}>Perfect</span>
                  </span>

                  {/* Category Pills */}
                  <span
                    className="badge px-3 py-2 rounded-3 fw-medium text-primary bg-blue-50"
                    style={{
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                      fontSize: "0.8rem",
                    }}
                  >
                    Hotels
                  </span>
                  <span
                    className="badge px-3 py-2 rounded-3 fw-medium"
                    style={{
                      backgroundColor: "#fcf4ff",
                      color: "#9333ea",
                      fontSize: "0.8rem",
                    }}
                  >
                    New Building
                  </span>
                  <span
                    className="badge px-3 py-2 rounded-3 fw-medium"
                    style={{
                      backgroundColor: "#fff7ed",
                      color: "#c2410c",
                      fontSize: "0.8rem",
                    }}
                  >
                    Top Value
                  </span>

                  {/* Star Ratings */}
                  <div className="d-flex align-items-center gap-1 ms-1 text-warning">
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                    <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  </div>
                </div>

                {/* Bookmark & Share Buttons */}
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="btn btn-light border rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-2xs hover-lift"
                    style={{ width: "38px", height: "38px" }}
                  >
                    <Heart
                      size={18}
                      fill={isWishlisted ? "#ef4444" : "none"}
                      color={isWishlisted ? "#ef4444" : "#64748b"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Hotel link copied to clipboard! 📋");
                    }}
                    className="btn btn-light border rounded-circle p-2.5 d-flex align-items-center justify-content-center shadow-2xs hover-lift"
                    style={{ width: "38px", height: "38px" }}
                  >
                    <Share2 size={18} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* 3. HOTEL TITLE & LOCATION */}
              <h2
                className="fw-extrabold text-dark mb-2"
                style={{ fontSize: "1.75rem", letterSpacing: "-0.5px" }}
              >
                {hotel.name}
              </h2>
              <p
                className="text-muted small fw-medium mb-4 d-flex align-items-center gap-2 cursor-pointer"
                onClick={() => setActiveTab("map")}
                title="Click to view interactive map"
              >
                <MapPin size={16} className="text-warning flex-shrink-0" />
                <span className="text-decoration-underline">
                  {hotel.location}
                </span>
                <span
                  className="badge bg-light text-primary border ms-1"
                  style={{ fontSize: "0.68rem" }}
                >
                  View on Map 🗺️
                </span>
              </p>

              {/* 4. TABS NAVIGATION (Description, Map & Location, Reviews) */}
              <div className="border-bottom mb-4">
                <div className="d-flex gap-4">
                  {[
                    { key: "description", label: "Description" },
                    { key: "map", label: "Map & Location" },
                    { key: "reviews", label: "Reviews (5)" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`btn p-0 pb-2.5 fw-bold text-decoration-none border-0 position-relative ${
                        activeTab === tab.key
                          ? "text-dark"
                          : "text-muted opacity-75"
                      }`}
                      style={{ fontSize: "0.95rem" }}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="position-absolute bottom-0 start-0 w-100 rounded-pill"
                          style={{ height: "3px", backgroundColor: "#d97706" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. TAB CONTENT: DESCRIPTION / MAP / REVIEWS */}
              <div className="mb-4">
                {activeTab === "description" && (
                  <div>
                    <p
                      className="text-secondary lh-relaxed mb-3"
                      style={{ fontSize: "0.92rem" }}
                    >
                      Experience world-class luxury at{" "}
                      <strong>{hotel.name}</strong>, strategically situated in
                      the heart of {hotel.location}. Designed for comfort and
                      elegance, this property offers panoramic scenic views,
                      tranquility, and seamless access to key city landmarks,
                      business districts, and popular travel hubs. Whether you
                      are traveling for leisure, business, or a family getaway,
                      enjoy an unforgettable stay enhanced by modern
                      architecture and warm Indian hospitality.
                    </p>

                    <p
                      className="text-secondary lh-relaxed mb-3.5"
                      style={{ fontSize: "0.92rem" }}
                    >
                      Our spacious air-conditioned suites feature premium plush
                      bedding, soundproof floor-to-ceiling windows,
                      complimentary high-speed Wi-Fi, and private marble
                      bathrooms with luxury soaking tubs. Guests can indulge in
                      24/7 gourmet room service, relax by the rooftop infinity
                      pool, or rejuvenate at the wellness spa.
                    </p>

                    {/* Integrated Key Hotel & Room Features */}
                    <div
                      className="p-4 rounded-4 border bg-light mt-3 mb-2"
                      style={{
                        backgroundColor: "#f8fafc",
                        borderColor: "#e2e8f0",
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <h6
                        className="fw-bold text-dark mb-3"
                        style={{ fontSize: "0.98rem" }}
                      >
                        Key Highlights & Room Features
                      </h6>
                      <div className="row g-3">
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Wifi
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            High-Speed Wi-Fi
                          </span>
                        </div>
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Bed
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            Plush King Bed
                          </span>
                        </div>
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Bath
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            Marble Bathtub
                          </span>
                        </div>
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Utensils
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            Gourmet Dining
                          </span>
                        </div>
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Maximize2
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            Spacious 45m² Suite
                          </span>
                        </div>
                        <div
                          className="col-6 col-sm-4 d-flex align-items-center"
                          style={{ gap: "10px" }}
                        >
                          <Sparkles
                            size={18}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-dark small fw-bold">
                            24/7 Room Service
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "map" && (
                  <div className="rounded-4 overflow-hidden border shadow-sm">
                    <div className="bg-light p-3 border-bottom d-flex align-items-center justify-content-between">
                      <span
                        className="fw-bold text-dark small d-flex align-items-center"
                        style={{ gap: "8px" }}
                      >
                        <MapPin size={18} className="text-warning" />
                        {hotel.location}
                      </span>
                      <span
                        className="badge font-mono small px-2.5 py-1"
                        style={{ backgroundColor: "#fef3c7", color: "#b45309" }}
                      >
                        State Map View
                      </span>
                    </div>
                    <iframe
                      title="Hotel Location State Google Map"
                      width="100%"
                      height="360"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        hotel.location || "India",
                      )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="d-flex flex-column">
                    {/* Ultra-Clean & Minimal Summary Bar */}
                    <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                      <div
                        className="d-flex align-items-center flex-wrap"
                        style={{ gap: "12px" }}
                      >
                        <div
                          className="d-flex align-items-baseline"
                          style={{ gap: "4px" }}
                        >
                          <span
                            className="fw-extrabold text-dark"
                            style={{
                              fontSize: "1.6rem",
                              letterSpacing: "-0.5px",
                            }}
                          >
                            {hotel.rating || 4.9}
                          </span>
                          <span
                            className="text-muted small fw-medium"
                            style={{ fontSize: "0.85rem" }}
                          >
                            / 5.0
                          </span>
                        </div>
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: "3px" }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              style={{ fill: "#f59e0b", color: "#f59e0b" }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-muted small"
                          style={{ fontSize: "0.82rem" }}
                        >
                          (5 Verified Guest Reviews)
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 text-success small fw-semibold">
                        <CheckCircle2 size={15} className="flex-shrink-0" />
                        <span style={{ fontSize: "0.78rem" }}>
                          100% Verified
                        </span>
                      </div>
                    </div>

                    {/* Minimal Review Cards List with Spacious Padding */}
                    <div className="d-flex flex-column" style={{ gap: "16px" }}>
                      {HOTEL_REVIEWS.map((rev) => (
                        <div
                          key={rev.id}
                          className="rounded-4 border transition-all"
                          style={{
                            padding: "20px 22px",
                            backgroundColor: "#ffffff",
                            borderColor: "#e2e8f0",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div
                              className="d-flex align-items-center"
                              style={{ gap: "12px" }}
                            >
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  backgroundColor: "#fef3c7",
                                  color: "#b45309",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {rev.avatar}
                              </div>
                              <div>
                                <h6
                                  className="fw-bold text-dark mb-0"
                                  style={{ fontSize: "0.88rem" }}
                                >
                                  {rev.name}
                                </h6>
                                <span
                                  className="text-muted d-block"
                                  style={{ fontSize: "0.72rem" }}
                                >
                                  {rev.date}
                                </span>
                              </div>
                            </div>

                            <div
                              className="d-flex align-items-center px-2 py-0.5 rounded-pill"
                              style={{
                                backgroundColor: "#fffbeb",
                                border: "1px solid #fef3c7",
                                gap: "4px",
                              }}
                            >
                              <Star
                                size={12}
                                style={{ fill: "#f59e0b", color: "#f59e0b" }}
                              />
                              <span
                                className="fw-bold text-dark font-mono"
                                style={{ fontSize: "0.75rem" }}
                              >
                                {rev.rating}.0
                              </span>
                            </div>
                          </div>

                          <p
                            className="mb-0 lh-relaxed"
                            style={{
                              fontSize: "0.86rem",
                              color: "#475569",
                              paddingLeft: "46px",
                            }}
                          >
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* RIGHT COLUMN (1/3 WIDTH) - STICKY BOOKING CARD MATCHING SCREENSHOT */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="col-lg-4 col-12">
              <div
                className="bg-white rounded-4 p-4 border shadow-md position-sticky"
                style={{
                  top: "110px",
                  borderColor: "#e2e8f0",
                  boxShadow: "0 12px 30px -5px rgba(0, 0, 0, 0.05)",
                  borderRadius: "20px",
                }}
              >
                {/* 1. PRICE HEADER ROW */}
                <div className="d-flex align-items-baseline justify-content-between mb-4 pb-1">
                  <div className="d-flex align-items-baseline gap-2">
                    <h3
                      className="fw-extrabold text-dark mb-0 font-mono"
                      style={{ fontSize: "1.75rem", letterSpacing: "-0.5px" }}
                    >
                      ₹{pricePerNight.toLocaleString("en-IN")}
                    </h3>
                    <span
                      className="text-muted text-decoration-line-through small font-mono opacity-75"
                      style={{ fontSize: "0.88rem" }}
                    >
                      ₹
                      {Math.round(pricePerNight * 1.25).toLocaleString("en-IN")}
                    </span>
                    <small
                      className="text-muted fw-bold"
                      style={{ fontSize: "0.84rem" }}
                    >
                      /night
                    </small>
                  </div>
                  <span
                    className="badge px-3 py-1.5 rounded-pill fw-extrabold shadow-2xs"
                    style={{
                      backgroundColor: "#fce7f3",
                      color: "#be185d",
                      fontSize: "0.78rem",
                      letterSpacing: "0.3px",
                    }}
                  >
                    20% OFF
                  </span>
                </div>

                <form onSubmit={handleInitiateBooking}>
                  {/* AUTH-MODAL / LOGIN PAGE MATCHING INPUTS */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    {/* DATES ROW */}
                    <div className="row g-2.5">
                      {/* CHECK-IN */}
                      <div className="col-6">
                        <div>
                          <label
                            className="form-label text-dark small fw-semibold mb-1.5"
                            style={{ fontSize: "0.82rem" }}
                          >
                            Check-In
                          </label>
                          <div
                            className="rounded-3 overflow-hidden border bg-light"
                            style={{ height: "48px", borderColor: "#cbd5e1" }}
                          >
                            <input
                              type="date"
                              required
                              value={checkInDate}
                              onChange={(e) => setCheckInDate(e.target.value)}
                              className="form-control bg-light border-0 text-dark fw-bold h-100 px-3 shadow-none cursor-pointer"
                              style={{ fontSize: "0.88rem", color: "#0f172a" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* CHECK-OUT */}
                      <div className="col-6">
                        <div>
                          <label
                            className="form-label text-dark small fw-semibold mb-1.5"
                            style={{ fontSize: "0.82rem" }}
                          >
                            Check-Out
                          </label>
                          <div
                            className="rounded-3 overflow-hidden border bg-light"
                            style={{ height: "48px", borderColor: "#cbd5e1" }}
                          >
                            <input
                              type="date"
                              required
                              value={checkOutDate}
                              onChange={(e) => setCheckOutDate(e.target.value)}
                              className="form-control bg-light border-0 text-dark fw-bold h-100 px-3 shadow-none cursor-pointer"
                              style={{ fontSize: "0.88rem", color: "#0f172a" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* GUESTS & ROOMS */}
                    <div>
                      <label
                        className="form-label text-dark small fw-semibold mb-1.5"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Guests & Rooms
                      </label>
                      <div
                        className="input-group rounded-3 overflow-hidden border"
                        style={{ height: "48px", borderColor: "#cbd5e1" }}
                      >
                        <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                          <User size={18} className="text-warning" />
                        </span>
                        <select
                          className="form-select bg-light border-start-0 text-dark fw-bold h-100 shadow-none cursor-pointer"
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(e.target.value)}
                          style={{ fontSize: "0.88rem", color: "#0f172a" }}
                        >
                          <option value="1 Adult, 1 Room">
                            1 Adult, 1 Room
                          </option>
                          <option value="2 Adults, 1 Children">
                            2 Adults, 1 Children
                          </option>
                          <option value="2 Adults, 2 Rooms">
                            2 Adults, 2 Rooms
                          </option>
                          <option value="3 Adults, 2 Rooms">
                            3 Adults, 2 Rooms
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* CONTACT PHONE */}
                    <div>
                      <label
                        className="form-label text-dark small fw-semibold mb-1.5"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Contact Phone *
                      </label>
                      <div
                        className="input-group rounded-3 overflow-hidden border"
                        style={{ height: "48px", borderColor: "#cbd5e1" }}
                      >
                        <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                          <ShieldCheck size={18} className="text-warning" />
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          className="form-control bg-light border-start-0 text-dark fw-bold h-100 shadow-none"
                          style={{ fontSize: "0.88rem", color: "#0f172a" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. EXTRA FEATURES (CUSTOM SELECT WITH PLUS ICON ADD-ON BUTTONS) */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-bold text-muted text-uppercase mb-2 d-block"
                      style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                    >
                      Extra Features
                    </label>

                    <div className="d-flex flex-column gap-2">
                      {EXTRA_FEATURES_LIST.map((feature) => {
                        const isSelected = selectedFeatureIds.includes(
                          feature.id,
                        );
                        return (
                          <div
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            className="p-2.5 px-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer transition-all"
                            style={{
                              backgroundColor: isSelected
                                ? "#fffbeb"
                                : "#ffffff",
                              borderColor: isSelected ? "#fcd34d" : "#e2e8f0",
                              boxShadow: isSelected
                                ? "0 2px 8px rgba(245, 158, 11, 0.12)"
                                : "none",
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{ gap: "12px" }}
                            >
                              <button
                                type="button"
                                className="btn p-0 d-flex align-items-center justify-content-center rounded-circle"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor: isSelected
                                    ? "#f59e0b"
                                    : "#f1f5f9",
                                  color: isSelected ? "#ffffff" : "#64748b",
                                  border: "none",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                              <span
                                className={`small ${isSelected ? "fw-bold text-dark" : "fw-medium text-secondary"}`}
                              >
                                {feature.name}
                              </span>
                            </div>

                            <span
                              className="badge font-mono px-2 py-1"
                              style={{
                                backgroundColor: isSelected
                                  ? "#fef3c7"
                                  : feature.price === 0
                                    ? "#dcfce7"
                                    : "#f1f5f9",
                                color: isSelected
                                  ? "#b45309"
                                  : feature.price === 0
                                    ? "#166534"
                                    : "#475569",
                                fontSize: "0.74rem",
                                fontWeight: "700",
                              }}
                            >
                              {feature.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. ITEMIZED PRICE BREAKDOWN BOX */}
                  <div
                    className="p-3 rounded-3 mb-3.5"
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      padding: "1rem",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1.5">
                      <span className="text-muted small fw-medium">
                        {nights} Night(s)
                      </span>
                      <span className="fw-bold small font-mono text-dark">
                        ₹{basePriceTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mb-1.5">
                      <span className="text-muted small fw-medium">
                        Discount 20%
                      </span>
                      <span className="fw-bold small font-mono text-danger">
                        -₹{discountAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {selectedFeatureIds.map((featureId) => {
                      const feat = EXTRA_FEATURES_LIST.find(
                        (f) => f.id === featureId,
                      );
                      if (!feat || feat.price === 0) return null;
                      const featCost =
                        feat.id === "breakfast"
                          ? feat.price * nights
                          : feat.price;
                      return (
                        <div
                          key={featureId}
                          className="d-flex align-items-center justify-content-between mb-1.5"
                        >
                          <span className="text-muted small fw-medium">
                            {feat.name}
                          </span>
                          <span className="fw-bold small font-mono text-dark">
                            +₹{featCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}

                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="text-muted small fw-medium">
                        Service fee
                      </span>
                      <span className="fw-bold small font-mono text-dark">
                        +₹{serviceFee}
                      </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                      <span
                        className="fw-bold text-dark"
                        style={{ fontSize: "0.95rem" }}
                      >
                        Total Payment
                      </span>
                      <span
                        className="fw-extrabold font-mono text-dark"
                        style={{ fontSize: "1.15rem" }}
                      >
                        ₹{finalTotalPayment.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* 7. ACTION BUTTON MATCHING SCREENSHOT */}
                  <button
                    type="submit"
                    disabled={loadingBooking}
                    className="btn w-100 py-3 rounded-3 text-white fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      border: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {loadingBooking ? (
                      <span>Processing Booking...</span>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Book Now</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* E-TICKET SUCCESS CONFIRMATION MODAL */}
      <AnimatePresence>
        {bookingSuccessTicket && (
          <div
            className="modal show d-block p-3"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              zIndex: 1080,
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content bg-white text-dark rounded-4 p-4 border-0 shadow-2xl text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#dcfce7",
                    color: "#166534",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>

                <h4 className="fw-extrabold text-dark mb-1">
                  Booking Confirmed! 🎉
                </h4>
                <p className="text-muted small mb-3">
                  Your hotel reservation ticket has been issued successfully.
                </p>

                <div className="bg-light rounded-3 p-3.5 border text-start mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">TICKET CODE:</span>
                    <span className="fw-bold font-mono text-warning">
                      {bookingSuccessTicket.ticketCode}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">HOTEL:</span>
                    <span className="fw-bold text-dark">
                      {bookingSuccessTicket.hotelName}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">CHECK-IN:</span>
                    <span className="fw-bold">
                      {bookingSuccessTicket.checkInDate}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">TOTAL PAID:</span>
                    <span className="fw-bold text-success font-mono">
                      ₹{bookingSuccessTicket.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingSuccessTicket(null)}
                  className="btn text-white fw-bold px-5 py-2.5 rounded-pill shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    border: "none",
                  }}
                >
                  Done & Close
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
