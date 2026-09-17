import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function CuratedItineraries() {
  const itineraries = [
    {
      id: 1,
      days: "3 Days",
      title: "Yuksom",
      description: "Visit Dubdi Monastery & explore ancient trails.",
      image: "/itineraries/yuksom.png",
    },
    {
      id: 2,
      days: "4 Days",
      title: "Pelling",
      description: "Explore Pemayangtse & Rabdentse ruins with stunning views.",
      image: "/itineraries/pelling.png",
    },
    {
      id: 3,
      days: "5 Days",
      title: "Ravangla",
      description: "Breathtaking monasteries, Buddha Park & calm retreat.",
      image: "/itineraries/ravangla.png",
    },
    {
      id: 4,
      days: "7 Days",
      title: "North Sikkim",
      description: "Lachen, Lachung, Gurudongmar & divine landscapes.",
      image: "/itineraries/north_sikkim.png",
    },
  ];

  return (
    <section
      className="py-5 text-white position-relative overflow-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container py-4 text-center">
        {/* Section Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="d-block text-uppercase fw-bold mb-2 font-monospace"
            style={{
              color: "#facc15",
              letterSpacing: "0.25em",
              fontSize: "0.82rem",
            }}
          >
            DISCOVER SIKKIM
          </span>
          <h2
            className="fw-normal text-white mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "3.2rem",
            }}
          >
            Curated <span style={{ color: "#facc15" }}>Itineraries</span>
          </h2>
          <p
            className="mx-auto small mb-0"
            style={{
              color: "#94a3b8",
              fontSize: "0.95rem",
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Handpicked travel plans designed to help you explore monasteries,
            culture, and breathtaking landscapes.
          </p>
        </motion.div>

        {/* 4 Arched / Domed Cards Grid */}
        <div className="row g-4 justify-content-center">
          {itineraries.map((item, index) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-3">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-100 d-flex flex-column text-center"
              >
                <Link
                  to="/planner"
                  state={{ curatedItinerary: item }}
                  className="text-decoration-none d-flex flex-column h-100 cursor-pointer"
                >
                  {/* Domed / Arched Image Window */}
                  <div
                    className="position-relative overflow-hidden flex-shrink-0 shadow-2xl transition-all"
                    style={{
                      borderRadius: "140px 140px 20px 20px",
                      height: "360px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 15px 35px rgba(250, 204, 21, 0.18)",
                    }}
                  >
                    <motion.img
                      src={item.image}
                      alt={item.title}
                      className="w-100 h-100 object-fit-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
                      }}
                    />
                  </div>

                  {/* Minimal Card Details Below Arch */}
                  <div className="pt-3 d-flex flex-column flex-grow-1 align-items-center">
                    <span
                      className="fw-bold mb-1"
                      style={{ color: "#facc15", fontSize: "0.88rem" }}
                    >
                      {item.days}
                    </span>

                    <h3
                      className="fw-bold text-white mb-1"
                      style={{ fontSize: "1.6rem", letterSpacing: "-0.2px" }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="small mb-0"
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.84rem",
                        lineHeight: 1.45,
                        maxWidth: "230px",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
