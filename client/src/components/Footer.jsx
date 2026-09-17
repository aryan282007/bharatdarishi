import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Smartphone,
} from "lucide-react";
import { AppDevelopmentModal } from "./AppDevelopmentModal";

export function Footer() {
  const [showDevModal, setShowDevModal] = useState(false);
  const [devAppType, setDevAppType] = useState("Google Play");

  const handleOpenAppModal = (type) => {
    setDevAppType(type);
    setShowDevModal(true);
  };
  return (
    <footer
      className="site-footer py-5 position-relative z-10 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0.68) 100%), url('/footer_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#000000",
        borderTop: "1px solid rgba(255, 255, 255, 0.15)",
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="container py-3">
        <div className="row g-4 justify-content-between align-items-start">
          {/* COLUMN 1: Logo, Follow Us & Download App */}
          <div className="col-12 col-md-5 col-lg-4 mb-4 mb-md-0">
            {/* Website Brand Name */}
            <h2
              className="fw-bold mb-4 d-inline-block"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "2.2rem",
                letterSpacing: "-0.5px",
              }}
            >
              <span className="footer-brand-bharat" style={{ color: "#ffffff" }}>
                भारत
              </span>
              <span className="footer-brand-darshi" style={{ color: "#facc15" }}>
                Darshi
              </span>
            </h2>

            {/* Follow Us Section */}
            <div className="mb-4">
              <h6
                className="fw-bold text-white mb-2.5"
                style={{ fontSize: "1.05rem" }}
              >
                Follow us
              </h6>
              <div className="d-flex align-items-center gap-3">
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="social-icon-fb text-decoration-none transition-all"
                  style={{
                    color: "#ffffff",
                    transition: "all 0.25s ease-in-out",
                    display: "inline-flex",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("color", "#1877F2", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("color", "#ffffff", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#twitter"
                  aria-label="Twitter"
                  className="social-icon-tw text-decoration-none transition-all"
                  style={{
                    color: "#ffffff",
                    transition: "all 0.25s ease-in-out",
                    display: "inline-flex",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("color", "#38bdf8", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("color", "#ffffff", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="social-icon-ig text-decoration-none transition-all"
                  style={{
                    color: "#ffffff",
                    transition: "all 0.25s ease-in-out",
                    display: "inline-flex",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("color", "#ec4899", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("color", "#ffffff", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#youtube"
                  aria-label="YouTube"
                  className="social-icon-yt text-decoration-none transition-all"
                  style={{
                    color: "#ffffff",
                    transition: "all 0.25s ease-in-out",
                    display: "inline-flex",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("color", "#ff0000", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("color", "#ffffff", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Youtube size={22} />
                </a>
                <a
                  href="#linkedin"
                  aria-label="LinkedIn"
                  className="social-icon-li text-decoration-none transition-all"
                  style={{
                    color: "#ffffff",
                    transition: "all 0.25s ease-in-out",
                    display: "inline-flex",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("color", "#1877F2", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("color", "#ffffff", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            {/* Download App Section */}
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Smartphone size={20} className="text-white flex-shrink-0" />
                <span
                  className="fw-bold text-white"
                  style={{ fontSize: "1rem" }}
                >
                  Download App Now
                </span>
              </div>
              <p
                className="extra-small mt-1 mb-3.5 text-white fw-medium force-white-text"
                style={{
                  fontSize: "0.85rem",
                  maxWidth: "280px",
                  lineHeight: "1.45",
                  color: "#ffffff",
                  WebkitTextFillColor: "#ffffff",
                }}
              >
                Download and visit <span className="footer-brand-bharat" style={{ color: "#ffffff" }}>भारत</span><span className="footer-brand-darshi" style={{ color: "#facc15" }}>Darshi</span> mobile app.
              </p>

              {/* App Badges */}
              <div className="d-flex align-items-center gap-2">
                {/* Google Play Button */}
                <button
                  type="button"
                  onClick={() => handleOpenAppModal("Google Play Store")}
                  className="btn btn-sm btn-google-play rounded-3 px-3 py-1.5 d-flex align-items-center gap-2 border transition-all"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.65)",
                    fontSize: "0.8rem",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("background-color", "#01875f", "important");
                    e.currentTarget.style.setProperty("border-color", "#01875f", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("background-color", "rgba(0,0,0,0.65)", "important");
                    e.currentTarget.style.setProperty("border-color", "rgba(255, 255, 255, 0.3)", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white flex-shrink-0"
                  >
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.986 1.986 0 0 1-.61-1.411V3.225c0-.53.21-1.04.609-1.411zM15.206 13.414l2.97 2.97-12.802 7.391 9.832-10.361zm0-2.828L5.374.225 18.176 7.616l-2.97 2.97zm1.884 1.414l3.81-2.2c.703-.406.703-1.42 0-1.826l-3.81-2.2-2.122 2.122 2.122 2.104z" />
                  </svg>
                  <span className="fw-bold text-white">Google Play</span>
                </button>
                {/* App Store Button */}
                <button
                  type="button"
                  onClick={() => handleOpenAppModal("Apple App Store")}
                  className="btn btn-sm btn-app-store rounded-3 px-3 py-1.5 d-flex align-items-center gap-2 border transition-all"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.65)",
                    fontSize: "0.8rem",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.setProperty("background-color", "#0071e3", "important");
                    e.currentTarget.style.setProperty("border-color", "#0071e3", "important");
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("background-color", "rgba(0,0,0,0.65)", "important");
                    e.currentTarget.style.setProperty("border-color", "rgba(255, 255, 255, 0.3)", "important");
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white flex-shrink-0"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.64-.78 1.08-1.85.96-2.92-.93.04-2.06.62-2.73 1.4-.6.69-1.12 1.79-.98 2.85 1.04.08 2.11-.55 2.75-1.33z" />
                  </svg>
                  <span className="fw-bold text-white">App Store</span>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Quick Links (Exact list from reference image) */}
          <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4 mb-md-0">
            <h5
              className="fw-bold text-white mb-3"
              style={{ fontSize: "1.2rem" }}
            >
              Quick links
            </h5>
            <ul
              className="list-unstyled mb-0 d-flex flex-column gap-2"
              style={{ fontSize: "0.92rem" }}
            >
              <li>
                <Link
                  to="/places"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  Explore India
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  Stays
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  Local Services
                </Link>
              </li>
              <li>
                <Link
                  to="/planner"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  Plan Your Trip
                </Link>
              </li>
              <li>
                <Link
                  to="/announcements"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  Notices & Alerts
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-white-50 text-decoration-none transition-all"
                  style={{ color: "#cbd5e1" }}
                  onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                  onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                >
                  24/7 Support
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Scan to Chat QR Widget */}
          <div className="col-12 col-sm-6 col-md-3 col-lg-3">
            <h5
              className="fw-bold text-white mb-3"
              style={{ fontSize: "1.2rem" }}
            >
              Scan to chat
            </h5>
            <div
              className="bg-white p-2.5 rounded-3 d-inline-flex flex-column align-items-center justify-content-center shadow-lg"
              style={{ width: "140px", height: "140px" }}
            >
              <div className="w-100 h-100 d-flex align-items-center justify-content-center rounded-2 overflow-hidden bg-white p-1">
                <img
                  src="/qr_code.png"
                  alt="भारतDarshi Scan to Chat QR Code"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Line Divider */}
        <div
          className="my-4 pt-2"
          style={{
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
          }}
        />

        {/* Bottom Bar: Links & Copyright */}
        <div className="d-flex flex-column align-items-center justify-content-center gap-2 text-center">
          <div
            className="d-flex flex-wrap align-items-center justify-content-center gap-3 extra-small fw-semibold text-white-50"
            style={{ fontSize: "0.88rem" }}
          >
            <Link
              to="/support"
              className="text-white text-decoration-none transition-all opacity-80 hover-opacity-100"
            >
              Terms of Use
            </Link>
            <span>|</span>
            <Link
              to="/support"
              className="text-white text-decoration-none transition-all opacity-80 hover-opacity-100"
            >
              Privacy Policy
            </Link>
            <span>|</span>
            <Link
              to="/support"
              className="text-white text-decoration-none transition-all opacity-80 hover-opacity-100"
            >
              Contact Us
            </Link>
            <span>|</span>
            <Link
              to="/support"
              className="text-white text-decoration-none transition-all opacity-80 hover-opacity-100"
            >
              Help
            </Link>
          </div>

          <div
            className="extra-small text-white-50 mt-1"
            style={{ fontSize: "0.83rem" }}
          >
            © <span className="footer-brand-bharat" style={{ color: "#ffffff" }}>भारत</span><span className="footer-brand-darshi" style={{ color: "#facc15" }}>Darshi</span>, Ministry of Tourism, Government of India.
          </div>
        </div>
      </div>

      {/* App Under Development Modal */}
      <AppDevelopmentModal
        isOpen={showDevModal}
        onClose={() => setShowDevModal(false)}
        appType={devAppType}
      />
    </footer>
  );
}
