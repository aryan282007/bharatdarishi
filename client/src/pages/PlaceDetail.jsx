import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Navigation as NavIcon,
} from "lucide-react";
import axios from "axios";
import styles from "../styles/custom.module.css";

// Sub-component for individual experience card with smooth hover animation
function ExperienceItemCard({ exp }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        flex: "0 0 310px",
        minWidth: "310px",
        maxWidth: "310px",
        scrollSnapAlign: "start",
      }}
    >
      <Link
        to={`/place/${exp.targetPlaceId || "shanti-stupa"}`}
        className="text-decoration-none"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="rounded-4 overflow-hidden bg-white h-100 transition-all"
          style={{
            border: isHovered
              ? "1px solid rgba(217, 119, 6, 0.6)"
              : "1px solid rgba(217, 119, 6, 0.2)",
            transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
            boxShadow: isHovered
              ? "0 20px 40px rgba(217, 119, 6, 0.18), 0 8px 16px rgba(0,0,0,0.08)"
              : "0 6px 18px rgba(0, 0, 0, 0.05)",
            transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            cursor: "pointer",
          }}
        >
          <div style={{ height: "200px" }} className="overflow-hidden position-relative">
            <img
              src={exp.image}
              alt={exp.title}
              className="w-100 h-100 object-fit-cover"
              style={{
                transform: isHovered ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
          <div
            className="p-4 text-dark d-flex align-items-center bg-white"
            style={{
              minHeight: "120px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <h6
              className="fw-bold m-0 lh-base text-dark fs-6"
              style={{
                color: isHovered ? "#d97706" : "#111827",
                fontFamily: "'Inter', sans-serif",
                transition: "color 0.3s ease",
              }}
            >
              {exp.title}
            </h6>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PlaceDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [readMore, setReadMore] = useState(true);

  const [allPlaces, setAllPlaces] = useState([]);

  // Scroll ref for horizontal experiences carousel
  const expScrollRef = useRef(null);

  const scrollExperiences = (direction) => {
    if (expScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      expScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let placeData = null;

        // Try direct place detail API
        try {
          const res = await axios.get(`/api/places/${id}`);
          if (res.data && (res.data.id || res.data._id)) {
            placeData = res.data;
          }
        } catch (err) {
          console.warn("Direct place detail API miss, trying all places fallback:", err);
        }

        // Fetch all places list
        let placesList = [];
        try {
          const resList = await axios.get("/api/places");
          if (resList.data && Array.isArray(resList.data)) {
            placesList = resList.data;
            setAllPlaces(placesList);
          }
        } catch (err) {
          console.error("All places API fetch error:", err);
        }

        // If direct detail missed, check loaded places list from MongoDB
        if (!placeData && placesList.length > 0) {
          const cleanId = (id || "").toLowerCase();
          const matched = placesList.find(
            (p) =>
              p.id === id ||
              p._id === id ||
              (p.id && cleanId.includes(p.id.toLowerCase())) ||
              (p.name && cleanId.includes(p.name.toLowerCase().replace(/\s+/g, "-"))) ||
              (p.name && p.name.toLowerCase().replace(/\s+/g, "-").includes(cleanId))
          );
          if (matched) {
            placeData = matched;
          }
        }

        if (placeData) {
          setPlace(placeData);
          setError(null);
        } else {
          setError("Place not found in MongoDB");
        }
      } catch (err) {
        console.error("API place detail error:", err);
        setError("Place not found in MongoDB");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place?.name || "Attractive Place",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f7f6f0", color: "#111827", paddingTop: "120px" }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading details...</span>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div
        className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3"
        style={{ backgroundColor: "#f7f6f0", color: "#111827", paddingTop: "120px" }}
      >
        <h2 className="text-warning mb-3 fw-bold">Place Not Found</h2>
        <p className="text-secondary mb-4">
          The requested place details could not be loaded from MongoDB.
        </p>
        <Link to="/places" className="btn btn-warning rounded-pill px-4 fw-bold">
          <ArrowLeft size={16} className="me-2" /> Back to Places
        </Link>
      </div>
    );
  }

  // Directly render MongoDB fields
  const blogTitle = place.blog?.title || place.name;
  
  const leadParas = place.blog?.leadParagraphs?.length
    ? place.blog.leadParagraphs
    : place.leadParagraphs && place.leadParagraphs.length > 0
    ? place.leadParagraphs
    : place.description
    ? [place.description]
    : [];

  const rawSections = place.blog?.sections?.length
    ? place.blog.sections
    : place.sections && place.sections.length > 0
    ? place.sections
    : [];

  const blogSections = rawSections.filter(
    (sec, idx, self) => idx === self.findIndex((s) => s.title === sec.title)
  );

  // Build complete list of experiences combining specific place experiences + all MongoDB places
  const combinedList = [
    ...(place.relatedExperiences || []),
    ...allPlaces.map((p) => ({
      title: `${p.name} - ${p.subtitle || p.category || "Must Visit Destination"}`,
      image: p.image,
      targetPlaceId: p.id || p._id,
      state: p.state,
    })),
    {
      title: "Haven't taken a road trip to Ladakh? Don't wait any longer!",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "shanti-stupa",
    },
    {
      title: "Leh & Ladakh - In the lap of the Himalayas",
      image:
        "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "shanti-stupa",
    },
    {
      title: "Monasteries in Ladakh: The living heritage of Buddhism",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "sanchi-stupa",
    },
    {
      title: "The orchard of charm in Nubra Valley",
      image:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "shanti-stupa",
    },
    {
      title: "Exploring Diu Fortress and Coastal Naida Caves",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "naida-caves",
    },
    {
      title: "Sunset Serenity at Netarhat Sunset Point & Pine Forests",
      image:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "netarhat-dam",
    },
    {
      title: "Sacred Darshan at Dwarkadhish Jagat Mandir & Gomti Ghat",
      image:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "dwarkadhish-temple",
    },
    {
      title: "Spiritual Corridor Walk & Grand Evening Aarti at Ujjain",
      image:
        "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=600",
      targetPlaceId: "mahakal-lok-corridor",
    },
  ];

  // Deduplicate array by title so user gets 10+ unique cards to scroll
  const experiencesList = combinedList.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.title === item.title),
  );

  return (
    <div
      data-theme="light"
      className="min-vh-100 pb-5 position-relative"
      style={{ backgroundColor: "#f7f6f0", color: "#111827" }}
    >
      {/* Top 100vh Full-Bleed Hero Banner Section */}
      <div
        className="position-relative w-100 overflow-hidden"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        <img
          src={place.image}
          alt={place.name}
          className="w-100 h-100 object-fit-cover"
        />
        <div
          className="position-absolute inset-0 d-flex flex-column justify-content-between p-4 p-md-5"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: "100px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.65) 100%)",
          }}
        >
          <div></div>

          <div className="max-w-4xl pb-4">
            {place.state && (
              <span
                className="badge bg-black bg-opacity-75 text-white border border-white border-opacity-30 px-3.5 py-1.5 rounded-pill font-semibold mb-2 shadow-sm d-inline-flex align-items-center"
                style={{ color: "#ffffff", fontSize: "0.85rem" }}
              >
                <MapPin size={13} className="me-1 text-white" /> {place.state}
              </span>
            )}
            <h1
              className="display-3 fw-extrabold text-white mb-2 force-white-text"
              style={{
                color: "#ffffff",
                textShadow: "0 4px 16px rgba(0,0,0,0.9)",
                fontFamily: "'Inter', 'Poppins', sans-serif",
                lineHeight: 1.1,
              }}
            >
              {place.name}
            </h1>
            {place.subtitle && (
              <p
                className="fs-5 text-white-50 italic mb-0 force-white-text"
                style={{
                  color: "#f1f5f9",
                  opacity: 0.95,
                  textShadow: "0 2px 8px rgba(0,0,0,0.85)",
                  maxWidth: "680px",
                }}
              >
                {place.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="container max-w-7xl mx-auto px-3 px-md-4 mt-5">
        <div className="row g-4">
          {/* Left Column: Full Detail Travel & Heritage Blog */}
          <div className="col-lg-8">
            <div className="mb-4">
              <span className="badge bg-warning text-dark font-semibold rounded-pill px-3 py-1.5 extra-small mb-2">
                Heritage Travel & Pilgrimage Guide
              </span>
              <h2
                className="fw-bold mb-3 fs-2"
                style={{ color: "#111827", fontFamily: "'Poppins', sans-serif" }}
              >
                {blogTitle}
              </h2>
              <div className="d-flex align-items-center flex-wrap gap-2 text-muted small mb-3">
                <span className="fw-semibold text-dark">
                  By {place.blog?.author || "BharatDarshi Travel Team"}
                </span>
                <span>•</span>
                <span>{place.blog?.readTime || "6 min read"}</span>
                <span>•</span>
                <span>{place.blog?.publishDate || "Updated September 2026"}</span>
              </div>

              {/* Experience Highlights Badges */}
              {((place.experiences && place.experiences.length > 0) || place.experienceCard?.title) && (
                <div className="d-flex flex-wrap gap-2 my-3">
                  {place.experienceCard?.title && (
                    <span
                      className="badge bg-white text-amber-700 border border-amber-300 rounded-pill px-3 py-1.5 extra-small fw-semibold shadow-xs"
                      style={{ color: "#b45309", borderColor: "#fde68a" }}
                    >
                      {place.experienceCard.title}
                    </span>
                  )}
                  {place.experiences?.map((expStr, expIdx) => (
                    <span
                      key={expIdx}
                      className="badge bg-white text-amber-700 border border-amber-300 rounded-pill px-3 py-1.5 extra-small fw-semibold shadow-xs"
                      style={{ color: "#b45309", borderColor: "#fde68a" }}
                    >
                      {expStr}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Lead Narrative Paragraphs */}
            <div className="mb-4 d-flex flex-column gap-3">
              {(readMore ? leadParas : leadParas.slice(0, 1)).map(
                (para, idx) => (
                  <p
                    key={idx}
                    className="leading-relaxed m-0"
                    style={{
                      lineHeight: "1.9",
                      fontSize: "1.06rem",
                      color: "#374151",
                      fontWeight: 450,
                    }}
                  >
                    {para}
                  </p>
                ),
              )}
            </div>

            {/* Structured Blog Sections */}
            {blogSections && blogSections.length > 0 && (
              <div className="d-flex flex-column gap-4 mt-3">
                {(readMore ? blogSections : blogSections.slice(0, 2)).map(
                  (sec, idx) => (
                    <div key={idx} className="mb-4 pb-2">
                      {sec.title && (
                        <h3
                          className="fw-bold mb-3"
                          style={{
                            fontSize: "1.45rem",
                            fontFamily: "'Poppins', sans-serif",
                            letterSpacing: "-0.2px",
                            color: "#111827",
                          }}
                        >
                          {sec.title}
                        </h3>
                      )}

                      {sec.paragraphs && sec.paragraphs.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {sec.paragraphs.map((pText, pIdx) => (
                            <p
                              key={pIdx}
                              className="m-0"
                              style={{
                                lineHeight: "1.88",
                                color: "#374151",
                                fontSize: "1.02rem",
                              }}
                            >
                              {pText}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p
                          style={{
                            lineHeight: "1.88",
                            whiteSpace: "pre-line",
                            color: "#374151",
                            fontSize: "1.02rem",
                          }}
                        >
                          {sec.body}
                        </p>
                      )}

                      {/* Inline Section Image */}
                      {sec.image && (
                        <div
                          className="my-4 overflow-hidden rounded-4 shadow-sm border"
                          style={{ borderColor: "rgba(217, 119, 6, 0.18)" }}
                        >
                          <img
                            src={sec.image}
                            alt={sec.title || "Feature image"}
                            className="w-100 object-fit-cover"
                            style={{ maxHeight: "400px" }}
                          />
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}

            {/* Nearby Attractions inside Blog Flow */}
            {place.nearbyAttractions && place.nearbyAttractions.length > 0 && (
              <div className="mt-4 p-4 rounded-4 bg-white border shadow-sm mb-4">
                <h4 className="fw-bold mb-3 text-dark fs-5">
                  Nearby Attractions & Shrines
                </h4>
                <div className="row g-3">
                  {place.nearbyAttractions.map((att, aIdx) => (
                    <div key={aIdx} className="col-12 col-md-6">
                      <div className="p-3 rounded-3 bg-light border h-100">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="fw-bold text-dark m-0 small">{att.name}</h6>
                          <span className="badge bg-warning text-dark extra-small">
                            {att.distance}
                          </span>
                        </div>
                        <p className="extra-small text-secondary m-0">
                          {att.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Read More / Read Less Toggle Button */}
            {blogSections.length > 2 && (
              <div className="mt-4 pt-2">
                <button
                  onClick={() => setReadMore(!readMore)}
                  className="btn btn-danger rounded-pill px-4 py-2 fw-semibold text-white small shadow-sm d-inline-flex align-items-center gap-2 border-0"
                  style={{ backgroundColor: "#ef4444" }}
                >
                  {readMore ? "Collapse Blog" : "Read Full Blog"}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Info Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "120px" }}>
              {/* 1. Location Map Snippet */}
              <div
                className="rounded-4 border shadow-sm overflow-hidden mb-4 bg-white"
                style={{ borderColor: "rgba(217, 119, 6, 0.2)" }}
              >
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <span className="fw-bold small text-dark d-flex align-items-center gap-1.5">
                    <NavIcon size={14} className="text-warning" /> Location Map
                  </span>
                  <span className="text-secondary small fw-medium">
                    {place.city || place.state}
                  </span>
                </div>
                <div style={{ height: "180px" }}>
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{
                      border: 0,
                      filter: "brightness(0.95) contrast(1.05)",
                    }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      place.coordinates?.lat && place.coordinates?.lng
                        ? `${place.coordinates.lat},${place.coordinates.lng}`
                        : `${place.name}, ${place.location || place.city || place.state || "India"}`
                    )}&hl=en&z=12&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* 2. Weather Card */}
              <div
                className="p-4 rounded-4 border shadow-sm mb-4 text-center bg-white"
                style={{ borderColor: "rgba(217, 119, 6, 0.2)" }}
              >
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <span className="fw-bold text-dark">Today</span>
                  <span className="text-muted">|</span>
                  <span
                    className="fw-bold text-danger text-decoration-underline cursor-pointer"
                    style={{ color: "#ef4444" }}
                  >
                    Monthly
                  </span>
                </div>
                <p className="text-secondary small mb-3">
                  {place.weather?.month || "September"}
                </p>
                <div className="d-flex align-items-center justify-content-center gap-3 fs-5 fw-bold text-dark">
                  <ChevronLeft
                    size={18}
                    className="text-secondary cursor-pointer"
                  />
                  <span>{place.weather?.tempRange || "2.3 - 28.8 °C"}</span>
                  <ChevronRight
                    size={18}
                    className="text-secondary cursor-pointer"
                  />
                </div>
              </div>

              {/* 3. Travel Info & Red Action Buttons */}
              <div
                className="p-4 rounded-4 border shadow-sm mb-4 bg-white"
                style={{ borderColor: "rgba(217, 119, 6, 0.2)" }}
              >
                <div className="mb-3">
                  <span
                    className="fw-bold text-danger d-block small mb-1"
                    style={{ color: "#ef4444" }}
                  >
                    Nearest Airport :
                  </span>
                  <p className="text-dark small m-0 fw-medium">
                    {place.nearestAirport ||
                      "Birsa Munda Airport (IXL), Ranchi"}
                  </p>
                </div>

                <div className="mb-4">
                  <span
                    className="fw-bold text-danger d-block small mb-1"
                    style={{ color: "#ef4444" }}
                  >
                    Nearest Railway Station :
                  </span>
                  <p className="text-dark small m-0 fw-medium">
                    {place.nearestRailway || "Ranchi Railway Station (RNC)"}
                  </p>
                </div>

                {/* Red Heart & Share Buttons */}
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`btn ${
                      liked ? "btn-danger" : "btn-outline-danger"
                    } flex-grow-1 py-2 rounded-3 d-flex align-items-center justify-content-center border-0 text-white`}
                    style={{ backgroundColor: liked ? "#ef4444" : "#dc2626" }}
                    title="Save to Favorites"
                  >
                    <Heart size={18} fill={liked ? "white" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn btn-danger flex-grow-1 py-2 rounded-3 d-flex align-items-center justify-content-center border-0 text-white"
                    style={{ backgroundColor: "#dc2626" }}
                    title="Share Place"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* 4. Timings Card */}
              <div
                className="p-4 rounded-4 border shadow-sm mb-4 bg-white"
                style={{ borderColor: "rgba(217, 119, 6, 0.2)" }}
              >
                <h5
                  className="fw-bold text-danger mb-3"
                  style={{ color: "#ef4444" }}
                >
                  Timings
                </h5>
                <div className="small text-secondary d-flex flex-column gap-1">
                  <p className="mb-1">
                    <strong className="text-dark">Opening time - </strong>
                    {place.timings?.opening || "05:00 AM"}
                  </p>
                  <p className="mb-0">
                    <strong className="text-dark">Closing time - </strong>
                    {place.timings?.closing || "09:00 PM"}
                  </p>
                </div>
              </div>

              {/* 5. "You may enjoy →" Experience Card */}
              <div
                className="rounded-4 border shadow-sm overflow-hidden bg-white"
                style={{ borderColor: "rgba(217, 119, 6, 0.2)" }}
              >
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <h6 className="fw-bold text-dark m-0">You may enjoy</h6>
                  <ArrowRight size={16} className="text-warning" />
                </div>
                <div className="position-relative" style={{ height: "160px" }}>
                  <img
                    src={
                      place.experienceCard?.image ||
                      place.images?.[1] ||
                      place.image
                    }
                    alt="Experience"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="p-3 bg-white">
                  <span
                    className="text-danger fw-bold small d-block mb-1"
                    style={{ color: "#ef4444" }}
                  >
                    {place.experienceCard?.label || "Experience"}
                  </span>
                  <p className="text-dark small fw-medium m-0 lh-sm">
                    {place.experienceCard?.title ||
                      "Ranchi: Overnight bikepacking trip to the Ganj"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore EXPERIENCES Bottom Section - Smooth Scroll Horizontal Carousel */}
      <div
        className="w-100 mt-5 pt-5 pb-5 position-relative overflow-hidden"
        style={{
          backgroundColor: "#f7f6f0",
          borderTop: "1px solid rgba(217, 119, 6, 0.15)",
        }}
      >
        <div className="container max-w-7xl mx-auto px-3 px-md-4">
          <div className="text-center mb-4">
            <span
              className="text-uppercase fw-semibold tracking-widest small d-block mb-1"
              style={{ letterSpacing: "3px", color: "#d97706" }}
            >
              Explore
            </span>
            <h2
              className="display-4 text-dark text-uppercase m-0"
              style={{ fontWeight: 900, letterSpacing: "2px", color: "#111827" }}
            >
              EXPERIENCES
            </h2>
          </div>

          {/* Horizontally Scrollable Cards Container */}
          <div
            ref={expScrollRef}
            className="d-flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              paddingLeft: "4px",
              paddingRight: "4px",
            }}
          >
            {experiencesList.map((exp, index) => (
              <ExperienceItemCard key={index} exp={exp} />
            ))}
          </div>

          {/* Carousel Arrow Controls at Bottom Center */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
            <button
              onClick={() => scrollExperiences("left")}
              className="btn btn-outline-dark rounded-circle p-2 border-secondary border-opacity-30 d-flex align-items-center justify-content-center shadow-sm hover-bg-warning transition-all"
              style={{ width: "44px", height: "44px" }}
              title="Previous Experience"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scrollExperiences("right")}
              className="btn btn-outline-dark rounded-circle p-2 border-secondary border-opacity-30 d-flex align-items-center justify-content-center shadow-sm hover-bg-warning transition-all"
              style={{ width: "44px", height: "44px" }}
              title="Next Experience"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetail;
