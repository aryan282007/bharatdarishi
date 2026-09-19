import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Heart } from "lucide-react";

export function UnderDevelopmentModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenUnderDevModal");
    if (!hasSeenModal) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("hasSeenUnderDevModal", "true");
  };

  if (!show) return null;

  return createPortal(
    <>
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{ 
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          zIndex: 999999
        }}
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-4 shadow-lg overflow-hidden position-relative d-flex flex-column"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            width: "90vw", 
            maxWidth: "400px", 
            animation: "modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}
        >
          {/* Top Image Area */}
          <div className="position-relative" style={{ height: "200px" }}>
            <img 
              src="/images/Bhutanes_temple.webp" 
              alt="Temple" 
              className="w-100 h-100 object-fit-cover"
            />
          </div>

          {/* Content Area */}
          <div className="p-4 text-center">
            <h4 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
              We Are Under Development
            </h4>
            <p className="text-secondary mb-4 small lh-base px-2">
              Thank you for exploring Bharat Darshi! Please note that this website project is currently under active development and is about 40-50% complete. More features will be launching shortly.
            </p>
            <button 
              className="btn rounded-pill px-5 py-2 fw-bold mb-2 shadow-sm text-dark"
              style={{ backgroundColor: "#ffc107", border: "none" }}
              onClick={handleClose}
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </>,
    document.body
  );
}
