import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Sparkles,
  Calendar,
  BookOpen,
  Hotel,
  Compass,
  LogOut,
  ShieldCheck,
  Building,
  Megaphone,
  ChevronDown,
  ChevronRight,
  MapPin,
  HelpCircle,
  MoreHorizontal,
  Crown,
  QrCode,
  Flame,
} from "lucide-react";
import styles from "../styles/custom.module.css";

export function Navbar({ onOpenAuth, onOpenPassPortal, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-bs-theme", "light");
  }, []);

  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroThreshold = window.innerHeight * 0.75 || 500;
      setScrolled(window.scrollY > 20);
      setScrolledPastHero(window.scrollY > heroThreshold);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close More dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const navLinks = [
    // { to: "/temples", label: "Model 360" },
    {
      to: "/places",
      label: "Explore India",
    },
    { to: "/hotels", label: "Stays" },
    { to: "/events", label: "Local Services" },
    { to: "/planner", label: "Plan Your Trip" },
    { to: "/model-360", label: "Model 360" },
  ];

  const moreDropdownItems = [
    // {
    //   to: "/temple-view",
    //   icon: Compass,
    //   label: "360° Temple View",
    // },
    // {
    //   to: "/announcements",
    //   icon: Megaphone,
    //   label: "Notices & Alerts",
    // },
    // {
    //   to: "/map",
    //   icon: MapPin,
    //   label: "Map & Gates",
    // },
    {
      to: "/support",
      icon: HelpCircle,
      label: "24/7 Support",
    },
  ];

  const isMoreActive = [
    "/temple-view",
    "/navigation",
    "/hotels",
    "/announcements",
    "/map",
    "/support",
  ].includes(location.pathname);
  const isHomePage =
    location.pathname === "/" ||
    location.pathname === "/places" ||
    location.pathname.startsWith("/place/") ||
    location.pathname === "/events";
  const isFixedNavbar = !isHomePage || scrolledPastHero || mobileOpen;

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isHomePage ? "is-home-page" : "is-inner-page"
      } ${
        isFixedNavbar
          ? "bg-white shadow-lg navbar-appear-fixed"
          : "bg-transparent"
      }`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "100%",
        borderRadius: "0 0 24px 24px",
        paddingTop: isFixedNavbar ? "14px" : "18px",
        paddingBottom: isFixedNavbar ? "14px" : "18px",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        backgroundColor: isFixedNavbar ? "#ffffff" : "transparent",
        borderBottom: isFixedNavbar ? "1px solid #e2e8f0" : "none",
        boxShadow: isFixedNavbar ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
        transition:
          "background-color 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
        zIndex: 1040,
      }}
    >
      <div className="container-fluid w-100 px-4 px-md-5 px-lg-5 d-flex align-items-center justify-content-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center me-3 text-decoration-none"
        >
          <span
            className="fs-3 text-white fw-bold d-flex align-items-center"
            style={{
              letterSpacing: "-0.5px",
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            भारत
            <span className="brand-highlight" style={{ color: "#facc15" }}>
              Darshi
            </span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-warning p-1"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Nav Links & Single Primary User Actions */}
        <div
          className={`collapse navbar-collapse ${
            mobileOpen
              ? "show bg-black p-3 rounded-4 mt-2 border border-warning border-opacity-25 shadow-2xl"
              : ""
          }`}
        >
          <ul
            className="navbar-nav ms-auto align-items-lg-center gap-lg-1 gap-md-2 gap-2 flex-nowrap"
            style={{ whiteSpace: "nowrap" }}
          >
            {navLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = location.pathname === link.to;

              if (link.isPortal) {
                return (
                  <li key={link.to} className="nav-item">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        if (onOpenPassPortal) onOpenPassPortal();
                      }}
                      className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-2 transition-all small fw-semibold border-0 bg-transparent ${
                        isActive
                          ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                          : "text-light text-opacity-90 hover-text-warning"
                      }`}
                      style={{
                        fontSize: "0.84rem",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <IconComp
                        size={16}
                        className={`flex-shrink-0 ${
                          isActive ? "text-warning" : "text-warning opacity-75"
                        }`}
                      />
                      <span className="lh-1 d-inline-block">{link.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-2 transition-all small fw-semibold ${
                      isActive
                        ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                        : "text-light text-opacity-90 hover-text-warning"
                    }`}
                    style={{ fontSize: "0.84rem", whiteSpace: "nowrap" }}
                  >
                    {IconComp && (
                      <IconComp
                        size={16}
                        className={`flex-shrink-0 ${
                          isActive ? "text-warning" : "text-warning opacity-75"
                        }`}
                      />
                    )}
                    <span className="lh-1 d-inline-block">{link.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* MORE DROPDOWN MENU */}
            <li className="nav-item position-relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 transition-all small fw-semibold border-0 bg-transparent ${
                  moreOpen || isMoreActive
                    ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                    : "text-light text-opacity-90 hover-text-warning"
                }`}
                style={{
                  fontSize: "0.84rem",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                <MoreHorizontal
                  size={16}
                  className="text-warning flex-shrink-0"
                />
                <span className="lh-1 d-inline-block">More</span>
                <ChevronDown
                  size={14}
                  className={`text-warning opacity-75 transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Dropdown Popover */}
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="navbar-more-popover position-absolute end-0 mt-2 p-2 rounded-4 shadow-2xl z-3 overflow-hidden"
                    style={{
                      width: "235px",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      backgroundColor: "rgba(12, 12, 12, 0.98)",
                      boxShadow:
                        "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(245, 158, 11, 0.15)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    {/* Dropdown List Items */}
                    <div className="d-flex flex-column gap-1.5">
                      {moreDropdownItems.map((item, idx) => {
                        const ItemIcon = item.icon;
                        const isCurrentRoute = location.pathname === item.to;
                        const itemContent = (
                          <motion.div
                            whileHover={{
                              x: 4,
                              backgroundColor: "rgba(245, 158, 11, 0.14)",
                            }}
                            transition={{ duration: 0.15 }}
                            className={`d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 transition-all ${
                              isCurrentRoute
                                ? "bg-warning bg-opacity-15 text-warning fw-bold"
                                : "text-white"
                            }`}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-3 p-1.5 bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 32, height: 32 }}
                              >
                                <ItemIcon size={16} />
                              </div>
                              <span
                                className="fw-semibold text-white transition-colors"
                                style={{ fontSize: "0.88rem" }}
                              >
                                {item.label}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-warning opacity-50 flex-shrink-0 ms-2"
                            />
                          </motion.div>
                        );

                        return (
                          <Link
                            key={idx}
                            to={item.to}
                            onClick={() => {
                              setMoreOpen(false);
                              setMobileOpen(false);
                            }}
                            className="text-decoration-none d-block rounded-3"
                          >
                            {itemContent}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* SINGLE UNIFIED USER AUTH / ACTION CONTROLS */}
            <li className="nav-item ms-lg-2 ps-lg-2 border-start-lg border-secondary border-opacity-25">
              {user ? (
                <div
                  className="d-flex align-items-center gap-2 flex-nowrap"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {/* For Admin Users: Show ONLY Admin Panel button (No Profile button) */}
                  {user.role === "official" || user.role === "admin" ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none shadow-sm"
                      style={{
                        fontSize: "0.82rem",
                        height: "36px",
                        whiteSpace: "nowrap",
                      }}
                      title="Mahakal Admin Panel"
                    >
                      <ShieldCheck size={15} className="flex-shrink-0" />
                      <span className="lh-1">Admin Panel</span>
                    </Link>
                  ) : (
                    <>
                      {/* User Profile Badge Button for Devotees / Hotel Partners */}
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="btn btn-outline-warning navbar-user-account-btn btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-semibold text-decoration-none shadow-sm"
                        style={{
                          fontSize: "0.82rem",
                          height: "36px",
                          whiteSpace: "nowrap",
                        }}
                        title="View Profile & Booked Passes"
                      >
                        <User size={15} className="flex-shrink-0" />
                        <span className="lh-1">{user.name}</span>
                      </Link>

                      {/* Hotel Dashboard for Hotel Partners */}
                      {user.role === "hotel" && (
                        <Link
                          to="/hotel-dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none shadow-sm"
                          style={{
                            fontSize: "0.82rem",
                            height: "36px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Building size={15} className="flex-shrink-0" />
                          <span className="lh-1">Hotel Dashboard</span>
                        </Link>
                      )}
                    </>
                  )}

                  {/* Single Sign Out Button */}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="btn btn-danger btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-semibold shadow-sm"
                    style={{
                      fontSize: "0.82rem",
                      height: "36px",
                      whiteSpace: "nowrap",
                    }}
                    title="Sign Out of Session"
                  >
                    <LogOut size={15} className="flex-shrink-0" />
                    <span className="lh-1">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div
                  className="d-flex align-items-center gap-2 flex-nowrap"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <button
                    className="btn btn-get-started navbar-user-account-btn btn-warning btn-sm text-dark rounded-pill px-4 py-1.5 fw-bold transition-all shadow-lg d-inline-flex align-items-center justify-content-center border-0"
                    style={{
                      fontSize: "0.85rem",
                      height: "38px",
                      whiteSpace: "nowrap",
                      background: "#ffd700",
                      backgroundColor: "#ffd700",
                      border: "none",
                    }}
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAuth("login");
                    }}
                  >
                    <span className="lh-1 fw-bold">Get Started</span>
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
