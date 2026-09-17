import React, { useState } from "react";
import {
  Download,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { AppDevelopmentModal } from "./AppDevelopmentModal";

export function MobileAppSection() {
  const [showDevModal, setShowDevModal] = useState(false);

  const handleDownload = () => {
    setShowDevModal(true);
  };

  return (
    <section
      className="mobile-app-section py-5 position-relative overflow-hidden"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Subtle Center Sun Radial Light Glow (zIndex: 1) */}
      <div
        className="position-absolute top-50 start-50 translate-middle pointer-events-none"
        style={{
          width: "750px",
          height: "750px",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 45%, rgba(0, 0, 0, 0) 75%)",
          filter: "blur(50px)",
          zIndex: 1,
        }}
      />

      {/* Section Content Container (zIndex: 10) */}
      <div
        className="container py-4 text-center position-relative"
        style={{ zIndex: 10 }}
      >
        {/* Center Mobile Phone Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="d-flex justify-content-center mb-5 pb-3"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="position-relative overflow-hidden shadow-2xl"
            style={{
              width: "280px",
              height: "560px",
              borderRadius: "44px",
              border: "10px solid #1c1c1e",
              backgroundColor: "#000000",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px rgba(245, 158, 11, 0.2)",
            }}
          >
            {/* Top Phone Camera Notch Punch Hole */}
            <div
              className="position-absolute top-0 start-50 translate-middle-x mt-2.5 z-30"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#000000",
                borderRadius: "50%",
                border: "2px solid #2c2c2e",
              }}
            />

            {/* App Screen Image */}
            <img
              src="/appimage.jpeg"
              alt="भारतDarshi Mobile App Screen"
              className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
            />
          </motion.div>
        </motion.div>

        {/* Text Section Below Phone */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-700 mx-auto mt-4 pt-2"
        >
          <h2
            className="fw-bold mb-2"
            style={{
              fontSize: "2.6rem",
              letterSpacing: "-0.5px",
              color: "#0f172a",
            }}
          >
            Explore <span className="bharat-text" style={{ color: "#000000", fontWeight: "900" }}>भारत</span>
            <span className="darshi-text" style={{ color: "#facc15", fontWeight: "900" }}>Darshi</span> on Mobile
          </h2>

          <p
            className="mx-auto mb-4"
            style={{
              color: "#475569",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              maxWidth: "540px",
              fontWeight: 500,
            }}
          >
            Experience immersive tours, travel guides, maps, and cultural
            archives right from your phone.
          </p>

          {/* Download APK Action Button */}
          <div className="d-flex justify-content-center mb-1">
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 40px rgba(250, 204, 21, 0.7)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownload}
              className="btn btn-get-started rounded-pill px-4.5 py-3 shadow-2xl d-inline-flex align-items-center justify-content-between text-decoration-none border-0"
              style={{
                backgroundColor: "#ffd700",
                color: "#000000",
                width: "460px",
                maxWidth: "92%",
                height: "78px",
                borderRadius: "60px",
                boxShadow: "0 8px 30px rgba(217, 119, 6, 0.3)",
              }}
            >
              <div className="d-flex align-items-center gap-3.5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "46px",
                    height: "46px",
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <Download size={22} style={{ color: "#000000" }} />
                </div>
                <div className="text-start lh-sm">
                  <div
                    style={{
                      fontSize: "1.25rem",
                      color: "#000000",
                      fontWeight: 800,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Download APK
                  </div>
                  <div
                    style={{
                      fontSize: "0.90rem",
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    Android Version
                  </div>
                </div>
              </div>
              <ChevronRight size={22} style={{ color: "#000000" }} />
            </motion.button>
          </div>

          {/* Equal Sign Indicator Directly Below Button */}
          <div
            className="text-center my-2"
            style={{
              color: "#64748b",
              fontSize: "0.9rem",
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            =
          </div>

          {/* Feature Badges Line */}
          <div
            className="d-flex align-items-center justify-content-center gap-3 flex-wrap small pt-1"
            style={{ fontSize: "0.88rem" }}
          >
            <span
              className="d-inline-flex align-items-center gap-1"
              style={{ color: "#0f172a", fontWeight: 700 }}
            >
              <Shield size={16} style={{ color: "#d97706" }} />
              Secure direct download
            </span>
            <span
              style={{ color: "#d97706", margin: "0 2px", fontWeight: 900 }}
            >
              •
            </span>
            <span
              className="d-inline-flex align-items-center gap-1"
              style={{ color: "#0f172a", fontWeight: 700 }}
            >
              <CheckCircle2 size={16} style={{ color: "#059669" }} />
              Verified build
            </span>
            <span
              style={{ color: "#d97706", margin: "0 2px", fontWeight: 900 }}
            >
              •
            </span>
            <span
              className="d-inline-flex align-items-center gap-1"
              style={{ color: "#0f172a", fontWeight: 700 }}
            >
              <CheckCircle2 size={16} style={{ color: "#059669" }} />
              Updated regularly
            </span>
          </div>
        </motion.div>
      </div>

      {/* App Under Development Modal */}
      <AppDevelopmentModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        appType="Android APK"
      />
    </section>
  );
}
