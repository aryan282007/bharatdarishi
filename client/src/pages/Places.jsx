import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterest, setSelectedInterest] = useState("Interests");
  const [selectedRegion, setSelectedRegion] = useState("Regions");

  // Hover pause states for smooth carousel interaction
  const [isPopularHovered, setIsPopularHovered] = useState(false);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState(false);

  // Popular Carousel Ref & Scroll by 1 card view (width 290px + gap 24px = 314px)
  const popularRef = useRef(null);
  const scrollPopular = (direction) => {
    if (popularRef.current) {
      const step = 314;
      const amount = direction === "left" ? -step : step;
      popularRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Featured Carousel Index State
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Fetch places from API
  useEffect(() => {
    async function fetchPlaces() {
      try {
        setLoading(true);
        const res = await axios.get("/api/places");
        if (res.data && Array.isArray(res.data)) {
          setPlaces(res.data);
        }
      } catch (err) {
        console.error("Error fetching places:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaces();
  }, []);

  // Popular list directly from MongoDB places
  const popularItems = places
    .map((p) => ({
      id: p.id || p._id,
      name: p.name,
      city: p.city || p.location?.split(",")[0] || p.state,
      state: p.state || "India",
      category: p.category || "Heritage Monument",
      image: p.image,
    }))
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );

  // Featured list directly from MongoDB places
  const featuredItems = places
    .map((p) => ({
      id: p.id || p._id,
      name: p.name,
      description:
        p.subtitle ||
        p.description ||
        `${p.name} - Cultural heritage landmark located in ${p.state || "India"}`,
      state: p.state || "India",
      image: p.image,
    }))
    .filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.name === item.name),
    );

  // CONTINUOUS AUTO-SCROLLING FOR POPULAR SECTION (Slides 1 card at a time, pauses on hover)
  useEffect(() => {
    if (isPopularHovered) return;
    const popularTimer = setInterval(() => {
      if (popularRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = popularRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          popularRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          popularRef.current.scrollBy({ left: 314, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(popularTimer);
  }, [isPopularHovered]);

  // CONTINUOUS AUTO-SCROLLING FOR FEATURED SECTION (Smooth 5s cycle, pauses on hover)
  useEffect(() => {
    if (isFeaturedHovered || !featuredItems.length) return;
    const featuredTimer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(featuredTimer);
  }, [isFeaturedHovered, featuredItems.length]);

  // Filtering popular items based on search input & selects
  const filteredPopular = popularItems.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchInterest =
      selectedInterest === "Interests" ||
      selectedInterest === "All Interests" ||
      item.category === selectedInterest;
    const matchRegion =
      selectedRegion === "Regions" ||
      selectedRegion === "All Regions" ||
      item.state.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchSearch && matchInterest && matchRegion;
  });

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const prevFeatured = () => {
    setFeaturedIndex(
      (prev) => (prev - 1 + featuredItems.length) % featuredItems.length,
    );
  };

  const currentFeatured = featuredItems[featuredIndex];
  const prevFeaturedItem =
    featuredItems[
      (featuredIndex - 1 + featuredItems.length) % featuredItems.length
    ];
  const nextFeaturedItem =
    featuredItems[(featuredIndex + 1) % featuredItems.length];

  return (
    <div
      className="min-vh-100 position-relative"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* ========================================== */}
      {/* HERO SECTION (100VH FULLSCREEN HERO BANNER) */}
      {/* ========================================== */}
      <div
        className="w-100 position-relative d-flex align-items-center justify-content-center overflow-hidden"
        style={{
          height: "100vh",
          minHeight: "100vh",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1920'), url('/temples/pemayangtse.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="text-center text-white px-3 position-relative z-2">
          {/* Subtitle */}
          <p
            className="text-white text-capitalize m-0 mb-1 force-white-text"
            style={{
              fontSize: "1.35rem",
              fontWeight: 400,
              letterSpacing: "1.5px",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.8)",
            }}
          >
            Incredible
          </p>

          {/* Main Hero Title */}
          <h1
            className="text-white fw-black m-0 force-white-text"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 6.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.5px",
              fontFamily: "'Inter', 'Arial Black', sans-serif",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.9)",
              lineHeight: 1.05,
            }}
          >
            Attractions
          </h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 1: SEARCH & FILTER DROPDOWNS       */}
      {/* ========================================== */}
      <div className="container py-4">
        <div className="d-flex flex-column align-items-center justify-content-center gap-3">
          {/* Centered Search Bar Input */}
          <div
            className="position-relative w-100"
            style={{ maxWidth: "480px" }}
          >
            <input
              type="text"
              className="form-control text-center py-2.5 px-4 shadow-none border-0"
              placeholder="Search all attractions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: "#eaeaea",
                borderRadius: "8px",
                fontSize: "0.92rem",
                color: "#333333",
                fontStyle: "italic",
              }}
            />
            <Search
              size={16}
              className="position-absolute end-0 top-50 translate-middle-y me-3 text-danger"
              style={{ color: "#dc2626" }}
            />
          </div>

          {/* Select Dropdown Filters Row */}
          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select text-dark shadow-none cursor-pointer"
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              style={{
                width: "180px",
                borderRadius: "4px",
                borderColor: "#b0b0b0",
                fontSize: "0.85rem",
                fontWeight: 600,
                backgroundColor: "#ffffff",
              }}
            >
              <option value="Interests">Interests</option>
              <option value="All Interests">All Interests</option>
              <option value="Sacred Shrines">Sacred Shrines</option>
              <option value="UNESCO Monuments">UNESCO Monuments</option>
              <option value="Dams & Natural Lakes">Dams & Lakes</option>
              <option value="Geological Wonders">Geological Wonders</option>
            </select>

            <select
              className="form-select text-dark shadow-none cursor-pointer"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                width: "180px",
                borderRadius: "4px",
                borderColor: "#b0b0b0",
                fontSize: "0.85rem",
                fontWeight: 600,
                backgroundColor: "#ffffff",
              }}
            >
              <option value="Regions">Regions</option>
              <option value="All Regions">All Regions</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Ladakh">Ladakh</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 2: POPULAR ATTRACTIONS (4 CARDS)   */}
      {/* ========================================== */}
      <div
        className="w-100 py-5 position-relative"
        style={{
          backgroundColor: "#f7f8fa",
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div className="container max-w-7xl mx-auto text-center px-3 px-md-4">
          {/* POPULAR Watermark Title & Subtitle */}
          <div className="mb-4">
            <h2
              className="display-2 fw-black m-0 tracking-wider text-uppercase"
              style={{
                color: "#38bdf8",
                fontWeight: 900,
                letterSpacing: "3px",
                fontFamily: "'Arial Black', sans-serif",
                opacity: 0.9,
              }}
            >
              POPULAR
            </h2>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
              <span
                style={{
                  width: "30px",
                  height: "1px",
                  backgroundColor: "#38bdf8",
                }}
              ></span>
              <span
                className="fw-medium small"
                style={{ color: "#38bdf8", letterSpacing: "1.5px" }}
              >
                Attractions
              </span>
              <span
                style={{
                  width: "30px",
                  height: "1px",
                  backgroundColor: "#38bdf8",
                }}
              ></span>
            </div>
          </div>

          {/* 4 Wider Cards Row - Edge-to-Edge Grid / Horizontal Carousel */}
          <div
            ref={popularRef}
            onMouseEnter={() => setIsPopularHovered(true)}
            onMouseLeave={() => setIsPopularHovered(false)}
            className="d-flex gap-4 overflow-x-auto pt-5 pb-4 no-scrollbar align-items-end justify-content-start justify-content-lg-center"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingTop: "28px",
              paddingBottom: "24px",
            }}
          >
            {filteredPopular.map((item, idx) => (
              <PopularCard key={idx} item={item} />
            ))}
          </div>

          {/* Bottom Arrow Controls */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
            <button
              onClick={() => scrollPopular("left")}
              className="btn btn-link text-dark p-1 border-0 shadow-none hover-scale"
              title="Previous Card"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scrollPopular("right")}
              className="btn btn-link text-dark p-1 border-0 shadow-none hover-scale"
              title="Next Card"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 3: FEATURED ATTRACTIONS (YELLOW BG) */}
      {/* ========================================== */}
      <div
        className="w-100 py-5 position-relative overflow-hidden"
        style={{
          backgroundColor: "#facc15",
          background:
            "linear-gradient(135deg, #facc15 0%, #eab308 50%, #d97706 100%)",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.15)",
        }}
      >
        {/* Background Subtle Radial Glow */}
        <div
          className="position-absolute rounded-circle pointer-events-none"
          style={{
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(50px)",
            zIndex: 0,
          }}
        ></div>

        <div className="container text-center position-relative z-1">
          {/* FEATURED Watermark Title & Subtitle */}
          <div className="mb-4">
            <h2
              className="display-2 fw-black m-0 tracking-wider text-uppercase text-white"
              style={{
                fontWeight: 900,
                letterSpacing: "3px",
                fontFamily: "'Arial Black', sans-serif",
                textShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              FEATURED
            </h2>
            <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
              <span
                style={{
                  width: "30px",
                  height: "1px",
                  backgroundColor: "#ffffff",
                }}
              ></span>
              <span
                className="fw-medium small text-white"
                style={{ letterSpacing: "1.5px" }}
              >
                Attractions
              </span>
              <span
                style={{
                  width: "30px",
                  height: "1px",
                  backgroundColor: "#ffffff",
                }}
              ></span>
            </div>
          </div>

          {/* Featured Slider Carousel Deck Container (Fixed Dimensions - No Collapsing) */}
          <div
            onMouseEnter={() => setIsFeaturedHovered(true)}
            onMouseLeave={() => setIsFeaturedHovered(false)}
            className="position-relative d-flex align-items-center justify-content-center my-4 py-3"
            style={{ height: "420px", overflow: "hidden" }}
          >
            {featuredItems.map((item, idx) => {
              let offset = (idx - featuredIndex) % featuredItems.length;
              if (offset > 1) offset -= featuredItems.length;
              if (offset < -1) offset += featuredItems.length;

              const isCenter = offset === 0;
              const isRight = offset === 1;
              const isLeft = offset === -1;
              const isVisible = isCenter || isRight || isLeft;

              // Responsive smooth horizontal positions
              const xPos = isCenter
                ? "0px"
                : isRight
                  ? "440px"
                  : isLeft
                    ? "-440px"
                    : offset > 0
                      ? "900px"
                      : "-900px";

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: xPos,
                    scale: isCenter ? 1 : 0.42,
                    zIndex: isCenter ? 10 : isVisible ? 5 : 0,
                    opacity: isVisible ? 1 : 0,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    position: "absolute",
                    width: "100%",
                    maxWidth: "760px",
                    height: "390px",
                    cursor: isCenter ? "default" : "pointer",
                    transformOrigin: "center center",
                  }}
                  onClick={() => {
                    if (isRight) nextFeatured();
                    if (isLeft) prevFeatured();
                  }}
                >
                  <FeaturedCenterCard place={item} />
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Arrow Controls for Featured Slider */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
            <button
              onClick={prevFeatured}
              className="btn btn-light rounded-circle p-2 shadow-lg border-0 d-flex align-items-center justify-content-center transition-all hover-scale"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#ffffff",
              }}
              title="Previous Featured"
            >
              <ChevronLeft size={22} className="text-dark" />
            </button>
            <button
              onClick={nextFeatured}
              className="btn btn-light rounded-circle p-2 shadow-lg border-0 d-flex align-items-center justify-content-center transition-all hover-scale"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "#ffffff",
              }}
              title="Next Featured"
            >
              <ChevronRight size={22} className="text-dark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Main Center Featured Card with Hover Animation
