import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

import { Navbar } from "./components/Navbar";
import { SiteAlertTicker } from "./components/SiteAlertTicker";
import { Footer } from "./components/Footer";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { AuthModal } from "./components/AuthModal";
import { UnderDevelopmentModal } from "./components/UnderDevelopmentModal";

import { Home } from "./pages/Home";
import { Temples } from "./pages/Temples";
import { TempleDetail } from "./pages/TempleDetail";
import { Model360 } from "./pages/Model360";
import { ModelView } from "./pages/ModelView";
import { CulturalEvents } from "./pages/CulturalEvents";
import { LocalEvents } from "./pages/LocalEvents";
import { Hotels } from "./pages/Hotels";
import { HotelDetails } from "./pages/HotelDetails";
import { ServiceDetails } from "./pages/ServiceDetails";
import { PaymentPage } from "./pages/PaymentPage";
import { AIPlanner } from "./pages/AIPlanner";
import { UserProfile } from "./pages/UserProfile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { HotelPartnerDashboard } from "./pages/HotelPartnerDashboard";
import { Announcements } from "./pages/Announcements";
import { TempleMap } from "./pages/TempleMap";
import { Support } from "./pages/Support";
import { Places } from "./pages/Places";
import { PlaceDetail } from "./pages/PlaceDetail";

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPaymentPage = location.pathname === "/payment";
  const isModelView = location.pathname.startsWith("/model-view");
  const hideLayout = isPaymentPage || isModelView;

  // Automatically scroll to top of page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [temples, setTemples] = useState([]);
  const [events, setEvents] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("mahakal_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/api/auth/session")
        .then((res) => {
          if (res.data.user) setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("mahakal_token");
          delete axios.defaults.headers.common["Authorization"];
        });
    }

    async function loadData() {
      try {
        const res = await axios.get("/api/temples");
        setTemples(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/hotels");
        setHotels(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/itineraries");
        setItineraries(res.data);
      } catch (e) {}
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("mahakal_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out successfully. Have a blessed day!");
    navigate("/");
  };

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#121212",
            color: "#ffffff",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "12px",
            fontSize: "0.88rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          },
          success: {
            iconTheme: {
              primary: "#f59e0b",
              secondary: "#000000",
            },
          },
        }}
      />
      <div className="d-flex flex-column min-vh-100 bg-light text-dark">
        {!hideLayout && (
          <Navbar
            onOpenAuth={handleOpenAuth}
            user={user}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  temples={temples}
                  events={events}
                  itineraries={itineraries}
                />
              }
            />
            <Route path="/temples" element={<Temples temples={temples} />} />
            <Route path="/model-360" element={<Model360 />} />
            <Route path="/model-view/:slug" element={<ModelView />} />
            <Route path="/temple/:id" element={<TempleDetail />} />
            <Route path="/places" element={<Places />} />
            <Route path="/place/:id" element={<PlaceDetail />} />

            {/* Sacred Aartis -> /aarties */}
            <Route
              path="/aarties"
              element={
                <CulturalEvents
                  events={events}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              }
            />

            <Route
              path="/events"
              element={<LocalEvents user={user} onOpenAuth={handleOpenAuth} />}
            />
            <Route
              path="/service/:id"
              element={<ServiceDetails user={user} onOpenAuth={handleOpenAuth} />}
            />
            <Route path="/map" element={<TempleMap />} />
            <Route
              path="/navigation"
              element={<Navigate to="/places" replace />}
            />
            <Route path="/temple-view" element={<Places />} />
            <Route
              path="/support"
              element={<Support user={user} onOpenAuth={handleOpenAuth} />}
            />

            <Route
              path="/hotels"
              element={
                <Hotels
                  hotels={hotels}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              }
            />
            <Route
              path="/hotel/:id"
              element={
                <HotelDetails user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/payment"
              element={
                <PaymentPage user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route path="/planner" element={<AIPlanner user={user} />} />
            <Route
              path="/profile"
              element={
                <UserProfile
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  onUpdateUser={(u) => setUser(u)}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <AdminDashboard user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/announcements"
              element={
                <Announcements user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/hotel-dashboard"
              element={
                <HotelPartnerDashboard
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  onUpdateUser={(u) => setUser(u)}
                />
              }
            />
          </Routes>
        </main>

        {!hideLayout && <Footer />}
        <ChatbotWidget />

        <AuthModal
          show={showAuthModal}
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => setUser(u)}
        />
        <UnderDevelopmentModal />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
