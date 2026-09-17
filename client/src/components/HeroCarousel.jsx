import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import heroStyles from "../styles/hero.module.css";
import styles from "../styles/custom.module.css";

const temples = [
  {
    id: 1,
    name: "Dubdi Monastery",
    location: "Yuksom",
    subtitle: "STEP INTO THE ALLURE OF INDIA",
    title: "Incredible Wonders",
    description:
      "Explore over india through immersive 360° virtual experiences.",
    video: "/videos/monastery-1.mp4",
    tag: "Dubdi Monastery",
  },
  {
    id: 2,
    name: "Tawang Monastery",
    location: "Tawang, Arunachal Pradesh",
    subtitle: "MEDITATIVE HAVEN & SACRED SILENCE",
    title: "Tawang Monastic Retreat",
    description:
      "Immerse yourself in peaceful monastic traditions, sacred architecture, and inner reflection.",
    video: "/videos/monastery-2.mp4",
    tag: "Tawang Monastery",
  },

  {
    id: 4,
    name: "Phodong Monastery",
    location: "North Sikkim",
    subtitle: "DIVINE STILLNESS & SILENT PRAYER",
    title: "Phodong Heritage Hermitage",
    description:
      "Step into quiet sanctuaries crafted for spiritual awakening, mindfulness, and sacred tranquility.",
    video: "/videos/monastery-4.mp4",
    tag: "Phodong Monastery",
  },
  {
    id: 5,
    name: "Pemayangtse Monastery",
    location: "Pelling, Sikkim",
    subtitle: "ETERNAL SERENITY & DIVINE ENERGY",
    title: "Pemayangtse Monastic Sanctuary",
    description:
      "Explore magnificent monastic landscapes, devotional ambience, and transcendent quietude.",
    video: "/videos/monastery-5.mp4",
    tag: "Pemayangtse Monastery",
  },
];

export function HeroCarousel() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const currentTemple = temples[currentVideo];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo]);

  useEffect(() => {
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.play().catch((err) => console.log("Audio play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleVideoChange = (dir) => {
    if (typeof dir === "number") {
      setCurrentVideo(dir);
    } else if (dir === "next") {
      setCurrentVideo((prev) => (prev + 1) % temples.length);
    } else {
      setCurrentVideo((prev) => (prev - 1 + temples.length) % temples.length);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="hero-carousel-container position-relative w-100 overflow-hidden bg-black text-white"
      style={{ height: "100vh", minHeight: "100vh" }}
    >
      {/* Background Audio */}
      <audio ref={audioRef} src="/landingpage_audiotape.mpeg" loop preload="auto" />

      {/* 100vh Fullscreen Video Background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <video
          ref={videoRef}
          key={currentTemple.video}
          className="w-100 h-100"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          src={currentTemple.video}
          autoPlay
          muted={true}
          playsInline
          onEnded={() => handleVideoChange("next")}
        />
        {/* Dark Gradient Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
            zIndex: 2,
          }}
        />
      </div>

      {/* Hero Center Content Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
        style={{ zIndex: 10 }}
      >
        <div className="text-center px-4 max-w-4xl mx-auto pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="yellow-text text-sm text-md-lg mb-2 tracking-widest text-uppercase fw-semibold"
                style={{ letterSpacing: "0.2em", color: "#facc15" }}
              >
                {currentTemple.subtitle}
              </p>
              <h1
                className={`display-1 fst-italic mb-2 force-white-text place-card-title ${styles.playfairFont}`}
                style={{
                  fontSize: "4.5rem",
                  fontWeight: 400,
                  color: "#ffffff",
                }}
              >
                {currentTemple.title}
              </h1>
              <p
                className="lead text-light opacity-85 max-w-2xl mx-auto px-2 mb-0 force-white-text"
                style={{
                  fontWeight: 300,
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                  color: "#ffffff",
                }}
              >
                {currentTemple.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Information & Control Strip */}
      <div
        className="position-absolute bottom-0 start-0 end-0 pb-4 pb-md-5 px-4 px-md-5"
        style={{ zIndex: 20 }}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3">
            {/* Left: Temple Title & Location */}
            <div className="d-flex flex-column">
              <div
                className="h1 display-4 font-bold mb-1 yellow-text"
                style={{
                  color: "#facc15",
                  fontWeight: 800,
                }}
              >
                {currentTemple.name}
              </div>
              <div className="fs-5 font-light text-white opacity-80 d-flex align-items-center gap-2">
                <MapPin size={20} className="text-white" />
                <span>{currentTemple.location}</span>
              </div>
            </div>

            {/* Right: Glass Round Mute, Prev & Next Buttons */}
            <div className="d-flex gap-3 align-items-center">
              {/* Mute Button */}
              <button
                type="button"
                onClick={toggleMute}
                className="btn hero-carousel-control-btn text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                  width: 50,
                  height: 50,
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "#ffffff",
                }}
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? (
                  <VolumeX size={22} style={{ color: "#ffffff" }} />
                ) : (
                  <Volume2 size={22} className="text-warning" />
                )}
              </button>

              {/* Prev Button */}
              <button
                type="button"
                onClick={() => handleVideoChange("prev")}
                className="btn hero-carousel-control-btn text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                  width: 50,
                  height: 50,
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "#ffffff",
                }}
                title="Previous Slide"
              >
                <ChevronLeft size={22} style={{ color: "#ffffff" }} />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handleVideoChange("next")}
                className="btn hero-carousel-control-btn text-white rounded-circle p-3 d-flex align-items-center justify-content-center shadow-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                  backdropFilter: "blur(8px)",
                  width: 50,
                  height: 50,
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "#ffffff",
                }}
                title="Next Slide"
              >
                <ChevronRight size={22} style={{ color: "#ffffff" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
