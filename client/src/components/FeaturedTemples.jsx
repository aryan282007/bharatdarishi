import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export function FeaturedTemples() {
  const navigate = useNavigate();
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [monasteries, setMonasteries] = useState([
    {
      id: "rumtek",
      type: "place",
      name: "Rumtek Monastery",
      location: "East Sikkim",
      subtitle: null,
      description: "Seat of the Karmapa and crown jewel of Tibetan Buddhism",
      image: "/temples/rumtek.png",
      topBadge: null,
      isCenter: false,
    },
    {
      id: "pemayangtse",
      type: "place",
      name: "Pemayangtse Monastery",
      location: "West Sikkim",
      subtitle: "The Perfect Sublime Lotus",
      description: "One of the oldest and most important monasteries in Sikkim",
      image: "/temples/pemayangtse.png",
      topBadge: null,
      isCenter: true,
    },
    {
      id: "enchey",
      type: "place",
      name: "Enchey Monastery",
      location: "East Sikkim",
      subtitle: null,
      description: "Sacred sanctuary overlooking the Kanchenjunga",
      image: "/temples/enchey.png",
      topBadge: null,
      isCenter: false,
    },
  ]);

  useEffect(() => {
    const fetchBestPlaces = async () => {
      try {
        const res = await axios.get("/api/places");
        if (res.data && Array.isArray(res.data) && res.data.length >= 3) {
          // Select 3 best data items from MongoDB places collection
          const top3 = res.data.slice(0, 3);
          const formatted = top3.map((p, index) => {
            const rawDesc =
              p.subtitle ||
              p.description ||
              (p.leadParagraphs && p.leadParagraphs[0]) ||
              "Sacred heritage and cultural landmark";
            // Clean up to first short sentence (max 85 chars) to prevent long paragraph walls of text
            const firstSentence = rawDesc.split(".")[0].trim();
            const shortDesc =
              firstSentence.length > 85
                ? firstSentence.substring(0, 82) + "..."
                : firstSentence
                  ? firstSentence + "."
                  : rawDesc;

            return {
              id: p.id || p._id,
              type: p.type || "place",
              name: p.name,
              location: p.location || p.city || p.state || "India",
              subtitle:
                p.subtitle && p.subtitle.length < 50 ? p.subtitle : null,
              description: shortDesc,
              image:
                p.image ||
                (Array.isArray(p.images)
                  ? p.images[0]
                  : "/temples/pemayangtse.png"),
              topBadge: null,
              isCenter: index === 1,
            };
          });
          setMonasteries(formatted);
        }
      } catch (err) {
        console.error(
          "Error fetching places from MongoDB places collection:",
          err,
        );
      }
    };

    fetchBestPlaces();
  }, []);

  return (
    <section
      className="py-5 text-white position-relative overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      <div
        className="container-fluid py-4 text-center px-2 px-md-4"
        style={{ maxWidth: "1400px" }}
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <h2
            className="fw-bold text-white mb-2"
            style={{ fontSize: "2.8rem", letterSpacing: "-0.5px" }}
          >
            Featured <span style={{ color: "#facc15" }}>Places</span>
          </h2>
          <p className="fs-5 mb-3" style={{ color: "#94a3b8" }}>
            Discover sacred spiritual sites
          </p>

          {/* Golden Flourish Divider with Two Center Dots */}
          <div className="d-flex align-items-center justify-content-center gap-3 my-3">
            <div
              style={{
                width: "70px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #facc15)",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#facc15",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#facc15",
              }}
            />
            <div
              style={{
                width: "70px",
                height: "1px",
                background: "linear-gradient(270deg, transparent, #facc15)",
              }}
            />
          </div>
        </motion.div>

        {/* Exactly 3 Vertical Cards Grid */}
        <div className="row g-3 g-md-4 align-items-center justify-content-center my-3">
          {monasteries.map((item) => {
            const isCenter = item.isCenter;

            return (
              <div
                key={item.id}
                className={`col-12 ${isCenter ? "col-md-5" : "col-md-3.5"}`}
                style={{
                  maxWidth: isCenter ? "540px" : "370px",
                  zIndex: isCenter ? 10 : 1,
                  flex: isCenter ? "0 0 42%" : "0 0 28%",
                }}
              >
                <motion.div
                  className="rounded-4 position-relative overflow-hidden shadow-2xl cursor-pointer"
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() =>
                    navigate(
                      item.type === "temple"
                        ? `/temple/${item.id}`
                        : `/place/${item.id}`,
                    )
                  }
                  style={{
                    height: isCenter ? "600px" : "510px",
                    border: isCenter
                      ? "2.5px solid rgba(250, 204, 21, 0.75)"
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: isCenter
                      ? "0 25px 50px rgba(250, 204, 21, 0.35)"
                      : "0 12px 35px rgba(0,0,0,0.7)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{
                    scale: isCenter ? 1.05 : 1.04,
                    y: -12,
                    boxShadow: isCenter
                      ? "0 30px 60px rgba(250, 204, 21, 0.55)"
                      : "0 20px 45px rgba(250, 204, 21, 0.3)",
                    borderColor: "rgba(250, 204, 21, 0.9)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Background Image with Hover Parallax Zoom */}
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
                      zIndex: 2,
                    }}
                  />

                  {/* Top Right Badge (Sacred Courtyard Tour) */}
                  {item.topBadge && (
                    <div
                      className="position-absolute top-0 end-0 m-3"
                      style={{ zIndex: 10 }}
                    >
                      <span
                        className="badge text-warning fw-bold px-3 py-2 rounded-3 border border-warning border-opacity-30 small"
                        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
                      >
                        {item.topBadge}
                      </span>
                    </div>
                  )}

                  {/* Card Bottom Overlay Content */}
                  <motion.div
                    layout
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="position-absolute bottom-0 start-0 w-100 p-4 text-start cardContent"
                    style={{ zIndex: 10 }}
                  >
                    {/* Yellow Location Pill Badge */}
                    <div className="mb-2">
                      <span
                        className="badge text-dark fw-bold px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 shadow-sm"
                        style={{
                          backgroundColor: "#facc15",
                          fontSize: "0.84rem",
                          color: "#000000",
                        }}
                      >
                        <MapPin size={14} className="text-dark" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`fw-bold mb-1 ${
                        item.name === "Rumtek Monastery" ? "yellow-text" : ""
                      }`}
                      style={{
                        fontSize: isCenter ? "1.75rem" : "1.45rem",
                        lineHeight: 1.25,
                        letterSpacing: "-0.2px",
                        color:
                          item.name === "Rumtek Monastery"
                            ? "#facc15"
                            : "#ffffff",
                        textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                      }}
                    >
                      {item.name}
                    </h3>

                    {/* Golden Subtitle (for center card) */}
                    {item.subtitle && (
                      <p
                        className="small fw-semibold mb-2"
                        style={{
                          color: "#facc15",
                          fontSize: "0.88rem",
                          textShadow: "0 2px 6px rgba(0,0,0,0.8)",
                        }}
                      >
                        {item.subtitle}
                      </p>
                    )}

                    {/* Description */}
                    <p
                      className="small mb-0"
                      style={{
                        fontSize: "0.86rem",
                        lineHeight: 1.45,
                        fontWeight: 300,
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Primary CTA Button (Smoothly expanding on hover) */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: hoveredCardId === item.id ? 1 : 0,
                        y: hoveredCardId === item.id ? 0 : 10,
                        maxHeight: hoveredCardId === item.id ? 60 : 0,
                        marginTop: hoveredCardId === item.id ? 12 : 0,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        overflow: "hidden",
                        pointerEvents:
                          hoveredCardId === item.id ? "auto" : "none",
                      }}
                    >
                      <Link
                        to={
                          item.type === "temple"
                            ? `/temple/${item.id}`
                            : `/place/${item.id}`
                        }
                        className="btn text-dark fw-bold rounded-pill px-4 py-2.5 shadow-lg d-inline-flex align-items-center gap-2 text-decoration-none transition-all"
                        style={{
                          backgroundColor: "#facc15",
                          color: "#000000",
                          fontSize: "0.92rem",
                          boxShadow: "0 8px 22px rgba(250, 204, 21, 0.45)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>Explore Now</span>
                        <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
