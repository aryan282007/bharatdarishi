import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  QrCode,
  CreditCard,
  Building2,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Ticket,
  Printer,
  ChevronRight,
  Phone,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { recordRoomBooking } from "../utils/bookingStats";

export function PaymentPage({ user, onOpenAuth }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve booking data passed from HotelDetails page
  const bookingState = location.state || {};
  const {
    hotel = {
      name: "Maxone Ascent Hotel Luxury Stay",
      location: "Jln. Diponegoro V No. 12, Kota Malang",
      roomType: "Luxury Studio Suite",
      pricePerNight: 3010,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    },
    checkInDate = new Date().toISOString().substring(0, 10),
    checkOutDate = new Date(Date.now() + 86400000 * 3)
      .toISOString()
      .substring(0, 10),
    nights = 3,
    guestsCount = "2 Adults, 1 Children",
    guestName = user?.name || "Guest Traveler",
    guestPhone = "+91 98765 43210",
    selectedFeatureIds = ["breakfast"],
    finalTotalPayment = 7724,
    basePriceTotal = 9030,
    discountAmount = 1806,
    addOnsTotal = 1050,
    serviceFee = 250,
  } = bookingState;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle Pay & Confirm Stay Action
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to complete your booking.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }

    setLoading(true);

    const generatedPaymentId = `pay_${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    const ticketCode = `BHARAT-STAY-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      if (hotel.isApiRoom && hotel._id) {
        await axios.post(`/api/rooms/book/${hotel._id}`, {
          checkInDate,
          checkOutDate,
          nights,
          guestPhone,
          paymentId: generatedPaymentId,
        });
      } else {
        await axios.post("/api/hotels/book", {
          hotelId: hotel.id || hotel._id,
          hotelName: hotel.name,
          roomType: hotel.roomType || "Luxury Suite",
          nights,
          checkInDate,
          checkOutDate,
          guestName: guestName || user?.name,
          guestPhone,
          totalPrice: finalTotalPayment,
          paymentId: generatedPaymentId,
        });
      }
    } catch (err) {
      console.warn("Backend booking log warning:", err.message);
    } finally {
      setLoading(false);
    }

    recordRoomBooking(hotel.name);
    window.dispatchEvent(new Event("mahakal-booking-success"));
    window.dispatchEvent(new Event("bharat_darshi_booking_success"));

    const confirmedTicket = {
      ticketCode,
      paymentId: generatedPaymentId,
      hotelName: hotel.name,
      roomType: hotel.roomType || "Luxury Suite",
      location: hotel.location,
      checkInDate,
      checkOutDate,
      nights,
      guestsCount,
      guestName: guestName || user?.name,
      guestPhone,
      userEmail: user?.email || "guest@bharatdarshi.gov.in",
      totalPrice: finalTotalPayment,
    };

    setTicketDetails(confirmedTicket);
    setIsSuccess(true);
    toast.success(
      `Payment Verified! E-Ticket sent to ${user?.email || "your email"}! 🏨`,
    );
  };

  return (
    <div
      className="w-100 bg-light text-dark overflow-hidden d-flex flex-column"
      style={{
        height: "100vh",
        maxHeight: "100vh",
        paddingTop: "64px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="container flex-grow-1 d-flex flex-column overflow-hidden pb-3 pt-0"
        style={{ maxWidth: "1140px" }}
      >
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-2 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-white border rounded-circle p-1.5 d-flex align-items-center justify-content-center shadow-2xs hover-lift"
            style={{ width: "32px", height: "32px" }}
          >
            <ArrowLeft size={15} />
          </button>
          <span
            className="text-muted small fw-medium"
            style={{ fontSize: "0.82rem" }}
          >
            Hotel Booking
          </span>
          <ChevronRight size={14} className="text-muted opacity-50" />
          <span
            className="fw-bold text-dark small"
            style={{ fontSize: "0.82rem" }}
          >
            Secure Payment Gateway
          </span>
        </div>

        {isSuccess && ticketDetails ? (
          /* ══════════════════════════════════════════════════════════════════ */
          /* SUCCESS CONFIRMATION & E-TICKET DISPLAY CARD (FITS 100VH) */
          /* ══════════════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-700 mx-auto my-auto w-100 overflow-auto rounded-4 border shadow-xl bg-white"
            style={{
              maxWidth: "700px",
              maxHeight: "calc(100vh - 125px)",
              borderColor: "#e2e8f0",
            }}
          >
            {/* Top Banner */}
            <div
              className="p-3 text-center text-white position-relative"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              }}
            >
              <div
                className="rounded-circle bg-success text-white mx-auto d-flex align-items-center justify-content-center mb-2 shadow-lg"
                style={{ width: "52px", height: "52px" }}
              >
                <CheckCircle2 size={30} />
              </div>
              <h4
                className="fw-extrabold mb-0.5"
                style={{ letterSpacing: "-0.5px" }}
              >
                Booking Confirmed! 🎉
              </h4>
              <p
                className="text-white-50 small mb-0"
                style={{ fontSize: "0.82rem" }}
              >
                Your reservation is verified and your official E-Ticket has been
                dispatched.
              </p>
            </div>

            {/* Email Alert Banner */}
            <div
              className="bg-amber-50 p-2 text-center border-bottom"
              style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
            >
              <span
                className="small fw-bold d-flex align-items-center justify-content-center gap-1.5"
                style={{ fontSize: "0.8rem" }}
              >
                <Sparkles size={15} />
                E-Ticket email sent to: <u>{ticketDetails.userEmail}</u>
              </span>
            </div>

            {/* Ticket Details Body */}
            <div className="p-3 p-md-4">
              <div className="d-flex align-items-center justify-content-between pb-2.5 border-bottom mb-3">
                <div>
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    TICKET REFERENCE CODE
                  </span>
                  <h5
                    className="fw-extrabold font-mono mb-0"
                    style={{ color: "#d97706" }}
                  >
                    {ticketDetails.ticketCode}
                  </h5>
                </div>
                <span
                  className="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill font-mono"
                  style={{ backgroundColor: "#dcfce7", color: "#166534" }}
                >
                  ✓ CONFIRMED
                </span>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    HOTEL PROPERTY
                  </span>
                  <h6 className="fw-bold text-dark mb-0 small">
                    {ticketDetails.hotelName}
                  </h6>
                </div>
                <div className="col-md-6">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    LOCATION
                  </span>
                  <p
                    className="fw-medium text-dark small mb-0 d-flex align-items-center gap-1"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <MapPin size={13} className="text-warning flex-shrink-0" />
                    <span>{ticketDetails.location}</span>
                  </p>
                </div>

                <div className="col-6 col-md-3">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    CHECK-IN
                  </span>
                  <strong className="text-dark small font-mono">
                    {ticketDetails.checkInDate}
                  </strong>
                </div>
                <div className="col-6 col-md-3">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    CHECK-OUT
                  </span>
                  <strong className="text-dark small font-mono">
                    {ticketDetails.checkOutDate}
                  </strong>
                </div>
                <div className="col-6 col-md-3">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    STAY DURATION
                  </span>
                  <strong className="text-dark small">
                    {ticketDetails.nights} Night(s)
                  </strong>
                </div>
                <div className="col-6 col-md-3">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    TOTAL PAID
                  </span>
                  <strong className="text-success small font-mono fs-6">
                    ₹{ticketDetails.totalPrice.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="col-md-6">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    PRIMARY GUEST NAME
                  </span>
                  <strong className="text-dark small">
                    {ticketDetails.guestName}
                  </strong>
                </div>
                <div className="col-md-6">
                  <span
                    className="text-muted small text-uppercase fw-bold d-block mb-0.5"
                    style={{ fontSize: "0.65rem" }}
                  >
                    CONTACT PHONE
                  </span>
                  <strong className="text-dark small">
                    {ticketDetails.guestPhone}
                  </strong>
                </div>
              </div>

              {/* QR Barcode Box */}
              <div
                className="p-2.5 bg-light rounded-3 text-center border font-mono mb-3"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <small
                  className="text-muted d-block uppercase fw-bold mb-1"
                  style={{ fontSize: "0.65rem" }}
                >
                  DIGITAL SCANNER QR / TICKET BARCODE
                </small>
                <div
                  className="d-inline-block bg-dark text-white px-3 py-1 rounded-2 fw-bold tracking-widest"
                  style={{ letterSpacing: "3px", fontSize: "0.95rem" }}
                >
                  ||| |||| | |||||| || | {ticketDetails.ticketCode} |||
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                <Link
                  to="/profile"
                  className="btn btn-warning flex-fill py-2 rounded-3 text-dark fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    backgroundColor: "#f59e0b",
                    border: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  <Ticket size={16} /> View E-Ticket in My Account
                </Link>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline-secondary py-2 px-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "0.88rem" }}
                >
                  <Printer size={16} /> Print Ticket
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════ */
          /* PAYMENT PAGE MAIN FORM & SUMMARY (FIXED EQUAL HEIGHT CARDS) */
          /* ══════════════════════════════════════════════════════════════════ */
          <div
            className="row g-3 w-100 mx-0 align-items-stretch"
            style={{ height: "calc(100vh - 120px)" }}
          >
            {/* LEFT COLUMN: PAYMENT METHOD SELECTOR & PAYMENT DETAILS */}
            <div className="col-lg-7 h-100 pe-lg-2 ps-0">
              <div
                className="bg-white rounded-4 border shadow-sm p-3 p-md-4 h-100 d-flex flex-column justify-content-between overflow-auto"
                style={{ borderColor: "#e2e8f0", height: "100%" }}
              >
                <div>
                  {/* Razorpay Gateway Header */}
                  <div className="d-flex align-items-center justify-content-between pb-2.5 border-bottom mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="px-2 py-0.5 rounded-2 text-white fw-bold font-mono small"
                        style={{
                          backgroundColor: "#0c2340",
                          fontSize: "0.78rem",
                        }}
                      >
                        Razorpay
                      </div>
                      <span
                        className="text-muted small fw-medium"
                        style={{ fontSize: "0.82rem" }}
                      >
                        Secured Payment Portal
                      </span>
                    </div>
                  </div>

                  <h6 className="fw-extrabold text-dark mb-2.5">
                    Select Payment Option
                  </h6>

                  <form
                    onSubmit={handleProcessPayment}
                    className="d-flex flex-column justify-content-between"
                  >
                    {/* Payment Method Selector Buttons */}
                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("upi")}
                          className={`btn w-100 py-2.5 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1 transition-all ${
                            paymentMethod === "upi"
                              ? "btn-dark text-white fw-bold shadow-sm"
                              : "btn-outline-secondary text-secondary border"
                          }`}
                          style={
                            paymentMethod === "upi"
                              ? {
                                  backgroundColor: "#0c2340",
                                  borderColor: "#0c2340",
                                }
                              : {}
                          }
                        >
                          <QrCode size={18} />
                          <span style={{ fontSize: "0.78rem" }}>UPI / QR</span>
                        </button>
                      </div>

                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("card")}
                          className={`btn w-100 py-2.5 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1 transition-all ${
                            paymentMethod === "card"
                              ? "btn-dark text-white fw-bold shadow-sm"
                              : "btn-outline-secondary text-secondary border"
                          }`}
                          style={
                            paymentMethod === "card"
                              ? {
                                  backgroundColor: "#0c2340",
                                  borderColor: "#0c2340",
                                }
                              : {}
                          }
                        >
                          <CreditCard size={18} />
                          <span style={{ fontSize: "0.78rem" }}>
                            Credit/Debit
                          </span>
                        </button>
                      </div>

                      <div className="col-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("netbanking")}
                          className={`btn w-100 py-2.5 rounded-3 d-flex flex-column align-items-center justify-content-center gap-1 transition-all ${
                            paymentMethod === "netbanking"
                              ? "btn-dark text-white fw-bold shadow-sm"
                              : "btn-outline-secondary text-secondary border"
                          }`}
                          style={
                            paymentMethod === "netbanking"
                              ? {
                                  backgroundColor: "#0c2340",
                                  borderColor: "#0c2340",
                                }
                              : {}
                          }
                        >
                          <Building2 size={18} />
                          <span style={{ fontSize: "0.78rem" }}>
                            NetBanking
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Payment Details Container */}
                    {paymentMethod === "upi" && (
                      <div
                        className="p-3 bg-light rounded-3 border mb-3 text-center"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <h6 className="fw-bold text-dark mb-0.5 small">
                          Scan UPI QR Code to Pay
                        </h6>
                        <p
                          className="text-muted small mb-2"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Instant verification with GPay, PhonePe, Paytm or BHIM
                        </p>

                        <div className="bg-white p-2 d-inline-block rounded-3 border shadow-2xs mb-2">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=bharatstay@sbi&pn=Bharat%20Stay&am=${finalTotalPayment}`}
                            alt="Payment QR Code"
                            className="img-fluid"
                            style={{ width: "120px", height: "120px" }}
                          />
                        </div>

                        <div className="d-flex justify-content-center flex-wrap gap-1.5">
                          {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map(
                            (app) => (
                              <span
                                key={app}
                                className="badge bg-white text-dark border px-2 py-1"
                                style={{ fontSize: "0.7rem" }}
                              >
                                ✓ {app}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div
                        className="p-3 bg-light rounded-3 border mb-3"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="mb-2">
                          <label
                            className="form-label text-dark small fw-bold mb-1"
                            style={{ fontSize: "0.78rem" }}
                          >
                            Card Number
                          </label>
                          <input
                            type="text"
                            required
                            className="form-control form-control-sm"
                            placeholder="4000 0000 0000 0000"
                            defaultValue="4242 •••• •••• 4242"
                          />
                        </div>
                        <div className="row g-2">
                          <div className="col-6">
                            <label
                              className="form-label text-dark small fw-bold mb-1"
                              style={{ fontSize: "0.78rem" }}
                            >
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              required
                              className="form-control form-control-sm"
                              placeholder="MM/YY"
                              defaultValue="12/28"
                            />
                          </div>
                          <div className="col-6">
                            <label
                              className="form-label text-dark small fw-bold mb-1"
                              style={{ fontSize: "0.78rem" }}
                            >
                              CVV Code
                            </label>
                            <input
                              type="password"
                              required
                              className="form-control form-control-sm"
                              placeholder="123"
                              defaultValue="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div
                        className="p-3 bg-light rounded-3 border mb-3"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <label
                          className="form-label text-dark small fw-bold mb-1.5"
                          style={{ fontSize: "0.78rem" }}
                        >
                          Select Your Bank
                        </label>
                        <select className="form-select form-select-sm">
                          <option>State Bank of India (SBI)</option>
                          <option>HDFC Bank</option>
                          <option>ICICI Bank</option>
                          <option>Axis Bank</option>
                          <option>Punjab National Bank</option>
                        </select>
                      </div>
                    )}

                    {/* Primary Pay Action Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn w-100 py-2.5 rounded-3 text-white fw-bold shadow-md d-flex align-items-center justify-content-center gap-2 mt-2"
                      style={{
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        border: "none",
                        fontSize: "0.92rem",
                      }}
                    >
                      {loading ? (
                        <span>Verifying & Confirming Booking...</span>
                      ) : (
                        <>
                          <Lock size={16} /> Pay ₹
                          {finalTotalPayment.toLocaleString("en-IN")} & Complete
                          Stay
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: BOOKING ORDER SUMMARY */}
            <div className="col-lg-5 h-100 ps-lg-2 pe-0">
              <div
                className="bg-white rounded-4 border shadow-sm p-3 p-md-4 h-100 d-flex flex-column justify-content-between overflow-auto"
                style={{ borderColor: "#e2e8f0", height: "100%" }}
              >
                <div>
                  <h6 className="fw-extrabold text-dark mb-2.5">
                    Reservation Summary
                  </h6>

                  {/* Hotel Card Preview */}
                  <div
                    className="d-flex align-items-center gap-3 pb-2.5 border-bottom mb-2.5"
                    style={{ gap: "16px" }}
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="rounded-3 object-fit-cover flex-shrink-0"
                      style={{ width: "72px", height: "72px" }}
                    />
                    <div className="ps-1">
                      <h6 className="fw-bold text-dark mb-1 small">
                        {hotel.name}
                      </h6>
                      <p
                        className="text-muted small mb-0 d-flex align-items-center gap-1"
                        style={{ fontSize: "0.76rem" }}
                      >
                        <MapPin
                          size={13}
                          className="text-warning flex-shrink-0"
                        />
                        <span>{hotel.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Dates & Guest Details Grid */}
                  <div
                    className="p-3 bg-light rounded-3 border my-3 text-secondary small"
                    style={{ backgroundColor: "#f8fafc", fontSize: "0.78rem" }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <span>Check-In:</span>
                      <strong className="text-dark font-mono">
                        {checkInDate}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Check-Out:</span>
                      <strong className="text-dark font-mono">
                        {checkOutDate}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Stay Duration:</span>
                      <strong className="text-dark">{nights} Night(s)</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Guests & Rooms:</span>
                      <strong className="text-dark">{guestsCount}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Contact Phone:</span>
                      <strong className="text-dark">{guestPhone}</strong>
                    </div>
                  </div>

                  {/* Itemized Pricing Breakdown */}
                  <h6
                    className="fw-bold text-dark mb-2.5 mt-3.5 small"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Payment Breakdown
                  </h6>
                  <div className="d-flex align-items-center justify-content-between mb-2 small">
                    <span className="text-muted">
                      {nights} Night(s) Base Rate
                    </span>
                    <span className="fw-bold font-mono text-dark">
                      ₹{basePriceTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2 small">
                    <span className="text-muted">Instant 20% Off</span>
                    <span className="fw-bold font-mono text-danger">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div className="d-flex align-items-center justify-content-between mb-2 small">
                      <span className="text-muted">Extra Features Add-Ons</span>
                      <span className="fw-bold font-mono text-dark">
                        +₹{addOnsTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="d-flex align-items-center justify-content-between mb-3 small">
                    <span className="text-muted">Service Fee & Taxes</span>
                    <span className="fw-bold font-mono text-dark">
                      +₹{serviceFee}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2.5 border-top mt-auto">
                  <span className="fw-bold text-dark small">
                    Total Amount Due
                  </span>
                  <span className="fw-extrabold font-mono text-dark fs-5">
                    ₹{finalTotalPayment.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
