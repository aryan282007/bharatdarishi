import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  User,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle,
  Lock,
  ShieldCheck,
  ArrowRight,
  Building,
  BedDouble,
  IndianRupee,
  XCircle,
  RefreshCw,
  Clock,
  Hash,
  Edit3,
  Phone,
  Star,
  Settings,
  Users,
  Crown,
  QrCode,
  Printer,
  Search,
  Filter,
  SlidersHorizontal,
  Bell, Mail, Compass, Heart, Activity, LogOut, ChevronRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../styles/custom.module.css";

const AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "AC Room",
  "Hot Water",
  "Temple View",
  "Pure Veg Meals",
  "Attached Bathroom",
  "TV",
  "Parking",
  "Room Service",
  "Geyser",
  "Locker",
  "24/7 Security",
  "Elevator",
  "Travel Desk",
  "Doctor on Call",
];

function EditHotelProfileModal({ user, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    hotelName: user?.hotelName || "",
    name: user?.name || "",
    contactPhone: user?.contactPhone || "",
    hotelAddress: user?.hotelAddress || "",
    hotelDescription: user?.hotelDescription || "",
    checkInTime: user?.checkInTime || "12:00 PM",
    checkOutTime: user?.checkOutTime || "11:00 AM",
    hotelImage:
      user?.hotelImage ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    amenities: user?.amenities?.length
      ? user.amenities
      : ["Free Wi-Fi", "Pure Veg Meals", "Temple View", "AC Room", "Hot Water"],
  });

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-white border border-warning border-opacity-30 rounded-4 shadow-2xl overflow-hidden">
          <div className="modal-header border-bottom border-warning border-opacity-20 px-4 py-3 bg-black">
            <h5
              className={`modal-title text-warning fw-bold d-flex align-items-center gap-2 ${styles.playfairFont}`}
            >
              <Edit3 size={20} /> Edit Hotel Profile &amp; Property Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div
            className="modal-body p-4"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL NAME *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelName}
                    placeholder="e.g. Hotel Mahakal Sanctuary"
                    onChange={(e) =>
                      setForm({ ...form, hotelName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    OWNER / MANAGER NAME *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.name}
                    placeholder="e.g. Vikram Sharma"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CONTACT PHONE *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.contactPhone}
                    placeholder="e.g. +91 98765 43210"
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL BANNER IMAGE URL
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelImage}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) =>
                      setForm({ ...form, hotelImage: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    FULL ADDRESS / LOCATION
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelAddress}
                    placeholder="e.g. Near Mahakal Temple Gate No. 4, Bada Ganesh Marg, Ujjain"
                    onChange={(e) =>
                      setForm({ ...form, hotelAddress: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CHECK-IN TIME
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.checkInTime}
                    placeholder="e.g. 12:00 PM"
                    onChange={(e) =>
                      setForm({ ...form, checkInTime: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CHECK-OUT TIME
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.checkOutTime}
                    placeholder="e.g. 11:00 AM"
                    onChange={(e) =>
                      setForm({ ...form, checkOutTime: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL DESCRIPTION & OVERVIEW
                  </label>
                  <textarea
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    rows={3}
                    value={form.hotelDescription}
                    placeholder="Describe your property, proximity to Mahakal temple, pure veg dining options, pilgrim services..."
                    onChange={(e) =>
                      setForm({ ...form, hotelDescription: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold d-block mb-2">
                    HOTEL AMENITIES & FACILITIES
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`btn btn-sm rounded-pill px-3 py-1.5 ${form.amenities?.includes(a) ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-secondary"}`}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {form.amenities?.includes(a) ? "✓ " : "+ "}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn ${styles.goldBtn} rounded-pill px-4 fw-bold`}
                >
                  {saving ? "Saving Changes..." : "Save Hotel Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserProfile({ user, onOpenAuth, onUpdateUser }) {
  // Admin has ONLY the Admin Panel (/admin) and does not have a user profile page
  if (user && (user.role === "official" || user.role === "admin")) {
    return <Navigate to="/admin" replace />;
  }

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [vipTickets, setVipTickets] = useState([]);
  const [entryPasses, setEntryPasses] = useState([]);
  const [selectedPassModal, setSelectedPassModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const endpoint =
        user?.role === "hotel"
          ? "/api/rooms/partner-bookings"
          : "/api/rooms/my-bookings";
      const res = await axios.get(endpoint);
      setBookings(res.data || []);
    } catch (err) {
      // Silently fail if no bookings or not authenticated
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }

    const handleTicketBooked = () => {
      fetchBookings();
    };
    window.addEventListener("mahakal-booking-success", handleTicketBooked);
    window.addEventListener(
      "bharat_darshi_booking_success",
      handleTicketBooked,
    );
    window.addEventListener("india_booking_success", handleTicketBooked);
    return () => {
      window.removeEventListener("mahakal-booking-success", handleTicketBooked);
      window.removeEventListener(
        "bharat_darshi_booking_success",
        handleTicketBooked,
      );
      window.removeEventListener("india_booking_success", handleTicketBooked);
    };
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setCancellingId(bookingId);
    try {
      await axios.patch(`/api/rooms/cancel-booking/${bookingId}`);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleSaveHotelProfile = async (form) => {
    if (!form.hotelName || !form.name) {
      toast.error("Hotel Name and Owner Name are required.");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await axios.put("/api/auth/profile", form);
      toast.success("Hotel profile updated successfully!");
      if (onUpdateUser) onUpdateUser(res.data.user);
      setShowEditProfileModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update hotel profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div
        className="bg-black min-vh-100 text-white d-flex align-items-center justify-content-center"
        style={{ paddingTop: "110px" }}
      >
        <div className="container py-4 text-center max-w-600 mx-auto">
          <div className="p-5 bg-dark rounded-4 border border-warning border-opacity-30 shadow-2xl">
            <div
              className="rounded-circle bg-warning text-dark mx-auto p-3 d-flex align-items-center justify-content-center mb-3"
              style={{ width: 72, height: 72 }}
            >
              <Lock size={36} />
            </div>
            <h3 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>
              Authentication Required
            </h3>
            <p className="text-secondary small mb-4">
              Please sign in to access your pilgrim profile, Aarti passes, and
              hotel stay reservations.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-warning rounded-pill px-4 py-2 font-semibold"
                onClick={() => onOpenAuth && onOpenAuth("login")}
              >
                Sign In
              </button>
              <button
                className={styles.goldBtn}
                style={{ padding: "8px 24px", fontSize: "0.9rem" }}
                onClick={() => onOpenAuth && onOpenAuth("signup")}
              >
                Register Account <ArrowRight size={16} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  if (user.role !== "hotel") {
    return (
      <div className="bg-light min-vh-100 pb-5" style={{ paddingTop: "110px" }}>
        <div className="container py-4">
          <TouristProfileView 
            user={user} 
            bookings={bookings} 
            onCancelBooking={handleCancelBooking} 
            cancellingId={cancellingId} 
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 bg-black text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4">
        <div className="p-4 p-md-5 rounded-4 mb-5 border border-warning border-opacity-30 shadow-2xl user-profile-header-card">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4">
              {/* Avatar */}
              <div
                className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow-lg"
                style={{
                  width: 84,
                  height: 84,
                  fontSize: "2rem",
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h2
                    className={`text-white fw-bold mb-0 ${styles.playfairFont}`}
                  >
                    {user.role === "hotel"
                      ? user.hotelName || user.name
                      : user.name}
                  </h2>
                  <span
                    className={`badge ${user.role === "hotel" ? "bg-warning text-dark" : "bg-dark border border-warning border-opacity-40 text-warning"} px-3 py-1 rounded-pill small fw-semibold`}
                  >
                    {user.role === "hotel"
                      ? "🏨 Hotel Partner"
                      : user.role === "official"
                        ? "🛡️ Temple Official"
                        : "🙏 Tourist"}
                  </span>
                </div>
                <p className="text-secondary small mb-2">
                  {user.email} · {user.contactPhone || "No Phone Registered"}
                </p>
                <div className="d-flex align-items-center gap-1.5 text-success small">
                  <ShieldCheck size={14} /> <span>Verified Account</span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Hotel Partner */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              {user.role === "hotel" && (
                <>
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className={`btn ${styles.goldBtn} btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 fw-bold shadow`}
                  >
                    <Edit3 size={14} /> Edit Hotel Details
                  </button>
                  <a
                    href="/hotel-dashboard"
                    className="btn btn-outline-warning btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 fw-bold"
                  >
                    <Building size={14} /> Go to Hotel Dashboard
                  </a>
                </>
              )}
              <button
                onClick={fetchBookings}
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5"
              >
                <RefreshCw
                  size={14}
                  className={loadingBookings ? "spin" : ""}
                />{" "}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* HOTEL PARTNER PROPERTY DETAILS CARD */}
        {user.role === "hotel" && (
          <div className="bg-dark rounded-4 border border-warning border-opacity-30 overflow-hidden shadow-2xl mb-5">
            <div className="position-relative" style={{ height: 220 }}>
              <img
                src={
                  user.hotelImage ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
                }
                alt={user.hotelName || user.name}
                className="w-100 h-100 object-fit-cover"
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.95) 100%)",
                }}
              />
              <div className="position-absolute bottom-0 start-0 m-4 d-flex flex-wrap align-items-end justify-content-between w-100 pe-5">
                <div>
                  <span className="badge bg-warning text-dark fw-semibold px-3 py-1 rounded-pill small mb-2 d-inline-block">
                    Hotel Property Profile
                  </span>
                  <h3
                    className={`fw-bold mb-1 ${styles.playfairFont} hotel-overlay-title`}
                    style={{
                      color: "#ffffff",
                      textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                    }}
                  >
                    {user.hotelName || `${user.name}'s Hotel`}
                  </h3>
                  <div className="d-flex align-items-center gap-2 text-warning small">
                    <MapPin size={14} />
                    <span>
                      {user.hotelAddress ||
                        "Near Mahakal Temple, Ujjain, Madhya Pradesh"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className={`btn ${styles.goldBtn} fw-bold rounded-pill px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2 shadow`}
                >
                  <Edit3 size={16} /> Edit Hotel Details
                </button>
              </div>
            </div>

            <div className="p-4 p-md-5">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Owner / Manager
                    </span>
                    <div className="d-flex align-items-center gap-2 text-white fw-bold mb-1">
                      <Users size={16} className="text-warning" />
                      <span>{user.name}</span>
                    </div>
                    <span className="text-secondary small d-block">
                      {user.email}
                    </span>
                    <span className="text-secondary small d-block mt-1">
                      📞 {user.contactPhone || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Check-in / Check-out
                    </span>
                    <div className="d-flex align-items-center gap-2 small mb-1">
                      <Clock size={16} className="text-warning flex-shrink-0" />
                      <span className="text-body">
                        <strong className="fw-bold me-1 text-body">
                          Check-in:
                        </strong>
                        <span className="fw-semibold text-body">
                          {user.checkInTime || "12:00 PM"}
                        </span>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 small">
                      <Clock size={16} className="text-warning flex-shrink-0" />
                      <span className="text-body">
                        <strong className="fw-bold me-1 text-body">
                          Check-out:
                        </strong>
                        <span className="fw-semibold text-body">
                          {user.checkOutTime || "11:00 AM"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Partner Status
                    </span>
                    <div className="d-flex align-items-center gap-2 text-success fw-bold mb-1">
                      <ShieldCheck size={16} />
                      <span>Verified Partner</span>
                    </div>
                    <small className="text-secondary">
                      Approved for Pilgrim Lodging
                    </small>
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
                    <h6 className="text-warning fw-semibold small mb-2">
                      Hotel Overview & Description
                    </h6>
                    <p className="text-light mb-0 leading-relaxed">
                      {user.hotelDescription ||
                        'No overview provided yet. Click "Edit Hotel Details" to add a property description.'}
                    </p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="col-12">
                  <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
                    <h6 className="text-warning fw-semibold small mb-3">
                      Amenities & Facilities
                    </h6>
                    {user.amenities && user.amenities.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {user.amenities.map((a) => (
                          <span
                            key={a}
                            className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-1.5 small"
                          >
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-secondary small mb-0">
                        No amenities listed yet. Click "Edit Hotel Details" to
                        add facilities.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row & Bookings Section for Devotee Users */}
        
        {/* EDIT HOTEL PROFILE MODAL */}
        {showEditProfileModal && (
          <EditHotelProfileModal
            user={user}
            saving={savingProfile}
            onSave={handleSaveHotelProfile}
            onClose={() => setShowEditProfileModal(false)}
          />
        )}
      </div>
    </div>
  );
}


// ==========================================
// NEW TOURIST PROFILE COMPONENT
// ==========================================

function TouristProfileView({ user, bookings, onCancelBooking, cancellingId }) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  // Generate dummy notifications dynamically from bookings and profile status
  const notifications = React.useMemo(() => {
    const notifs = [];
    if (bookings && bookings.length > 0) {
      const recent = bookings[0];
      notifs.push({
        id: 'notif-1',
        title: 'Booking Confirmed',
        message: `Your stay at ${recent.hotelName || 'the hotel'} is confirmed.`,
        time: new Date(recent.createdAt || Date.now()).toLocaleDateString(),
        read: false
      });
    }
    notifs.push({
      id: 'notif-2',
      title: 'Profile Active',
      message: 'Welcome to your BharatDarshi traveler profile!',
      time: 'Just now',
      read: true
    });
    return notifs;
  }, [bookings]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const [activeTab, setActiveTab] = React.useState('profile');
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [savingProfile, setSavingProfile] = React.useState(false);
  
  const handleSaveProfile = async (form) => {
    setSavingProfile(true);
    try {
      const res = await axios.put("/api/auth/profile", form);
      toast.success("Profile updated successfully!");
      if (window.location) window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const totalBookings = bookings?.length || 0;
  const confirmedBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'active') || [];
  
  const totalReviews = 0;
  const savedPlaces = 0;

  return (
    <>
    <style>{`
      .tourist-avatar { transition: all 0.25s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      .tourist-avatar:hover { transform: scale(1.05); box-shadow: 0 8px 15px rgba(245, 158, 11, 0.2); }
      .stat-card { transition: all 0.25s ease; border: 1px solid transparent; }
      .stat-card:hover { transform: translateY(-2px); border-color: rgba(245, 158, 11, 0.3) !important; box-shadow: 0 8px 20px rgba(0,0,0,0.05) !important; }
      .stat-card .stat-icon { transition: all 0.25s ease; }
      .stat-card:hover .stat-icon { transform: translateY(-2px) scale(1.05); }
      .stat-card .stat-arrow { transition: all 0.25s ease; }
      .stat-card:hover .stat-arrow { transform: translateX(3px); color: #d97706 !important; }
      .booking-card { transition: all 0.25s ease; border: 1px solid transparent; }
      .booking-card:hover { transform: translateY(-3px); border-color: rgba(245, 158, 11, 0.2) !important; box-shadow: 0 6px 15px rgba(0,0,0,0.04) !important; }
      .booking-card .booking-img { transition: transform 0.4s ease; }
      .booking-card:hover .booking-img { transform: scale(1.05); }
      .booking-card .booking-arrow { transition: all 0.25s ease; }
      .booking-card:hover .booking-arrow { transform: translateX(3px); color: #d97706 !important; }
      .quick-action-btn { transition: all 0.2s ease; border: 1px solid transparent; background: #fff; }
      .quick-action-btn:hover { background-color: #fffbeb !important; border-color: rgba(245, 158, 11, 0.2) !important; }
      .quick-action-btn .qa-arrow { transition: transform 0.2s ease; }
      .quick-action-btn:hover .qa-arrow { transform: translateX(3px); color: #d97706 !important; }
      .profile-tab-btn { position: relative; transition: color 0.2s ease; }
      .profile-tab-btn::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: #f59e0b; transform: scaleX(0); transition: transform 0.25s ease; }
      .profile-tab-btn.active-tab { color: #111827 !important; font-weight: 700 !important; }
      .profile-tab-btn.active-tab::after { transform: scaleX(1); }
      .profile-tab-btn:hover:not(.active-tab) { color: #d97706 !important; }
    `}</style>

    <div className="bg-light rounded-4 text-dark shadow-sm pb-5" style={{ minHeight: '80vh' }}>
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-top-4 p-4 p-md-5 border-bottom border-light" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-4">
            <div className="position-relative tourist-avatar cursor-pointer" onClick={() => setShowEditModal(true)}>
              <div className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 90, height: 90, fontSize: '2.5rem' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm border">
                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 24, height: 24}}>
                  <Edit3 size={12}/>
                </div>
              </div>
            </div>
            
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <h2 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'var(--playfair)', fontSize: '1.75rem' }}>
                  {user.name}
                </h2>
                <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style={{width: 16, height: 16}}>
                   <CheckCircle size={10}/>
                </div>
              </div>
              
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-light text-secondary border rounded-pill px-3 py-1 fw-medium d-flex align-items-center gap-1">
                  <User size={12}/> Tourist
                </span>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-1 fw-medium d-flex align-items-center gap-1">
                  <Star size={12}/> Active
                </span>
              </div>
              
              <div className="d-flex flex-wrap text-secondary small gap-4 fw-medium">
                <span className="d-flex align-items-center gap-2"><Mail size={14} className="text-muted"/> {user.email}</span>
                <span className="d-flex align-items-center gap-2"><Phone size={14} className="text-muted"/> {user.contactPhone || "Not provided"}</span>
                <span className="d-flex align-items-center gap-2"><MapPin size={14} className="text-muted"/> {user.location || "Location not specified"}</span>
              </div>
            </div>
          </div>

          
          <div className="d-flex align-items-center gap-3">
            {/* NOTIFICATION BELL */}
            <div className="position-relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm border position-relative"
                style={{ width: 48, height: 48 }}
              >
                <Bell size={20} className="text-dark" />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="position-absolute bg-white rounded-4 shadow-lg border p-3" style={{ top: '60px', right: 0, width: '320px', zIndex: 1050 }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold mb-0">Notifications</h6>
                    <span className="badge bg-warning text-dark rounded-pill">{unreadCount} New</span>
                  </div>
                  <div className="d-flex flex-column gap-2 max-h-300 overflow-auto">
                    {notifications.length > 0 ? notifications.map(notif => (
                      <div key={notif.id} className={`p-3 rounded-3 ${notif.read ? 'bg-light' : 'bg-warning bg-opacity-10 border border-warning border-opacity-25'}`}>
                        <h6 className="fw-bold mb-1 small text-dark">{notif.title}</h6>
                        <p className="text-secondary mb-1" style={{ fontSize: '0.75rem' }}>{notif.message}</p>
                        <small className="text-muted" style={{ fontSize: '0.65rem' }}>{notif.time}</small>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-muted small">No notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* EXPLORE MORE BOX */}
            <div className="bg-warning bg-opacity-10 rounded-4 p-3 d-flex align-items-center gap-3 border border-warning border-opacity-25" style={{ minWidth: '300px' }}>

            <div className="text-warning bg-white rounded-circle p-2 shadow-sm"><Compass size={24}/></div>
            <div className="flex-grow-1">
              <h6 className="fw-bold text-dark mb-1">Explore more</h6>
              <p className="text-secondary small mb-0 lh-sm">Discover new destinations,<br/>create memories.</p>
            </div>
            <Link to="/places" className="btn btn-white bg-white rounded-circle p-2 shadow-sm border-0 d-flex text-dark text-decoration-none hover-scale">
               <ArrowRight size={16}/>
            </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 p-md-5 bg-light">
        {/* STATS ROW */}
        <div className="row g-4 mb-5">
          <div className="col-6 col-lg-3">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-light stat-card position-relative overflow-hidden">
               <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3 stat-icon"><Calendar size={18}/></div>
                 <span className="text-secondary small fw-semibold">Total Bookings</span>
               </div>
               <h2 className="fw-bold text-dark mb-0">{totalBookings}</h2>
               <ChevronRight size={16} className="text-muted position-absolute bottom-0 end-0 m-4 stat-arrow"/>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-light stat-card position-relative overflow-hidden">
               <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3 stat-icon"><Star size={18}/></div>
                 <span className="text-secondary small fw-semibold">Total Reviews</span>
               </div>
               <h2 className="fw-bold text-dark mb-0">{totalReviews}</h2>
               <ChevronRight size={16} className="text-muted position-absolute bottom-0 end-0 m-4 stat-arrow"/>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-light stat-card position-relative overflow-hidden">
               <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3 stat-icon"><Heart size={18}/></div>
                 <span className="text-secondary small fw-semibold">Saved Places</span>
               </div>
               <h2 className="fw-bold text-dark mb-0">{savedPlaces}</h2>
               <ChevronRight size={16} className="text-muted position-absolute bottom-0 end-0 m-4 stat-arrow"/>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-light stat-card position-relative overflow-hidden">
               <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-success bg-opacity-10 text-success p-2 rounded-3 stat-icon"><Activity size={18}/></div>
                 <span className="text-secondary small fw-semibold">Travel Streak</span>
               </div>
               <h2 className="fw-bold text-dark mb-0 text-muted">N/A</h2>
               <ChevronRight size={16} className="text-muted position-absolute bottom-0 end-0 m-4 stat-arrow"/>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="row g-4">
          
          <div className="col-lg-8">
            {/* RECENT BOOKINGS */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border border-light">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <div className="bg-warning bg-opacity-25 text-warning p-1 rounded"><Calendar size={18}/></div> 
                  Recent Bookings
                </h5>
              </div>
              
              {confirmedBookings.length > 0 ? (
                <div className="d-flex gap-3 overflow-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                  {confirmedBookings.slice(0,4).map(b => (
                    <Link to={`/place/${b.roomId || b._id}`} key={b._id} className="text-decoration-none">
                      <div className="rounded-4 p-3 d-flex align-items-center gap-3 bg-light booking-card" style={{ minWidth: '320px', cursor: 'pointer' }}>
                         <div className="rounded-3 bg-secondary overflow-hidden flex-shrink-0" style={{ width: 64, height: 64 }}>
                            <img src={b.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200"} alt="Booking" className="w-100 h-100 object-fit-cover booking-img" />
                         </div>
                         <div className="flex-grow-1">
                           <h6 className="fw-bold text-dark mb-1 text-truncate" style={{ maxWidth: '160px' }}>{b.hotelName || "Stay Reservation"}</h6>
                           <div className="text-secondary small mb-2 d-flex align-items-center gap-1">
                             <Calendar size={12}/> {new Date(b.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </div>
                           <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 fw-medium" style={{ fontSize: '0.7rem' }}>Confirmed</span>
                         </div>
                         <div className="text-muted"><ChevronRight size={18} className="booking-arrow"/></div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-light rounded-4 border border-dashed">
                   <Calendar size={32} className="text-muted mb-2 opacity-50"/>
                   <h6 className="text-dark fw-bold mb-1">No bookings yet</h6>
                   <p className="text-secondary small mb-3">Your recent travel reservations will appear here.</p>
                   <Link to="/places" className="btn btn-warning rounded-pill fw-medium px-4">Find a Destination</Link>
                </div>
              )}
            </div>

            {/* TABS */}
            <div className="bg-white rounded-4 shadow-sm border border-light overflow-hidden">
               <div className="d-flex border-bottom px-2">
                 {['profile', 'bookings', 'activity', 'reviews', 'saved'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`btn border-0 rounded-0 px-4 py-3 fw-medium profile-tab-btn ${activeTab === tab ? 'active-tab' : 'text-secondary'}`}
                     style={{ textTransform: 'capitalize' }}
                   >
                     {tab === 'saved' ? 'Saved Places' : tab}
                   </button>
                 ))}
               </div>
               
               <div className="p-4 p-md-5">
                 
                 {activeTab === 'bookings' && (
                   <div className="row g-4">
                     <div className="col-12">
                       <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Calendar size={18} className="text-muted"/> All Bookings</h6>
                       {confirmedBookings.length > 0 ? (
                         <div className="d-flex flex-column gap-3">
                           {confirmedBookings.map(b => (
                             <div key={b._id} className="rounded-4 p-3 d-flex align-items-center gap-3 bg-light booking-card w-100">
                               <div className="rounded-3 bg-secondary overflow-hidden flex-shrink-0" style={{ width: 80, height: 80 }}>
                                 <img src={b.hotelImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200"} alt="Booking" className="w-100 h-100 object-fit-cover booking-img" />
                               </div>
                               <div className="flex-grow-1">
                                 <h6 className="fw-bold text-dark mb-1">{b.hotelName || "Stay Reservation"}</h6>
                                 <div className="text-secondary small mb-2 d-flex align-items-center gap-2">
                                   <span><Calendar size={12}/> Check-In: {new Date(b.checkInDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                   <span>&bull;</span>
                                   <span>{b.nights} {b.nights === 1 ? 'Night' : 'Nights'}</span>
                                 </div>
                                 <div className="d-flex gap-2 align-items-center">
                                   <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 fw-medium" style={{ fontSize: '0.7rem' }}>Confirmed</span>
                                   <span className="text-muted fw-bold" style={{fontSize: '0.8rem'}}>₹{b.totalPrice}</span>
                                 </div>
                               </div>
                               {b.roomId && (
                                 <Link to={`/place/${b.roomId}`} className="btn btn-outline-warning rounded-pill btn-sm fw-bold px-3">
                                   View Details
                                 </Link>
                               )}
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-center py-5">
                           <Calendar size={48} className="text-muted opacity-25 mb-3 mx-auto"/>
                           <h6 className="fw-bold text-dark">No Bookings Found</h6>
                           <p className="text-secondary small">You haven't made any reservations yet.</p>
                           <Link to="/hotels" className="btn btn-warning rounded-pill mt-3 fw-medium px-4">Explore Hotels</Link>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
                 {activeTab === 'profile' && (
                   <div className="row g-5">
                     <div className="col-md-6">
                       <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><User size={18} className="text-muted"/> Personal Information</h6>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Full Name</small>
                         <div className="text-dark fw-medium">{user.name}</div>
                       </div>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Email</small>
                         <div className="text-dark fw-medium">{user.email}</div>
                       </div>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Phone</small>
                         <div className="text-dark fw-medium">{user.contactPhone || "Not Registered"}</div>
                       </div>
                     </div>
                     <div className="col-md-6">
                       <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><MapPin size={18} className="text-muted"/> Location & Preferences</h6>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Location</small>
                         <div className="text-dark fw-medium">{user.location || "Not Provided"}</div>
                       </div>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Registration Date</small>
                         <div className="text-dark fw-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                       </div>
                       <div className="mb-4">
                         <small className="text-muted fw-semibold d-block mb-1">Last Active</small>
                         <div className="text-dark fw-medium">Today</div>
                       </div>
                     </div>
                     <div className="col-12 mt-2">
                       <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><ShieldCheck size={18} className="text-muted"/> Account</h6>
                       <div className="row">
                         <div className="col-md-6 mb-4">
                           <small className="text-muted fw-semibold d-block mb-1">Role</small>
                           <div className="text-dark fw-medium text-capitalize">{user.role}</div>
                         </div>
                         <div className="col-md-6 mb-4">
                           <small className="text-muted fw-semibold d-block mb-2">Status</small>
                           <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-medium"><CheckCircle size={12} className="me-1"/> Active</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
                 {activeTab === 'activity' && (
                   <div className="text-center py-5">
                      <Activity size={48} className="text-muted opacity-25 mb-3 mx-auto"/>
                      <h6 className="fw-bold text-dark">No Recent Activity</h6>
                      <p className="text-secondary small">Your timeline of actions will appear here.</p>
                   </div>
                 )}
                 {activeTab === 'reviews' && (
                   <div className="text-center py-5">
                      <Star size={48} className="text-muted opacity-25 mb-3 mx-auto"/>
                      <h6 className="fw-bold text-dark">No Reviews Yet</h6>
                      <p className="text-secondary small">Share your experiences with other travelers.</p>
                   </div>
                 )}
                 {activeTab === 'saved' && (
                   <div className="text-center py-5">
                      <Heart size={48} className="text-muted opacity-25 mb-3 mx-auto"/>
                      <h6 className="fw-bold text-dark">No Saved Places</h6>
                      <p className="text-secondary small">Explore destinations and save them for later.</p>
                      <Link to="/places" className="btn btn-warning rounded-pill mt-3 fw-medium px-4">Explore Destinations</Link>
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="col-lg-4">
             {/* QUICK ACTIONS */}
             <div className="bg-white p-4 rounded-4 shadow-sm mb-4 border border-light">
               <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2"><Compass size={18} className="text-warning"/> Quick Actions</h6>
               
               <div className="d-flex flex-column gap-2">
                 <button onClick={() => setShowEditModal(true)} className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between quick-action-btn">
                    <div className="d-flex align-items-center gap-3">
                       <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle"><User size={16}/></div>
                       <div>
                         <div className="fw-bold text-dark lh-1 mb-1" style={{fontSize: '0.9rem'}}>Edit Profile</div>
                         <div className="text-secondary" style={{fontSize: '0.75rem'}}>Update your information</div>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-muted qa-arrow"/>
                 </button>
                 
                 <button onClick={() => { setActiveTab('bookings'); window.scrollTo({top: 500, behavior: 'smooth'}); }} className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between quick-action-btn">
                    <div className="d-flex align-items-center gap-3">
                       <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle"><Calendar size={16}/></div>
                       <div>
                         <div className="fw-bold text-dark lh-1 mb-1" style={{fontSize: '0.9rem'}}>My Bookings</div>
                         <div className="text-secondary" style={{fontSize: '0.75rem'}}>View your bookings</div>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-muted qa-arrow"/>
                 </button>

                 <button onClick={() => toast.error("Saved Places functionality is missing from existing application")} className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between quick-action-btn">
                    <div className="d-flex align-items-center gap-3">
                       <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle"><Heart size={16}/></div>
                       <div>
                         <div className="fw-bold text-dark lh-1 mb-1" style={{fontSize: '0.9rem'}}>Saved Places</div>
                         <div className="text-secondary" style={{fontSize: '0.75rem'}}>Your favorite destinations</div>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-muted qa-arrow"/>
                 </button>

                 <button onClick={() => toast.error("Change Password functionality is missing from existing application")} className="btn text-start p-3 rounded-3 d-flex align-items-center justify-content-between quick-action-btn">
                    <div className="d-flex align-items-center gap-3">
                       <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle"><Lock size={16}/></div>
                       <div>
                         <div className="fw-bold text-dark lh-1 mb-1" style={{fontSize: '0.9rem'}}>Change Password</div>
                         <div className="text-secondary" style={{fontSize: '0.75rem'}}>Keep your account secure</div>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-muted qa-arrow"/>
                 </button>
               </div>
             </div>

             {/* RECENT ACTIVITY */}
             <div className="bg-white p-4 rounded-4 shadow-sm border border-light">
               <div className="d-flex justify-content-between align-items-center mb-4">
                 <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2"><Clock size={18} className="text-warning"/> Recent Activity</h6>
               </div>
               
               <div className="d-flex flex-column gap-3">
                 <div className="d-flex gap-3 align-items-start">
                   <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle mt-1"><CheckCircle size={14}/></div>
                   <div>
                     <div className="fw-bold text-dark small lh-sm">Profile active</div>
                     <div className="text-secondary" style={{fontSize: '0.75rem'}}>Personal information</div>
                     <div className="text-muted mt-1" style={{fontSize: '0.7rem'}}>Today</div>
                   </div>
                 </div>
                 {confirmedBookings.slice(0, 1).map(b => (
                   <div key={b._id} className="d-flex gap-3 align-items-start">
                     <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle mt-1"><Calendar size={14}/></div>
                     <div>
                       <div className="fw-bold text-dark small lh-sm">Booking confirmed</div>
                       <div className="text-secondary" style={{fontSize: '0.75rem'}}>{b.hotelName || "Stay Reservation"}</div>
                       <div className="text-muted mt-1" style={{fontSize: '0.7rem'}}>{new Date(b.createdAt || Date.now()).toLocaleDateString('en-GB')}</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>

        </div>
      </div>
      
      {showEditModal && (
        <EditTouristProfileModal 
          user={user}
          saving={savingProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
    </>
  );
}
function EditTouristProfileModal({ user, onSave, onClose, saving }) {
  const [form, setForm] = React.useState({
    name: user?.name || "",
    contactPhone: user?.contactPhone || "",
    location: user?.location || "",
  });

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header border-bottom bg-light px-4 py-3">
            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
              <Edit3 size={20} className="text-warning" /> Edit Profile
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">FULL NAME</label>
                <input className="form-control bg-light border-0" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">CONTACT PHONE</label>
                <input className="form-control bg-light border-0" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">LOCATION</label>
                <input className="form-control bg-light border-0" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn btn-light rounded-pill px-4">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-warning fw-bold rounded-pill px-4">{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