function FeaturedCenterCard({ place }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/place/${place.id}`}
      className="text-decoration-none w-100"
      style={{ maxWidth: "780px", zIndex: 2 }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-4 overflow-hidden position-relative w-100 transition-all"
        style={{
          height: "390px",
          borderRadius: "24px",
          transform: isHovered
            ? "translateY(-8px) scale(1.02)"
            : "translateY(0) scale(1)",
          boxShadow: isHovered
            ? "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(250, 204, 21, 0.3)"
            : "0 20px 45px rgba(0, 0, 0, 0.35)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          border: isHovered
            ? "2px solid #facc15"
            : "2px solid rgba(255,255,255,0.3)",
        }}
      >
        <img
          src={place.image}
          alt={place.name}
          className="w-100 h-100 object-fit-cover"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Dark Gradient Overlay */}
        <div
          className="position-absolute inset-0 d-flex flex-column justify-content-end p-4 p-md-5 text-start"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-2 text-white">
            <div>
              <h3
                className="fw-bold mb-1 display-6 force-white-text place-card-title"
                style={{
                  color: isHovered ? "#facc15" : "#ffffff",
                  fontWeight: 800,
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  transition: "color 0.3s ease",
                }}
              >
                {place.name}
              </h3>
              <p
                className="small m-0 text-white force-white-text max-w-500"
                style={{
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  lineHeight: "1.4",
                  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                {place.description}
              </p>
            </div>

            <div className="text-md-end font-semibold text-white">
              <span
                className="fw-bold fs-6 badge bg-warning text-dark px-3 py-1.5 rounded-pill shadow-sm"
                style={{ textShadow: "none", backgroundColor: "#facc15" }}
              >
                {place.state}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Sub-component for individual Popular Attraction Card with Explore Button & Hover Animation
function PopularCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        flex: "0 0 290px",
        minWidth: "290px",
        maxWidth: "290px",
        paddingTop: "18px",
        paddingBottom: "18px",
      }}
    >
      <Link to={`/place/${item.id}`} className="text-decoration-none w-100">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="overflow-hidden position-relative w-100 transition-all"
          style={{
            height: "430px",
            borderRadius: "18px",
            transform: isHovered
              ? "translateY(-14px) scale(1.02)"
              : "translateY(0) scale(1)",
            boxShadow: isHovered
              ? "0 25px 50px rgba(0, 0, 0, 0.45)"
              : "0 8px 24px rgba(0, 0, 0, 0.15)",
            transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            backgroundColor: "#000000",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-100 h-100 object-fit-cover"
            style={{
              transform: isHovered ? "scale(1.07)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />

          {/* Dark Overlay at Bottom with Title, Larger City & Red Explore Button */}
          <div
            className="position-absolute inset-0 d-flex flex-column justify-content-end p-4 text-center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.5) 45%, rgba(0, 0, 0, 0) 75%)",
            }}
          >
            <div
              className="d-flex flex-column align-items-center justify-content-end"
              style={{ paddingBottom: "28px" }}
            >
              {/* Attraction Title (e.g. Aga Khan Palace) */}
              <h5
                className="text-white m-0 lh-tight force-white-text place-card-title"
                style={{
                  color: "#ffffff",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.9)",
                }}
              >
                {item.name}
              </h5>

              {/* City Name (Larger & Extra Bold, e.g. Pune / Ahmedabad) */}
              <h3
                className="text-white m-0 mt-0.5 fw-black force-white-text place-card-title"
                style={{
                  color: "#ffffff",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                  letterSpacing: "0.2px",
                }}
              >
                {item.city}
              </h3>

              {/* Yellow Explore Button */}
              <div
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(0px)" : "translateY(14px)",
                  maxHeight: isHovered ? "48px" : "0px",
                  marginTop: isHovered ? "10px" : "0px",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  overflow: "hidden",
                }}
              >
                <span
                  className="btn fw-bold border-0 shadow-lg"
                  style={{
                    backgroundColor: "#facc15",
                    color: "#000000",
                    borderRadius: "50px",
                    padding: "7px 30px",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    letterSpacing: "0.2px",
                    display: "inline-block",
                  }}
                >
                  Explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Places;
