import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Mail,
  User,
  Building,
  Phone,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Upload,
  CheckCircle2,
  FileText,
  Car,
  Palette,
  Compass,
  Briefcase,
  Camera,
  MapPin,
  Check,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export function AuthModal({
  show,
  initialMode = "login",
  onClose,
  onLoginSuccess,
}) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tourist",
    userType: "Tourist",
    serviceCategory: "Home Stays",
    contactPhone: "",
    hotelName: "",
    hotelAddress: "",
    hotelDescription: "",
    documentUrl: "",
    specialization: "",
    artForm: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUnderDev, setShowUnderDev] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({
    file: null,
    base64: "",
    fileName: "",
  });

  useEffect(() => {
    setIsSignup(initialMode === "signup");
    setError("");
    setShowUnderDev(false);
    setSelectedDoc({ file: null, base64: "", fileName: "" });
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "tourist",
      userType: "Tourist",
      serviceCategory: "Home Stays",
      contactPhone: "",
      hotelName: "",
      hotelAddress: "",
      hotelDescription: "",
      documentUrl: "",
      specialization: "",
      artForm: "",
      vehicleType: "",
      vehicleNumber: "",
      licenseNumber: "",
    });
  }, [initialMode, show]);

  if (!show) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.85);

        setSelectedDoc({
          file,
          base64: compressedBase64,
          fileName: file.name,
        });
        toast.success("Document photo selected!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        const errMsg =
          "Passwords do not match. Please double-check and try again.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      if (
        (formData.role === "service" || formData.role === "hotel") &&
        !selectedDoc.base64 &&
        !formData.documentUrl
      ) {
        const errMsg =
          "Please select a verification document photo for your service account.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      setShowUnderDev(true);
      return;
    }

    setLoading(true);

    try {
      let finalDocUrl = formData.documentUrl;

      // Upload to ImageKit ONLY when user clicks Create Account
      if (
        isSignup &&
        (formData.role === "service" || formData.role === "hotel") &&
        selectedDoc.base64
      ) {
        try {
          const uploadRes = await axios.post("/api/auth/upload-doc", {
            imageBase64: selectedDoc.base64,
            fileName: selectedDoc.fileName,
          });

          if (uploadRes.data && uploadRes.data.url) {
            finalDocUrl = uploadRes.data.url;
          }
        } catch (uploadErr) {
          console.error("ImageKit document upload failed:", uploadErr);
          finalDocUrl = selectedDoc.base64;
        }
      }

      const submitData = {
        ...formData,
        documentUrl: finalDocUrl,
      };

      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(endpoint, submitData);

      if (res.data.pendingApproval) {
        toast.success(
          res.data.message ||
            "Registration submitted! Your service account is pending approval by admin.",
          { duration: 6000 },
        );
        setIsSignup(false);
        setSelectedDoc({ file: null, base64: "", fileName: "" });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "tourist",
          userType: "Tourist",
          serviceCategory: "Home Stays",
          contactPhone: "",
          hotelName: "",
          hotelAddress: "",
          hotelDescription: "",
          documentUrl: "",
          specialization: "",
          artForm: "",
          vehicleType: "",
          vehicleNumber: "",
          licenseNumber: "",
        });
        return;
      }

      if (res.data.token) {
        localStorage.setItem("mahakal_token", res.data.token);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;
      }
      toast.success(
        res.data.message ||
          (isSignup
            ? "Account created successfully!"
            : "Welcome back! Logged in successfully."),
      );
      setSelectedDoc({ file: null, base64: "", fileName: "" });
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "tourist",
        userType: "Tourist",
        serviceCategory: "Home Stays",
        contactPhone: "",
        hotelName: "",
        hotelAddress: "",
        hotelDescription: "",
        documentUrl: "",
        specialization: "",
        artForm: "",
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: "",
      });
      if (onLoginSuccess) onLoginSuccess(res.data.user);
      onClose();
    } catch (err) {
      const errMsg =
        err.response?.data?.error ||
        err.message ||
        "Authentication failed. Please check your details.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.success(`${provider} authentication initiated.`);
    const mockUser = {
      name: "Bharat Darshi Explorer",
      email: formData.email || "explorer@bharatdarshi.gov.in",
      role: formData.role || "tourist",
    };
    if (onLoginSuccess) onLoginSuccess(mockUser);
    onClose();
  };

  const isServiceRole =
    formData.role === "service" || formData.role === "hotel";

  if (showUnderDev) {
    return (
      <AnimatePresence>
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
          }}
          onClick={() => {
            setShowUnderDev(false);
            onClose();
          }}
        >
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
              <img
                src="/appimage.jpeg"
                alt="App Preview"
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              <div
                className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setShowUnderDev(false);
                  onClose();
                }}
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
              <h3
                className="fw-bold text-dark mb-2 text-start"
                style={{
                  fontSize: "1.55rem",
                  letterSpacing: "-0.3px",
                  color: "#0f172a",
                  lineHeight: "1.25",
                }}
              >
                We Are Under Development
              </h3>

              <p
                className="text-start mb-4"
                style={{
                  color: "#64748b",
                  fontSize: "0.93rem",
                  lineHeight: "1.55",
                  fontWeight: "400",
                }}
              >
                Thank you for exploring Bharat Darshi! Our registration & service partner portal features are currently under active development and will be launching shortly.
              </p>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowUnderDev(false);
                    onClose();
                  }}
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

  return (
    <div
      className="modal show d-flex align-items-center justify-content-center p-2 p-md-3 position-fixed top-0 start-0 w-100 h-100 overflow-hidden"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg w-100 m-auto"
        style={{ maxWidth: "940px" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="modal-content bg-white text-dark border-0 rounded-4 overflow-hidden shadow-2xl position-relative"
          style={{ height: "680px", maxHeight: "94vh" }}
        >
          {/* Mobile Only Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-dark text-white rounded-circle p-2 position-absolute top-0 end-0 m-3 shadow d-md-none align-items-center justify-content-center"
            style={{
              zIndex: 30,
              width: 36,
              height: 36,
              backgroundColor: "rgba(0,0,0,0.65)",
              border: "none",
            }}
            title="Close Portal"
          >
            <X size={18} />
          </button>

          <div className="row g-0 h-100">
            {/* Left Side: Landscape Image Banner */}
            <div className="col-md-5 d-none d-md-block position-relative bg-black overflow-hidden h-100">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200"
                onError={(e) => {
                  e.target.src = "/featured_bg.jpg";
                }}
                alt="Bharat Darshi Travel Portal"
                className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)",
                }}
              />

              {/* Close Button on Image Corner */}
              <button
                type="button"
                onClick={onClose}
                className="btn text-white rounded-circle p-2 position-absolute top-0 end-0 m-3 shadow d-flex align-items-center justify-content-center transition-all"
                style={{
                  zIndex: 30,
                  width: 38,
                  height: 38,
                  backgroundColor: "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                }}
                title="Close Portal"
              >
                <X size={20} />
              </button>

              <div className="auth-modal-banner-content position-absolute bottom-0 start-0 p-4 p-lg-5 z-10">
                <div className="mb-3 d-flex align-items-center">
                  <span
                    className="fs-2 fw-bold d-flex align-items-center force-white-text"
                    style={{
                      letterSpacing: "-0.5px",
                      fontFamily: "'Poppins', sans-serif",
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                      color: "#ffffff",
                      textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                    }}
                  >
                    <span
                      className="force-white-text"
                      style={{ color: "#ffffff" }}
                    >
                      भारत
                    </span>
                    <span
                      className="yellow-text ms-1"
                      style={{ color: "#facc15" }}
                    >
                      Darshi
                    </span>
                  </span>
                </div>
                <h3
                  className="fw-bold mb-2 force-white-text"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "1.35rem",
                    color: "#ffffff",
                    textShadow: "0 2px 10px rgba(0,0,0,0.9)",
                    lineHeight: 1.35,
                  }}
                >
                  Discover the Eternal Beauty & Culture of India
                </h3>
                <p
                  className="small force-white-text mb-0"
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "#ffffff",
                    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                  }}
                >
                  Explore iconic destinations, plan AI-curated itineraries, book
                  verified stays, and experience authentic local services across
                  India.
                </p>
              </div>
            </div>

            {/* Right Side: Interactive Auth Portal Form */}
            <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between bg-white h-100 overflow-y-auto">
              <div>
                {/* Top Role Switcher Pills Bar (Tourist & Services) */}
                <div
                  className="d-flex gap-1.5 p-1.5 rounded-3 mb-4 border border-secondary border-opacity-25"
                  style={{ backgroundColor: "#f3f4f6" }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: "tourist",
                        userType: "Tourist",
                      })
                    }
                    className={`btn btn-sm rounded-2 flex-fill py-2.5 px-3 d-inline-flex align-items-center justify-content-center font-semibold transition-all ${
                      !isServiceRole
                        ? "btn-primary text-white fw-bold shadow-sm"
                        : "text-dark border-0 opacity-75 hover-opacity-100"
                    }`}
                    style={{
                      fontSize: "0.85rem",
                      backgroundColor: !isServiceRole
                        ? "#2563eb"
                        : "transparent",
                      borderColor: "transparent",
                      height: "40px",
                    }}
                  >
                    <User size={16} className="me-2" /> Tourist
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        role: "service",
                        userType: formData.serviceCategory || "Home Stays",
                      })
                    }
                    className={`btn btn-sm rounded-2 flex-fill py-2.5 px-3 d-inline-flex align-items-center justify-content-center font-semibold transition-all ${
                      isServiceRole
                        ? "btn-primary text-white fw-bold shadow-sm"
                        : "text-dark border-0 opacity-75 hover-opacity-100"
                    }`}
                    style={{
                      fontSize: "0.85rem",
                      backgroundColor: isServiceRole
                        ? "#2563eb"
                        : "transparent",
                      borderColor: "transparent",
                      height: "40px",
                    }}
                  >
                    <Building size={16} className="me-2" /> Services
                  </button>
                </div>

                {/* Header Title */}
                <div className="mb-3">
                  <h4
                    className="fw-bold text-dark mb-1"
                    style={{ fontSize: "1.45rem", letterSpacing: "-0.3px" }}
                  >
                    {isSignup ? "Create Account" : "Welcome Back!"}
                  </h4>
                </div>

                {/* Login / Sign Up Tabs */}
                <div className="d-flex gap-4 border-bottom border-secondary border-opacity-25 mb-4 position-relative">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0 pb-2.5 font-bold transition-all position-relative"
                    style={{
                      fontSize: "1rem",
                      color: !isSignup ? "#2563eb" : "#6b7280",
                      fontWeight: !isSignup ? 700 : 500,
                    }}
                    onClick={() => {
                      setIsSignup(false);
                      setError("");
                    }}
                  >
                    Login
                    {!isSignup && (
                      <span
                        className="position-absolute bottom-0 start-0 w-100 rounded-pill"
                        style={{ height: "3px", backgroundColor: "#2563eb" }}
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0 pb-2.5 font-bold transition-all position-relative"
                    style={{
                      fontSize: "1rem",
                      color: isSignup ? "#2563eb" : "#6b7280",
                      fontWeight: isSignup ? 700 : 500,
                    }}
                    onClick={() => {
                      setIsSignup(true);
                      setError("");
                    }}
                  >
                    Sign Up
                    {isSignup && (
                      <span
                        className="position-absolute bottom-0 start-0 w-100 rounded-pill"
                        style={{ height: "3px", backgroundColor: "#2563eb" }}
                      />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger py-2.5 px-3 small d-flex align-items-center gap-2 mb-3 rounded-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Form Controls */}
                <form onSubmit={handleSubmit}>
                  {/* SIGN UP FORM FIELDS */}
                  {isSignup && (
                    <>
                      {/* SERVICE CATEGORY SELECTION (ONLY FOR SERVICES ROLE) */}
                      {isServiceRole && (
                        <div className="mb-3">
                          <label
                            className="form-label text-dark small fw-semibold mb-1.5"
                            style={{ fontSize: "0.88rem" }}
                          >
                            Select Your Services Type
                          </label>
                          <select
                            className="form-select bg-light h-100 fw-medium rounded-3 px-3 text-dark"
                            value={formData.serviceCategory}
                            onChange={(e) => {
                              const cat = e.target.value;
                              setFormData({
                                ...formData,
                                serviceCategory: cat,
                                userType: cat,
                              });
                            }}
                            style={{
                              fontSize: "0.9rem",
                              height: "48px",
                              color: "#111827",
                            }}
                            required
                          >
                            <option value="Home Stays">Home Stays</option>
                            <option value="Hotels">Hotels</option>
                            <option value="Tourist Guide">Tourist Guide</option>
                            <option value="Artists">Artists</option>
                            <option value="Local Cabs">Local Cabs</option>
                          </select>
                        </div>
                      )}

                      {/* NAME FIELD */}
                      <div className="mb-3">
                        <label
                          className="form-label text-dark small fw-semibold mb-1.5"
                          style={{ fontSize: "0.88rem" }}
                        >
                          {isServiceRole
                            ? "Provider / Business Name"
                            : "Tourist Name"}
                        </label>
                        <div className="input-group" style={{ height: "48px" }}>
                          <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                            <User size={18} />
                          </span>
                          <input
                            type="text"
                            className="form-control bg-light border-start-0 text-dark h-100"
                            placeholder={
                              isServiceRole
                                ? "Enter provider or business name"
                                : "Enter your full name"
                            }
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      {/* PHONE NUMBER FIELD */}
                      <div className="mb-3">
                        <label
                          className="form-label text-dark small fw-semibold mb-1.5"
                          style={{ fontSize: "0.88rem" }}
                        >
                          Phone Number
                        </label>
                        <div className="input-group" style={{ height: "48px" }}>
                          <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                            <Phone size={18} />
                          </span>
                          <input
                            type="tel"
                            className="form-control bg-light border-start-0 text-dark h-100"
                            placeholder="Enter 10-digit mobile number"
                            required
                            value={formData.contactPhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactPhone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* DOCUMENT UPLOAD OPTION FOR SERVICES ONLY */}
                      {isServiceRole && (
                        <div className="mb-3">
                          <label
                            className="form-label text-dark small fw-semibold mb-1.5"
                            style={{ fontSize: "0.88rem" }}
                          >
                            Upload Document
                          </label>

                          <div className="border border-dashed border-2 rounded-3 p-3 bg-light text-center position-relative">
                            {selectedDoc.base64 || formData.documentUrl ? (
                              <div className="d-flex align-items-center justify-content-between gap-3 bg-white p-2.5 rounded-3 border">
                                <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                                  <img
                                    src={selectedDoc.base64 || formData.documentUrl}
                                    alt="Selected Verification Document"
                                    className="rounded-2 object-fit-cover shadow-sm"
                                    style={{ width: "46px", height: "46px" }}
                                  />
                                  <div className="text-start">
                                    <div className="small fw-bold text-dark d-flex align-items-center gap-1">
                                      <CheckCircle2
                                        size={14}
                                        className="text-success"
                                      />{" "}
                                      Document Selected
                                    </div>
                                    <div
                                      className="text-muted text-truncate"
                                      style={{
                                        fontSize: "0.78rem",
                                        maxWidth: "200px",
                                      }}
                                    >
                                      {selectedDoc.fileName || "Uploaded Document"}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedDoc({
                                      file: null,
                                      base64: "",
                                      fileName: "",
                                    });
                                    setFormData((prev) => ({
                                      ...prev,
                                      documentUrl: "",
                                    }));
                                  }}
                                  className="btn btn-sm btn-outline-danger px-2.5 py-1"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type="file"
                                  id="docPicInput"
                                  accept="image/*"
                                  className="d-none"
                                  onChange={handleFileSelect}
                                />
                                <label
                                  htmlFor="docPicInput"
                                  className="btn btn-outline-primary btn-sm rounded-3 px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 cursor-pointer mb-1"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <Upload size={16} />
                                  Upload Document Pic
                                </label>
                                <div
                                  className="text-secondary small mt-1"
                                  style={{ fontSize: "0.78rem" }}
                                >
                                  Upload ID Card, License, or Property Proof
                                  (PNG, JPG)
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* EMAIL ADDRESS FIELD */}
                  <div className="mb-3">
                    <label
                      className="form-label text-dark small fw-semibold mb-1.5"
                      style={{ fontSize: "0.88rem" }}
                    >
                      Email Address
                    </label>
                    <div className="input-group" style={{ height: "48px" }}>
                      <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control bg-light border-start-0 text-dark h-100"
                        placeholder="Enter your email address"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* PASSWORD FIELD */}
                  <div className="mb-3">
                    <label
                      className="form-label text-dark small fw-semibold mb-1.5"
                      style={{ fontSize: "0.88rem" }}
                    >
                      Password
                    </label>
                    <div className="input-group" style={{ height: "48px" }}>
                      <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control bg-light border-start-0 text-dark h-100"
                        placeholder="Enter your password"
                        required
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD FIELD (ONLY ON SIGNUP) */}
                  {isSignup && (
                    <div className="mb-3">
                      <label
                        className="form-label text-dark small fw-semibold mb-1.5"
                        style={{ fontSize: "0.88rem" }}
                      >
                        Confirm Password
                      </label>
                      <div className="input-group" style={{ height: "48px" }}>
                        <span className="input-group-text bg-light text-secondary border-end-0 px-3">
                          <Lock size={18} />
                        </span>
                        <input
                          type="password"
                          className="form-control bg-light border-start-0 text-dark h-100"
                          placeholder="Re-enter your password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {!isSignup && (
                    <div className="text-end mb-3.5 pt-1">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none small p-0 fw-semibold"
                        style={{ color: "#2563eb", fontSize: "0.85rem" }}
                        onClick={() =>
                          toast(
                            "Password reset link has been sent to your email.",
                          )
                        }
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-100 btn text-white fw-bold rounded-3 shadow-md mt-2 mb-3 d-flex align-items-center justify-content-center transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      border: "none",
                      fontSize: "1.05rem",
                      height: "52px",
                      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.35)",
                      letterSpacing: "0.3px",
                    }}
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : isSignup
                        ? "Create Account"
                        : "Login"}
                  </button>

                  {/* Social Logins Divider */}
                  <div className="d-flex align-items-center my-3.5">
                    <div className="flex-grow-1 border-bottom border-secondary border-opacity-25" />
                    <span
                      className="px-3 text-secondary small fw-medium"
                      style={{ fontSize: "0.82rem" }}
                    >
                      Or Login With
                    </span>
                    <div className="flex-grow-1 border-bottom border-secondary border-opacity-25" />
                  </div>

                  {/* Google & Magic Link Buttons */}
                  <div className="row g-2.5">
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Google")}
                        className="btn btn-outline-secondary w-100 rounded-3 small d-inline-flex align-items-center justify-content-center gap-2 text-dark bg-white border border-secondary border-opacity-25 fw-semibold"
                        style={{ fontSize: "0.86rem", height: "46px" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>Google</span>
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin("Magic Link")}
                        className="btn btn-outline-secondary w-100 rounded-3 small d-inline-flex align-items-center justify-content-center gap-2 text-dark bg-white border border-secondary border-opacity-25 fw-semibold"
                        style={{ fontSize: "0.86rem", height: "46px" }}
                      >
                        <Mail size={18} className="text-secondary" />
                        <span>Magic Link</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
