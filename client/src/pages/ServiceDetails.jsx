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
  Phone,
  Clock,
  Car,
  Check,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Extra Add-ons List for Services
const SERVICE_ADDONS = [
  { id: "driver", name: "Certified Expert Driver", price: 500, label: "+₹500" },
  { id: "luggage", name: "Extra Baggage Carrier", price: 300, label: "+₹300" },
  { id: "guide", name: "Local Tour Guide Companion", price: 800, label: "+₹800" },
  { id: "pickup", name: "Doorstep Airport / Station Pickup", price: 400, label: "+₹400" },
];

// Mock Reviews for Local Services
const SERVICE_REVIEWS = [
  {
    id: 1,
    name: "Amit Deshmukh",
    avatar: "AD",
    rating: 5,
    date: "3 days ago",
    comment: "Extremely reliable driver and super clean vehicle! The trip across the mountain pass was smooth and stress-free.",
  },
  {
    id: 2,
    name: "Sneha Mukherjee",
    avatar: "SM",
    rating: 5,
    date: "1 week ago",
    comment: "Prompt pickup from the airport and great local recommendations. Will definitely book this service again on our next tour.",
  },
  {
    id: 3,
    name: "Rahul Verma",
    avatar: "RV",
    rating: 5,
    date: "2 weeks ago",
    comment: "Punctual, polite, and very affordable rates compared to traditional taxis. Transparent pricing with no hidden charges.",
  },
];

