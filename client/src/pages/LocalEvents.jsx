import React, { useState, useEffect } from "react";
import {
  MapPin,
  Car,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Headphones,
  ShieldCheck,
  Heart,
  SlidersHorizontal,
  Phone,
  Clock,
  Sparkles,
  Search,
  X,
  Plus,
  Compass,
  Grid,
  ArrowRight,
  LocateFixed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { RazorpayModal } from "../components/RazorpayModal";

export function LocalEvents({ user, onOpenAuth }) {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedLocation, setSelectedLocation] = useState("Gangtok, Sikkim");
  const [customLocations, setCustomLocations] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDate, setSelectedDate] = useState("2026-08-26");
  const [travelers, setTravelers] = useState("2 People");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  // Handle Device Location Auto Detection with IP Fallback
  const handleDetectLocation = () => {
    setIsLocating(true);
    toast.loading("Detecting your current location...", { id: "geo-toast" });

    // Helper to fetch IP-based location fallback
    const fetchIpLocation = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/", { timeout: 4000 });
        if (res.data && (res.data.city || res.data.region)) {
          const city = res.data.city || res.data.region;
          const state = res.data.region || res.data.country_name || "India";
          const locName = `${city}, ${state}`;

          setCustomLocations((prev) =>
            prev.includes(locName) ? prev : [locName, ...prev]
          );
          setSelectedLocation(locName);
          toast.success(`Location set to: ${locName}`, { id: "geo-toast" });
          return true;
        }
      } catch (e1) {
        try {
          const res2 = await axios.get("https://ip-api.com/json/?fields=city,regionName,country", { timeout: 4000 });
          if (res2.data && res2.data.city) {
            const locName = `${res2.data.city}, ${res2.data.regionName || "India"}`;
            setCustomLocations((prev) =>
              prev.includes(locName) ? prev : [locName, ...prev]
            );
            setSelectedLocation(locName);
            toast.success(`Location set to: ${locName}`, { id: "geo-toast" });
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
          toast.error("Location unavailable. Please select your city manually.", { id: "geo-toast" });
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
          const city =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.suburb ||
            address?.county ||
            "My Location";
          const state = address?.state || "India";
          const locationName = `${city}, ${state}`;

          setCustomLocations((prev) =>
            prev.includes(locationName) ? prev : [locationName, ...prev]
          );
          setSelectedLocation(locationName);
          toast.success(`Location set to: ${locationName}`, { id: "geo-toast" });
        } catch (err) {
          console.error("Reverse geocoding error, trying IP location:", err);
          const success = await fetchIpLocation();
          if (!success) {
            const fallbackLoc = `Current Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
            setCustomLocations((prev) =>
              prev.includes(fallbackLoc) ? prev : [fallbackLoc, ...prev]
            );
            setSelectedLocation(fallbackLoc);
            toast.success("📍 Set to GPS location", { id: "geo-toast" });
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
          toast.error("Location unavailable. Please select your city manually.", { id: "geo-toast" });
        }
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  // Booking & Add Service Modal State
  const [bookingService, setBookingService] = useState(null);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // Fetch Services 100% from backend MongoDB (/api/events)
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/events");
      if (Array.isArray(res.data)) {
        setServices(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch local services from MongoDB:", e);
      toast.error("Failed to load local services from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleBookmark = (id) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Removed from saved services", { icon: "🤍" });
      } else {
        next.add(id);
        toast.success("Saved to your wishlist!", { icon: "❤️" });
      }
      return next;
    });
  };

  const handleInitiateBooking = (service) => {
    if (!user) {
      toast.error("Please login to book a local service!");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    navigate("/payment", {
      state: {
        hotel: {
          name: service.title || "Local Service Reservation",
          location: service.location || selectedLocation,
          roomType: service.category || "Service Booking",
          pricePerNight: service.price || 1500,
        },
        checkInDate: selectedDate,
        checkOutDate: selectedDate,
        nights: 1,
        guestsCount: `${travelers}`,
        guestName: user?.name || "Guest",
        guestPhone: "+91 98765 43210",
        finalTotalPayment: service.price || 1500,
        basePriceTotal: service.price || 1500,
        discountAmount: 0,
        addOnsTotal: 0,
        serviceFee: 0,
      },
    });
  };

  const handlePaymentSuccess = (paymentData) => {
    setIsRazorpayOpen(false);
    toast.success(`🎉 Booking Confirmed! Pass ID: ${paymentData.paymentId}`);

    // Create ticket object and persist to localStorage so UserProfile picks it up
    const newTicket = {
      id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
      serviceTitle: bookingService?.title || "Local Service Booking",
      type: "Local Service",
      category: bookingService?.category || "Taxi & Cabs",
      location: bookingService?.location || selectedLocation,
      date: selectedDate,
      travelers: travelers,
      amountPaid: bookingService?.price || 1500,
      paymentId: paymentData.paymentId,
      bookingDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Confirmed",
      phone: bookingService?.phone || "+91 98320 12345",
    };

    const existingBookings = JSON.parse(
      localStorage.getItem("bharat_darshi_user_bookings") || "[]",
    );
    localStorage.setItem(
      "bharat_darshi_user_bookings",
      JSON.stringify([newTicket, ...existingBookings]),
    );

    // Dispatch custom event to refresh profile view
    window.dispatchEvent(new Event("bharat_darshi_booking_success"));

    setBookingService(null);
  };

  const categories = [
    "All",
    "Taxi & City Cabs",
    "Car Rentals (Self/Driver)",
    "Mountain & Outstation",
    "Airport Transfers",
    "Tours & Shuttles",
    "Tourist Guide",
    "Home 2 Wheeler",
    "Rent 4 Wheeler",
  ];

  // Filtering Logic
  const filteredServices = services
    .filter((srv) => {
      const catMatch =
        selectedCategory === "All" || srv.category === selectedCategory;
      const searchMatch =
        !searchTerm ||
        (srv.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (srv.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (srv.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (srv.category || "").toLowerCase().includes(searchTerm.toLowerCase());

      const locationMatch =
        !selectedLocation ||
        selectedLocation === "All Locations" ||
        (srv.city &&
          selectedLocation.toLowerCase().includes(srv.city.toLowerCase())) ||
        (srv.state &&
          selectedLocation.toLowerCase().includes(srv.state.toLowerCase())) ||
        (srv.location &&
          selectedLocation.toLowerCase().includes(srv.location.toLowerCase()));

      return catMatch && searchMatch && locationMatch;
    })
    .sort((a, b) => {
      if (sortBy === "Rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "Price: Low to High")
        return (a.price || 0) - (b.price || 0);
      if (sortBy === "Est. Year")
        return (a.estYear || "").localeCompare(b.estYear || "");
      return 0; // Default Recommended
    });

  const displayStateName = selectedLocation.includes("Sikkim")
    ? "Sikkim"
    : selectedLocation.split(",")[0];

  return (
    <div
      className="min-vh-100 text-dark pb-5"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* HERO BANNER SECTION */}
      <div
        className="position-relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0.65) 100%), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          minHeight: "560px",
          paddingTop: "135px",
          paddingBottom: "50px",
        }}
      >
        <div
          className="container max-w-7xl mx-auto px-3 px-md-4 position-relative"
          style={{ zIndex: 2 }}
        >
          <div className="row align-items-center g-4">
            {/* Left Hero Heading */}
            <div className="col-lg-6 force-white-text pe-lg-4">
              <h1
                className="display-3 fw-bold force-white-text mb-2"
                style={{
                  lineHeight: 1.08,
                  letterSpacing: "-1.5px",
                  fontSize: "3.6rem",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Find Verified <br />
                Services <br />
                <span
                  className="yellow-text text-warning"
                  style={{ color: "#facc15", WebkitTextFillColor: "#facc15" }}
                >
                  in Your Location
                </span>
              </h1>
              <p
                className="fs-6 force-white-text max-w-xl mt-3 mb-4 fw-bold"
                style={{
                  lineHeight: 1.6,
                  fontSize: "1.05rem",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                  opacity: 1,
                  fontWeight: 700,
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.5)",
                }}
              >
                Trusted Taxi, Cab Rentals, and Tour Operators for local travel
                and outstation circuits across Gangtok, Pelling &amp; North
                Sikkim.
              </p>
            </div>

            {/* Right Hero Floating Search Box */}
            <div className="col-lg-6">
              <div
                className="bg-white text-dark p-4 rounded-4 shadow-2xl border-0"
                style={{
                  borderRadius: "24px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                }}
              >
                <div className="row g-3">
                  {/* Where are you going */}
                  <div className="col-md-6">
                    <label
                      className="form-label text-dark fw-bold mb-1"
                      style={{ fontSize: "0.84rem" }}
                    >
                      Where are you going?
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
                          value={selectedLocation}
                          onChange={(e) => {
                            if (e.target.value === "AUTO_DETECT") {
                              handleDetectLocation();
                            } else {
                              setSelectedLocation(e.target.value);
                            }
                          }}
                          style={{
                            fontSize: "0.88rem",
                            height: "44px",
                            borderRadius: "10px",
                          }}
                        >
                          <option value="AUTO_DETECT">
                            Auto-Detect My Location
                          </option>

                          {/* Custom detected location options */}
                          {customLocations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}

                          <option value="Gangtok, Sikkim">Gangtok, Sikkim</option>
                          <option value="Ujjain, Madhya Pradesh">
                            Ujjain, Madhya Pradesh
                          </option>
                          <option value="Jaipur, Rajasthan">
                            Jaipur, Rajasthan
                          </option>
                          <option value="Leh, Ladakh">Leh, Ladakh</option>
                          <option value="Varanasi, Uttar Pradesh">
                            Varanasi, Uttar Pradesh
                          </option>
                          <option value="Mumbai, Maharashtra">
                            Mumbai, Maharashtra
                          </option>
                          <option value="South Goa">South Goa</option>
                          <option value="All Locations">
                            All Locations in India
                          </option>
                        </select>
                      </div>

                      {/* Location Icon Button OUTSIDE of the input box */}
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="btn btn-warning rounded-3 p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm hover-scale"
                        title="Auto-detect current location"
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

                  {/* What do you need */}
                  <div className="col-md-6">
                    <label
                      className="form-label text-dark fw-bold mb-1"
                      style={{ fontSize: "0.84rem" }}
                    >
                      What do you need?
                    </label>
                    <div className="position-relative">
                      <Car
                        size={17}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        style={{ zIndex: 5 }}
                      />
                      <select
                        className="form-select ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                          fontSize: "0.88rem",
                          height: "44px",
                          borderRadius: "10px",
                          color: "#111827",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        {categories.map((catName) => (
                          <option
                            key={catName}
                            value={catName}
                            style={{
                              color: "#111827",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            {catName === "All" ? "All Services" : catName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* When */}
                  <div className="col-md-6">
                    <label
                      className="form-label text-dark fw-bold mb-1"
                      style={{ fontSize: "0.84rem" }}
                    >
                      When are you going?
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
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                          fontSize: "0.88rem",
                          height: "44px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Travelers */}
                  <div className="col-md-6">
                    <label
                      className="form-label text-dark fw-bold mb-1"
                      style={{ fontSize: "0.84rem" }}
                    >
                      How many travelers?
                    </label>
                    <div className="position-relative">
                      <Users
                        size={17}
                        className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                        style={{ zIndex: 5 }}
                      />
                      <select
                        className="form-select ps-5 py-2 rounded-3 border-secondary border-opacity-25 bg-light fw-semibold text-dark"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        style={{
                          fontSize: "0.88rem",
                          height: "44px",
                          borderRadius: "10px",
                        }}
                      >
                        <option value="1 Person">1 Person</option>
                        <option value="2 People">2 People</option>
                        <option value="3-4 People">3-4 People</option>
                        <option value="5+ People">5+ People</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Guarantee Badges Row */}
                <div className="d-flex align-items-center gap-3 my-3 pt-2">
                  <div
                    className="d-flex align-items-center gap-2 small fw-semibold"
                    style={{ color: "#059669" }}
                  >
                    <CheckCircle
                      size={15}
                      style={{ color: "#10b981" }}
                      className="flex-shrink-0"
                    />{" "}
                    <span>Best Price Guarantee</span>
                  </div>
                  <div
                    className="d-flex align-items-center gap-2 small fw-semibold"
                    style={{ color: "#059669" }}
                  >
                    <CheckCircle
                      size={15}
                      style={{ color: "#10b981" }}
                      className="flex-shrink-0"
                    />{" "}
                    <span>Verified Local Partners</span>
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  onClick={() =>
                    toast.success(
                      `Searching best services in ${selectedLocation}...`,
                    )
                  }
                  className="btn w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow hover-scale"
                  style={{
                    backgroundColor: "#f97316",
                    borderColor: "#f97316",
                    color: "#ffffff",
                    borderRadius: "14px",
                    fontSize: "0.95rem",
                  }}
                >
                  <span className="text-white fw-bold">
                    Find Best Services →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST METRICS BAR */}
      <div
        className="container max-w-7xl mx-auto px-3 px-md-4 my-4"
        style={{ marginTop: "-15px" }}
      >
        <div
          className="bg-white rounded-4 shadow-sm p-4 border border-light"
          style={{ borderRadius: "20px" }}
        >
          <div className="row align-items-center text-center text-md-start g-3 g-lg-4">
            {/* Metric 1 */}
            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start border-end-md border-light pe-lg-3">
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 46, height: 46 }}
              >
                <CheckCircle size={22} style={{ color: "#10b981" }} />
              </div>
              <div className="ps-1">
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "1.15rem", lineHeight: 1.2 }}
                >
                  250+
                </h5>
                <small
                  className="text-muted text-nowrap"
                  style={{ fontSize: "0.78rem" }}
                >
                  Verified Partners
                </small>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start border-end-md border-light pe-lg-3">
              <div
                className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 46, height: 46 }}
              >
                <Star
                  size={22}
                  className="fill-warning"
                  style={{ color: "#f59e0b" }}
                />
              </div>
              <div className="ps-1">
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "1.15rem", lineHeight: 1.2 }}
                >
                  4.8 ★
                </h5>
                <small
                  className="text-muted text-nowrap"
                  style={{ fontSize: "0.78rem" }}
                >
                  Average Rating
                </small>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start border-end-md border-light pe-lg-3">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 46, height: 46 }}
              >
                <Users size={22} style={{ color: "#3b82f6" }} />
              </div>
              <div className="ps-1">
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "1.15rem", lineHeight: 1.2 }}
                >
                  50K+
                </h5>
                <small
                  className="text-muted text-nowrap"
                  style={{ fontSize: "0.78rem" }}
                >
                  Happy Travelers
                </small>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="col-lg-2 col-md-4 col-6 d-flex align-items-center gap-3 justify-content-center justify-content-md-start border-end-md border-light pe-lg-3">
              <div
                className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 46, height: 46 }}
              >
                <Headphones size={22} style={{ color: "#06b6d4" }} />
              </div>
              <div className="ps-1">
                <h5
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "1.15rem", lineHeight: 1.2 }}
                >
                  24/7
                </h5>
                <small
                  className="text-muted text-nowrap"
                  style={{ fontSize: "0.78rem" }}
                >
                  Customer Support
                </small>
              </div>
            </div>

            {/* Metric 5 */}
            <div className="col-lg-4 col-md-8 col-12 d-flex align-items-center gap-3 justify-content-center justify-content-md-start ps-lg-4">
              <div
                className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 46, height: 46 }}
              >
                <ShieldCheck size={24} style={{ color: "#f59e0b" }} />
              </div>
              <div className="ps-1">
                <h6
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: "0.92rem", lineHeight: 1.2 }}
                >
                  Verified Local Network
                </h6>
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.76rem" }}
                >
                  All partners are background verified for safe travel
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY PILLS SECTION */}
      <div className="container max-w-7xl mx-auto px-3 px-md-4 my-4">
        <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.1rem" }}>
          Browse by Service Type
        </h5>
        <div className="d-flex flex-wrap align-items-center gap-2.5">
          {categories.map((catLabel) => {
            const isActive = selectedCategory === catLabel;
            return (
              <button
                key={catLabel}
                onClick={() => setSelectedCategory(catLabel)}
                className={`btn rounded-pill px-3.5 py-2 text-nowrap transition-all fw-semibold ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-dark bg-white border border-secondary border-opacity-20 hover-bg-light"
                }`}
                style={{
                  fontSize: "0.86rem",
                  backgroundColor: isActive ? "#f59e0b" : "#ffffff",
                  borderColor: isActive ? "#f59e0b" : "rgba(0,0,0,0.12)",
                  color: isActive ? "#ffffff" : "#374151",
                  borderRadius: "14px",
                }}
              >
                <span>{catLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN SERVICE LISTINGS SECTION */}
      <div className="container max-w-7xl mx-auto px-3 px-md-4 mt-4">
        {/* Header Row */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div className="d-flex align-items-center gap-2.5">
            <h3
              className="fw-bold text-dark mb-0"
              style={{ fontSize: "1.35rem" }}
            >
              Top Verified Services in {displayStateName}
            </h3>
            <span
              className="badge rounded-pill px-3 py-1.5 small fw-semibold"
              style={{
                backgroundColor: "#dcfce7",
                color: "#166534",
                border: "1px solid #bbf7d0",
              }}
            >
              Handpicked for you
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Search Input */}
            <div className="position-relative">
              <Search
                size={15}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />
              <input
                type="text"
                className="form-control form-control-sm ps-5 py-2 rounded-pill bg-white border-secondary border-opacity-20"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "200px" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-link text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <SlidersHorizontal size={14} className="text-secondary" />
              <small className="text-muted fw-semibold">Sort by:</small>
              <select
                className="form-select form-select-sm rounded-3 bg-white border-secondary border-opacity-20 fw-semibold text-dark"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: "160px" }}
              >
                <option value="Recommended">Recommended</option>
                <option value="Rating">Highest Rating</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Est. Year">Est. Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-warning mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">
                Loading services from MongoDB...
              </span>
            </div>
            <p className="text-muted">
              Fetching verified local services from MongoDB backend...
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-4 p-5 text-center shadow-sm border my-4">
            <Car size={48} className="text-warning mb-3 opacity-75" />
            <h4 className="fw-bold text-dark mb-1">
              No Verified Services Found
            </h4>
            <p className="text-muted small mb-3">
              We couldn't find services matching "{selectedCategory}" in{" "}
              {selectedLocation}.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedLocation("All Locations");
                setSearchTerm("");
              }}
              className="btn btn-warning text-white rounded-pill px-4"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="row g-4">
            {filteredServices.map((srv) => {
              const isBookmarked = bookmarkedIds.has(srv.id || srv._id);
              const cardId = srv.id || srv._id;
              const formattedPrice = srv.price
                ? `₹${srv.price.toLocaleString("en-IN")}`
                : "₹1,500";

              return (
                <div key={cardId} className="col-lg-4 col-md-6 col-12 d-flex">
                  <div
                    className="card bg-white text-dark rounded-4 overflow-hidden border border-secondary border-opacity-15 w-100 d-flex flex-column shadow-sm hover-shadow-md transition-all"
                    style={{ borderRadius: "20px" }}
                  >
                    {/* Image Header with Heart Bookmark */}
                    <div
                      className="position-relative overflow-hidden"
                      style={{ height: "210px" }}
                    >
                      <img
                        src={
                          srv.image ||
                          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={srv.title}
                        onClick={() =>
                          navigate(`/service/${srv._id || srv.id}`, {
                            state: { service: srv },
                          })
                        }
                        className="w-100 h-100 object-fit-cover transition-transform hover-scale-105 cursor-pointer"
                      />
                      <button
                        onClick={() => handleToggleBookmark(cardId)}
                        className="btn btn-white rounded-circle p-2 position-absolute top-0 start-0 m-3 shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          width: 36,
                          height: 36,
                          backgroundColor: "#ffffff",
                        }}
                        title="Save to Wishlist"
                      >
                        <Heart
                          size={18}
                          className={
                            isBookmarked
                              ? "text-danger fill-danger"
                              : "text-secondary"
                          }
                        />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      {/* Title & Verified Badge Row */}
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                        <h5
                          onClick={() =>
                            navigate(`/service/${srv._id || srv.id}`, {
                              state: { service: srv },
                            })
                          }
                          className="fw-bold text-dark mb-0 cursor-pointer hover-text-warning"
                          style={{ fontSize: "1.15rem", lineHeight: 1.3 }}
                        >
                          {srv.title}
                        </h5>
                        <span
                          className="badge rounded-pill px-2.5 py-1 small font-mono flex-shrink-0 fw-bold"
                          style={{
                            backgroundColor: "#ecfdf5",
                            color: "#10b981",
                            border: "1px solid #10b981",
                            fontSize: "0.72rem",
                          }}
                        >
                          ✓ VERIFIED
                        </span>
                      </div>

                      {/* Category Subtitle */}
                      <p
                        className="text-secondary small mb-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {srv.category || "Taxi Service / Cab"}
                      </p>

                      {/* Rating Row */}
                      <div className="d-flex align-items-center gap-1.5 mb-2.5">
                        <Star
                          size={16}
                          className="text-warning fill-warning"
                          style={{ color: "#f59e0b" }}
                        />
                        <span className="fw-bold text-dark small">
                          {srv.rating || 4.8}
                        </span>
                        <span className="text-muted small">
                          ({srv.reviewsCount || 185} Reviews)
                        </span>
                      </div>

                      {/* Address / Location Row */}
                      <div className="d-flex align-items-center gap-2 text-secondary small mb-3">
                        <MapPin
                          size={15}
                          className="text-danger flex-shrink-0"
                        />
                        <span className="text-truncate">
                          {srv.location ||
                            `${srv.city || "Gangtok"}, ${srv.state || "Sikkim"}`}
                        </span>
                      </div>

                      {/* Operating Hours & Est. Year Row */}
                      <div className="d-flex align-items-center justify-content-between bg-light p-2.5 rounded-3 mb-3 border border-light">
                        <div
                          className="d-flex align-items-center gap-1.5 fw-semibold small"
                          style={{ color: "#059669" }}
                        >
                          <span
                            className="rounded-circle d-inline-block"
                            style={{
                              width: 8,
                              height: 8,
                              backgroundColor: "#10b981",
                            }}
                          ></span>
                          <span>
                            {srv.openingHours || "Open until 11:00 PM"}
                          </span>
                        </div>
                        <small className="text-muted fw-medium">
                          {srv.estYear || "Est. 2012"}
                        </small>
                      </div>

                      {/* Feature Pills */}
                      <div className="d-flex flex-wrap gap-1.5 mb-4">
                        {(srv.tags && srv.tags.length > 0
                          ? srv.tags
                          : ["Local Expert", "Clean Vehicles", "On-Time"]
                        ).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-light text-secondary rounded-2 px-2.5 py-1 small fw-medium border border-secondary border-opacity-10"
                            style={{ fontSize: "0.76rem" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Footer Price & Book Service Button */}
                      <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between gap-2">
                        <div>
                          <small
                            className="text-muted d-block"
                            style={{ fontSize: "0.72rem" }}
                          >
                            ESTIMATED RATE
                          </small>
                          <span className="fw-bold text-dark fs-5">
                            {formattedPrice}
                          </span>
                          <small className="text-muted"> / day</small>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/service/${srv._id || srv.id}`, {
                                state: { service: srv },
                              })
                            }
                            className="btn text-white font-bold btn-sm rounded-pill px-4 py-2 shadow-sm d-inline-flex align-items-center gap-1.5 hover-scale"
                            style={{
                              backgroundColor: "#f97316",
                              borderColor: "#f97316",
                            }}
                          >
                            <span>View Details</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocalEvents;
