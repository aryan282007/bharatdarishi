import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AppDevelopmentModal({
  isOpen,
  onClose,
  appType = "Mobile App",
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 99999,
        }}
        onClick={onClose}
      >
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-white overflow-hidden shadow-2xl position-relative w-100"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "440px",
            borderRadius: "20px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Top Banner Image Container */}
          <div
            className="position-relative w-100 overflow-hidden"
            style={{
              height: "210px",
              background:
                "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
            }}
          >
            {/* Banner Background Image */}
            <img
              src="/appimage.jpeg"
              alt="App Preview"
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />

            {/* Gradient Overlay to ensure close button visibility */}
            <div
              className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.1) 100%)",
              }}
            />

            {/* Top Right Close 'x' Button */}
            <button
              type="button"
              onClick={onClose}
              className="position-absolute top-0 end-0 m-3 border-0 d-flex align-items-center justify-content-center transition-all"
              aria-label="Close"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                color: "#ffffff",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.35)")
              }
            >
              <X size={16} />
            </button>
          </div>

          {/* Bottom Content Area */}
          <div
            className="bg-white"
            style={{
              padding: "28px 28px 32px 28px",
            }}
          >
            {/* Title */}
            <h3
              className="fw-bold text-dark mb-2 text-start"
              style={{
                fontSize: "1.55rem",
                letterSpacing: "-0.3px",
                color: "#0f172a",
                lineHeight: "1.25",
              }}
            >
              App Under Development
            </h3>

            {/* Description */}
            <p
              className="text-start mb-4"
              style={{
                color: "#64748b",
                fontSize: "0.93rem",
                lineHeight: "1.55",
                fontWeight: "400",
              }}
            >
              Our mobile application ({appType}) is currently under active
              development phase. It will feature offline AI audio tour guides,
              interactive 3D maps, and live temple queue alerts.
            </p>

            {/* Centered Black Pill Button */}
            <div className="d-flex justify-content-center">
              <button
                type="button"
                onClick={onClose}
                className="btn fw-semibold border-0 transition-all"
                style={{
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  borderRadius: "9999px",
                  padding: "10px 28px",
                  fontSize: "0.92rem",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1a1a1a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#000000")
                }
              >
                Exit
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