export function ServiceDetails({ user, onOpenAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedService = location.state?.service;
  const [service, setService] = useState(passedService || null);
  const [loading, setLoading] = useState(!passedService);

  // Booking Form State
  const [serviceDate, setServiceDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [travelersCount, setTravelersCount] = useState("2 Passengers");
  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "+91 98765 43210");
  const [selectedAddonIds, setSelectedAddonIds] = useState(["driver"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchService() {
      if (passedService) {
        setService(passedService);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get("/api/events").catch(() => ({ data: [] }));
        const allServices = Array.isArray(res.data) ? res.data : [];
        const found = allServices.find(
          (s) => String(s._id || s.id) === String(id)
        );

        if (found) {
          setService(found);
        } else {
          // Fallback Service Demo Data
          setService({
            id: id || "demo-service",
            title: "Premium Outstation & Sightseeing Cab",
            category: "Taxi & City Cabs",
            location: "Gangtok & East Sikkim",
            rating: 4.8,
            price: 2499,
            image:
              "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200",
            phone: "+91 98320 12345",
            description:
              "Comfortable, well-maintained SUVs and sedan Cabs for city transfers, outstation sightseeing tours, and airport pick-up and drop-off with verified experienced drivers.",
            tags: ["24/7 Support", "Clean Vehicles", "On-Time Guarantee"],
          });
        }
      } catch (err) {
        console.warn("Failed to fetch service details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id, passedService]);

  useEffect(() => {
    if (user) {
      setGuestName(user.name || "");
    }
  }, [user]);

  const toggleAddon = (addonId) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((i) => i !== addonId)
        : [...prev, addonId]
    );
  };

  // Itemized Pricing Calculation
  const basePrice = service?.price || 2499;
  const discountAmount = Math.round(basePrice * 0.15); // 15% discount
  const addOnsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const item = SERVICE_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);
  const serviceFee = 150;
  const finalTotalPayment = basePrice - discountAmount + addOnsTotal + serviceFee;

  // Handle Book Service Click -> Validate & Navigate to Payment Page (/payment)
  const handleInitiateBooking = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to complete your service booking.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }

    const phoneToUse = guestPhone?.trim() || user?.contactPhone || user?.phone || "+91 98765 43210";

    navigate("/payment", {
      state: {
        hotel: {
          name: service?.title || "Local Service Reservation",
          location: service?.location || "City Center",
          roomType: service?.category || "Local Service",
          pricePerNight: basePrice,
          image: service?.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200",
        },
        checkInDate: serviceDate,
        checkOutDate: serviceDate,
        nights: 1,
        guestsCount: travelersCount,
        guestName: guestName || user?.name || "Guest Traveler",
        guestPhone: phoneToUse,
        finalTotalPayment,
        basePriceTotal: basePrice,
        discountAmount,
        addOnsTotal,
        serviceFee,
      },
    });
  };

  if (loading || !service) {
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
          <p className="fw-bold text-muted">Loading Service Details...</p>
        </div>
      </div>
    );
  }

  // Gallery Photos
  const galleryPhotos = [
    service.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800",
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
            <span>Back to Local Services</span>
          </button>
          <small className="text-muted fw-semibold">
            Local Services &gt; {service.category || "Cabs"} &gt; {service.title}
          </small>
        </div>

        {/* MAIN CARD CONTAINER - MATCHING STAYS DETAIL PAGE */}
        <div
          className="bg-white rounded-4 p-4 p-md-4.5 shadow-md border"
          style={{ borderColor: "#e2e8f0" }}
        >
          <div className="row g-4">
            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* LEFT COLUMN (2/3 WIDTH) - PHOTO GALLERY, HIGHLIGHTS, DETAILS */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="col-lg-8 col-12">
              {/* TOP PHOTO GALLERY GRID */}
              <div className="row g-3 mb-4">
                <div className="col-md-7 col-12">
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs position-relative"
                    style={{ height: "360px" }}
                  >
                    <img
                      src={galleryPhotos[0]}
                      alt={service.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white font-mono px-3 py-1.5 rounded-pill"
                      style={{ backdropFilter: "blur(4px)" }}
                    >
                      ★ {service.rating || 4.8} Verified Service
                    </div>
                  </div>
                </div>

                <div className="col-md-5 col-12 d-flex flex-column gap-3">
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs"
                    style={{ height: "172px" }}
                  >
                    <img
                      src={galleryPhotos[1]}
                      alt="Service Vehicle"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                  <div
                    className="rounded-4 overflow-hidden shadow-2xs position-relative"
                    style={{ height: "172px" }}
                  >
                    <img
                      src={galleryPhotos[2]}
                      alt="Local Route"
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>
              </div>

              {/* SERVICE TITLE & BADGES HEADER */}
              <div className="pb-3 border-bottom mb-4">
                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="badge bg-amber-50 text-dark fw-bold font-mono px-3 py-1 rounded-pill"
                    style={{ backgroundColor: "#fef3c7", color: "#b45309" }}
                  >
                    {service.category || "Verified Local Service"}
                  </span>
                  <span className="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill">
                    ✓ 100% On-Time Guarantee
                  </span>
                </div>

                <h2 className="fw-extrabold text-dark mb-2" style={{ letterSpacing: "-0.5px" }}>
                  {service.title}
                </h2>

                <div className="d-flex align-items-center gap-4 text-muted small flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={16} className="text-warning flex-shrink-0" />
                    <span>{service.location || "City & Outstation Coverage"}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Phone size={16} className="text-success flex-shrink-0" />
                    <span>{service.phone || "+91 98320 12345"}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Clock size={16} className="text-primary flex-shrink-0" />
                    <span>24/7 Instant Assistance</span>
                  </div>
                </div>
              </div>

              {/* ABOUT SERVICE & OVERVIEW */}
              <div className="mb-4">
                <h5 className="fw-extrabold text-dark mb-3">About This Service</h5>
                <p className="text-secondary leading-relaxed mb-3" style={{ fontSize: "0.95rem" }}>
                  {service.description ||
                    "Experience hassle-free local and outstation transportation services tailored for tourists, pilgrims, and families. All vehicles undergo strict safety inspections and come equipped with GPS tracking, sanitized interiors, and experienced local drivers."}
                </p>
                <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: "0.95rem" }}>
                  Our verified service partners provide transparent, upfront pricing with no hidden charges, ensuring your journey is comfortable, safe, and punctual.
                </p>
              </div>

              {/* KEY HIGHLIGHTS & FEATURES SECTION */}
              <div className="p-4 bg-slate-50 rounded-4 border mb-4" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
                <h6 className="fw-bold text-dark mb-3 text-uppercase font-mono" style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}>
                  Key Highlights & Service Features
                </h6>

                <div className="row g-3">
                  {[
                    "24/7 Emergency Roadside Support",
                    "Sanitized & Air-Conditioned Fleet",
                    "Certified & Background-Verified Drivers",
                    "Flexible Pickup & Drop-Off Locations",
                    "Full Travel Insurance & Passenger Safety",
                    "Instant Digital Booking Receipt",
                  ].map((feat, idx) => (
                    <div key={idx} className="col-md-6 col-12">
                      <div
                        className="d-flex align-items-center gap-3 p-3 bg-white rounded-3 border shadow-2xs"
                        style={{ padding: "0.75rem 1rem" }}
                      >
                        <div
                          className="rounded-circle text-success d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "28px", height: "28px", backgroundColor: "#dcfce7" }}
                        >
                          <Check size={16} />
                        </div>
                        <span className="fw-semibold text-dark small">{feat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VERIFIED PARTNER GUARANTEE BANNER */}
              <div className="p-3 bg-amber-50 rounded-4 border border-warning border-opacity-30 d-flex align-items-center gap-3 mb-4" style={{ backgroundColor: "#fef3c7" }}>
                <ShieldCheck size={28} className="text-warning flex-shrink-0" />
                <div>
                  <h6 className="fw-bold text-dark mb-0.5 small">Bharat Darshi Verified Partner Guarantee</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: "0.82rem" }}>
                    Book with peace of mind. Every driver and service provider is background-checked with 100% price transparency.
                  </p>
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div>
                <h5 className="fw-extrabold text-dark mb-3">Customer Reviews & Ratings</h5>
                <div className="d-flex flex-column gap-3">
                  {SERVICE_REVIEWS.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-white rounded-4 border shadow-sm"
                      style={{ padding: "1.25rem 1.5rem" }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-circle bg-dark text-white fw-bold d-flex align-items-center justify-content-center small flex-shrink-0"
                            style={{ width: "38px", height: "38px" }}
                          >
                            {rev.avatar}
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-0 small">{rev.name}</h6>
                            <small className="text-muted d-block" style={{ fontSize: "0.75rem", marginTop: "1px" }}>{rev.date}</small>
                          </div>
                        </div>
                        <div className="d-flex text-warning gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p className="text-secondary small mb-0" style={{ fontSize: "0.85rem" }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* RIGHT COLUMN (1/3 WIDTH) - STICKY PRICE CARD & BOOK SERVICE */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <div className="col-lg-4 col-12">
              <div
                className="bg-white rounded-4 p-4 border shadow-sm position-sticky"
                style={{ top: "110px", borderColor: "#e2e8f0" }}
              >
                {/* Price Display Header */}
                <div className="pb-3 border-bottom mb-3">
                  <span className="text-muted small text-uppercase font-mono d-block mb-1" style={{ fontSize: "0.72rem" }}>
                    ESTIMATED RATE
                  </span>
                  <div className="d-flex align-items-baseline gap-1">
                    <h3 className="fw-extrabold text-dark font-mono mb-0" style={{ color: "#d97706" }}>
                      ₹{basePrice.toLocaleString("en-IN")}
                    </h3>
                    <span className="text-muted small">/ day</span>
                  </div>
                  <span className="badge bg-success-subtle text-success fw-bold px-2.5 py-1 rounded-pill mt-2" style={{ fontSize: "0.72rem" }}>
                    Special Offer 15% Discount Applied
                  </span>
                </div>

                {/* Booking Form Inputs */}
                <form onSubmit={handleInitiateBooking}>
                  {/* Service Date Selector */}
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-bold mb-1">Select Service Date</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <Calendar size={16} />
                      </span>
                      <input
                        type="date"
                        required
                        className="form-control bg-light border-start-0 font-mono fw-medium"
                        value={serviceDate}
                        onChange={(e) => setServiceDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Passengers / Travelers Count */}
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-bold mb-1">Passengers & Capacity</label>
                    <select
                      className="form-select form-select-sm bg-light fw-medium"
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(e.target.value)}
                    >
                      <option>1 Passenger</option>
                      <option>2 Passengers</option>
                      <option>3 - 4 Passengers</option>
                      <option>5 - 7 Passengers (SUV)</option>
                    </select>
                  </div>

                  {/* Contact Phone Number */}
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-bold mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      className="form-control form-control-sm bg-light fw-medium"
                      placeholder="+91 98765 43210"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                    />
                  </div>

                  {/* Transparent Price Breakdown */}
                  <div className="p-3 bg-slate-50 rounded-3 border mb-3" style={{ backgroundColor: "#f8fafc" }}>
                    <h6 className="fw-bold text-dark mb-2 small font-mono text-uppercase" style={{ fontSize: "0.72rem" }}>
                      TRANSPARENT BILLING
                    </h6>
                    <div className="d-flex justify-content-between mb-1.5 small">
                      <span className="text-muted">Base Service Rate</span>
                      <span className="fw-bold font-mono text-dark">₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1.5 small">
                      <span className="text-muted">Special Offer (15% OFF)</span>
                      <span className="fw-bold font-mono text-danger">-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="d-flex justify-content-between small pt-1.5 border-top">
                      <strong className="text-dark">Total Payable</strong>
                      <strong className="text-dark font-mono fs-5">₹{finalTotalPayment.toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  {/* Primary Book Service Button */}
                  <button
                    type="submit"
                    className="btn w-100 py-3 rounded-3 text-white fw-bold shadow-md d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      border: "none",
                      fontSize: "0.98rem",
                    }}
                  >
                    <span>Book Service</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
