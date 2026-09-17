import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Check,
  LogIn,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function Support({ user, onOpenAuth }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill out Name, Phone Number, and Message!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/support", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Support Ticket Submitted! Our support team will contact you shortly."
      );
    } catch (err) {
      setIsSubmitting(false);
      const errMsg =
        err.response?.data?.error ||
        "Failed to submit support ticket. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{ backgroundColor: "#eaedf1", paddingTop: "120px", paddingBottom: "60px" }}
    >
      <div
        className="container max-w-5xl bg-white rounded-4 shadow-sm p-4 p-md-5 mx-3"
        style={{ borderRadius: "28px" }}
      >
        <div className="row g-4 g-lg-5 align-items-center">
          {/* LEFT COLUMN: TITLE & CONTACT INFO */}
          <div className="col-12 col-lg-5 d-flex flex-column justify-content-center pe-lg-4">
            <div className="mb-4">
              <h1
                className="fw-bold text-dark mb-3"
                style={{
                  fontSize: "clamp(34px, 4vw, 48px)",
                  lineHeight: "1.15",
                  letterSpacing: "-0.5px",
                }}
              >
                Talk to our<br />support team
              </h1>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  maxWidth: "360px",
                }}
              >
                Feel free to reach out for help with your passes, accommodations
                or any questions you may have regarding your visit.
              </p>
            </div>

            <div className="d-flex flex-column gap-3 mt-1">
              <div
                className="d-flex align-items-center gap-3 px-3.5 py-2.5 rounded-3"
                style={{ backgroundColor: "#f3f4f6", maxWidth: "340px" }}
              >
                <Mail size={17} style={{ color: "#374151" }} className="flex-shrink-0" />
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1f2937" }}>
                  support@bharatdarshi.gov.in
                </span>
              </div>

              <div
                className="d-flex align-items-center gap-3 px-3.5 py-2.5 rounded-3"
                style={{ backgroundColor: "#f3f4f6", maxWidth: "340px" }}
              >
                <MapPin size={17} style={{ color: "#374151" }} className="flex-shrink-0" />
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1f2937" }}>
                  Bharat Darshi HQ, New Delhi, India
                </span>
              </div>

              <div
                className="d-flex align-items-center gap-3 px-3.5 py-2.5 rounded-3"
                style={{ backgroundColor: "#f3f4f6", maxWidth: "340px" }}
              >
                <Phone size={17} style={{ color: "#374151" }} className="flex-shrink-0" />
                <span style={{ fontSize: "13.5px", fontWeight: "600", color: "#1f2937" }}>
                  +91 (11) 2345-6789
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM CARD */}
          <div className="col-12 col-lg-7">
            <div
              className="p-4 p-md-4 rounded-4"
              style={{ backgroundColor: "#f3f4f6", borderRadius: "20px" }}
            >
              {!user ? (
                <div className="p-4 rounded-4 bg-white text-center my-2 py-5 shadow-sm">
                  <div
                    className="rounded-circle bg-dark text-white mx-auto p-3 d-flex align-items-center justify-content-center mb-3"
                    style={{ width: 56, height: 56 }}
                  >
                    <LogIn size={24} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "16px" }}>
                    Authentication Required
                  </h5>
                  <p style={{ color: "#6b7280", fontSize: "13px" }} className="mb-4">
                    Please log in to submit a support query to our helpdesk.
                  </p>
                  <button
                    onClick={() => onOpenAuth && onOpenAuth("login")}
                    className="btn text-white rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2"
                    style={{ backgroundColor: "#111827", fontSize: "13px", fontWeight: "600" }}
                  >
                    <LogIn size={15} />
                    <span>Sign In to Submit Support Query</span>
                  </button>
                </div>
              ) : submitted ? (
                <div className="p-4 rounded-4 bg-white text-center my-2 py-5 shadow-sm">
                  <div
                    className="rounded-circle bg-success text-white mx-auto p-2.5 d-flex align-items-center justify-content-center mb-3"
                    style={{ width: 48, height: 48 }}
                  >
                    <Check size={24} />
                  </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: "16px" }}>
                    Message Sent Successfully!
                  </h5>
                  <p style={{ color: "#6b7280", fontSize: "13px" }} className="mb-4">
                    Thank you, <strong className="text-dark">{formData.name}</strong>.
                    Our team will contact you shortly at{" "}
                    <strong className="text-dark">{formData.phone}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: user.name || "",
                        phone: user.phone || "",
                        email: user.email || "",
                        category: "General Inquiry",
                        message: "",
                      });
                    }}
                    className="btn border border-secondary text-dark rounded-pill px-4 py-2"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label
                      style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}
                      className="d-block"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Your Full Name"
                      className="form-control border-0 rounded-3 shadow-none px-3 py-2.5"
                      style={{ backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}
                      className="d-block"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Your Email Address"
                      className="form-control border-0 rounded-3 shadow-none px-3 py-2.5"
                      style={{ backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label
                      style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}
                      className="d-block"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Your Phone Number"
                      className="form-control border-0 rounded-3 shadow-none px-3 py-2.5"
                      style={{ backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}
                      className="d-block"
                    >
                      Inquiry Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select border-0 rounded-3 shadow-none px-3 py-2.5"
                      style={{ backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                    >
                      <option value="General Inquiry">General Bharat Darshi Query</option>
                      <option value="Destinations & Places">Explore Places & Destinations</option>
                      <option value="Stays & Hotels">Stays & Hotel Bookings</option>
                      <option value="AI Trip Planner">AI Trip Planner & Itinerary</option>
                      <option value="Local Services & Events">Local Events & Services</option>
                      <option value="Account & Profile">Account & Profile Support</option>
                      <option value="Feedback & Assistance">Feedback & Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}
                      className="d-block"
                    >
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write Your Message Here"
                      className="form-control border-0 rounded-3 shadow-none px-3 py-2.5"
                      style={{ backgroundColor: "#ffffff", color: "#111827", fontSize: "14px" }}
                      required
                    ></textarea>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn text-white rounded-pill px-4 py-2.5 d-inline-flex align-items-center gap-2"
                      style={{ backgroundColor: "#111827", fontSize: "14px", fontWeight: "600" }}
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}



