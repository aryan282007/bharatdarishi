import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  Building,
  Compass,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Clock,
  Megaphone,
  Save,
  Eye,
  CheckCircle2,
  MapPin,
  HelpCircle,
  AlertTriangle,
  Lock,
  Ticket,
  Calendar,
  Crown,
  Bed,
  Filter,
  BarChart3,
  TrendingUp,
  Building2,
  DollarSign,
  Sparkles,
  CreditCard,
  ShieldCheck,
  FileText,
  Settings,
  PieChart,
  UserCog,
  Zap
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  getAartiStats,
  getVipStats,
  getRoomStats,
} from "../utils/bookingStats";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/custom.module.css";
import { AdminPartners } from "./Admin/AdminPartners";
import { AdminActions } from "./Admin/AdminActions";
import { AdminDestinations } from "./Admin/AdminDestinations";
import { AdminBookings } from "./Admin/AdminBookings";
import { AdminCircuits } from "./Admin/AdminCircuits";
import { AdminReviews } from "./Admin/AdminReviews";
import AdminOverview from "./Admin/AdminOverview";
import AdminPayments from "./Admin/AdminPayments";
import AdminAnalytics from "./Admin/AdminAnalytics";
import AdminUsers from "./Admin/AdminUsers";
import AdminReports from "./Admin/AdminReports";
import AdminSettings from "./Admin/AdminSettings";
import { AdminGapDetection } from "./Admin/AdminGapDetection";
import { GapDetail } from "./Admin/GapDetail";
import { AdminImpactScore } from "./Admin/AdminImpactScore";
import { ImpactDetail } from "./Admin/ImpactDetail";
import { AdminIntelligenceMap } from "./Admin/AdminIntelligenceMap";
import AdminEvents from "./Admin/AdminEvents";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Admin Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 d-flex flex-column align-items-center justify-content-center text-center">
          <AlertTriangle size={64} className="text-danger mb-3" />
          <h4 className="text-navy fw-bold">Admin Component Error</h4>
          <p className="text-slate">A component crashed while rendering. Check the console for details.</p>
          <button className="btn btn-primary" onClick={() => this.setState({ hasError: false })}>Reload Component</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const DAILY_VIP_ANALYTICS = {
  "2026-08-12": {
    dayLabel: "Today (Wed, 12 Aug 2026)",
    totalPasses: 342,
    totalRevenue: 184500,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 185,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 94,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 48,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 15,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-13": {
    dayLabel: "Tomorrow (Thu, 13 Aug 2026)",
    totalPasses: 410,
    totalRevenue: 226000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 220,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 110,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 62,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 18,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-14": {
    dayLabel: "Fri, 14 Aug 2026 (Eve of Holiday)",
    totalPasses: 580,
    totalRevenue: 345000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 310,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 160,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 85,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 25,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-15": {
    dayLabel: "Sat, 15 Aug 2026 (Festive Peak Surge)",
    totalPasses: 750,
    totalRevenue: 492500,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 400,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 210,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 105,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 35,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-16": {
    dayLabel: "Sun, 16 Aug 2026",
    totalPasses: 620,
    totalRevenue: 388000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 340,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 175,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 83,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 22,
        gate: "VVIP Lounge",
      },
    ],
  },
};

const AARTI_PASS_ANALYTICS = [
  {
    id: "bhasma",
    name: "Shri Mahakal Bhasma Aarti",
    time: "04:00 AM - 06:00 AM",
    capacity: 1500,
    sold: 1358,
    left: 142,
    status: "High Surge",
  },
  {
    id: "dadhodak",
    name: "Dadhodak Aarti (Naivedya Aarti)",
    time: "07:30 AM - 08:15 AM",
    capacity: 2500,
    sold: 2020,
    left: 480,
    status: "Seats Available",
  },
  {
    id: "bhog",
    name: "Shri Mahakal Bhog Aarti",
    time: "10:30 AM - 11:30 AM",
    capacity: 3000,
    sold: 2080,
    left: 920,
    status: "Seats Available",
  },
  {
    id: "sandhya",
    name: "Sandhya Aarti",
    time: "05:00 PM - 06:00 PM",
    capacity: 2000,
    sold: 1690,
    left: 310,
    status: "Filling Fast",
  },
  {
    id: "shringar",
    name: "Sandhya Shringar Aarti",
    time: "07:00 PM - 08:00 PM",
    capacity: 2000,
    sold: 1470,
    left: 530,
    status: "Seats Available",
  },
  {
    id: "shayan",
    name: "Shri Mahakal Shayan Aarti",
    time: "10:30 PM - 11:00 PM",
    capacity: 1500,
    sold: 1285,
    left: 215,
    status: "Filling Fast",
  },
];

const ROOM_OCCUPANCY_ANALYTICS = [
  {
    property: "Pt. Surya Narayan Vyas Atithi Niwas",
    type: "Official Temple Trust Stay (Sanctum Complex)",
    totalRooms: 50,
    filledRooms: 42,
    leftRooms: 8,
    occupancyPct: 84,
  },
  {
    property: "Shri Mahakaleshwar Atithi Niwas",
    type: "Temple Trust Annex Stay (Nandi Hall Marg)",
    totalRooms: 70,
    filledRooms: 55,
    leftRooms: 15,
    occupancyPct: 78.5,
  },
  {
    property: "Shipra Residency (MP Tourism Resort)",
    type: "State Tourism Partner Stay",
    totalRooms: 35,
    filledRooms: 28,
    leftRooms: 7,
    occupancyPct: 80,
  },
  {
    property: "Hotel Mahakal Palace",
    type: "Deluxe Partner Hotel",
    totalRooms: 25,
    filledRooms: 17,
    leftRooms: 8,
    occupancyPct: 68,
  },
];

export function AdminDashboard({ user, onOpenAuth }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    pendingHotels: 0,
    totalTemples: 0,
  });
  const [usersList, setUsersList] = useState([]);
    const [supportTickets, setSupportTickets] = useState([]);
  const [selectedDate, setSelectedDate] = useState("today");

  const [inventoryRange, setInventoryRange] = useState("today");
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const dateInputRef = useRef(null);

  const handleCalendarIconClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const fetchInventoryAnalytics = async (range = inventoryRange) => {
    try {
      const res = await axios.get(
        `/api/passes/inventory-analytics?range=${range}`,
      );
      if (res.data) {
        setInventoryData(res.data);
      }
    } catch (err) {
      console.error("Error fetching inventory analytics:", err);
    }
  };

  const handleInventoryRangeChange = async (newRange) => {
    setInventoryRange(newRange);
    await fetchInventoryAnalytics(newRange);
  };

  const handleDateSelect = async (customDateStr) => {
    setSelectedCalendarDate(customDateStr);
    setInventoryRange("custom");
    try {
      const res = await axios.get(
        `/api/passes/inventory-analytics?date=${customDateStr}`,
      );
      if (res.data) setInventoryData(res.data);
    } catch (e) {
      console.error("Failed to load inventory for date", customDateStr, e);
    }
  };

  // Generate date options for the past 30 days
  const past30DaysOptions = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoStr = d.toISOString().substring(0, 10);
      const label =
        i === 0
          ? "Today (Resets Daily)"
          : i === 1
            ? "Yesterday"
            : d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
      days.push({ dateStr: isoStr, label });
    }
    return days;
  }, []);

  const [aartiAnalytics, setAartiAnalytics] = useState(getAartiStats());
  const [vipAnalytics, setVipAnalytics] = useState(getVipStats());
  const [roomAnalytics, setRoomAnalytics] = useState(getRoomStats());

  useEffect(() => {
    const handleUpdate = () => {
      setAartiAnalytics(getAartiStats());
      setVipAnalytics(getVipStats());
      setRoomAnalytics(getRoomStats());
    };
    handleUpdate();
    window.addEventListener("mahakal_stats_updated", handleUpdate);
    return () =>
      window.removeEventListener("mahakal_stats_updated", handleUpdate);
  }, []);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [viewType, setViewType] = useState("gap");

  const [adminNotices, setAdminNotices] = useState([]);
  const [postingNotice, setPostingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "Gate Status",
    status: "Open",
    gateName: "",
    location: "Shri Mahakaleshwar Temple Premises",
    reason: "",
    description: "",
    priority: "Normal",
  });

    
  const [passAnalytics, setPassAnalytics] = useState(null);

  const [loadingChronos, setLoadingChronos] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setLoadingChronos(true);
    const token = localStorage.getItem("mahakal_token") || localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [
        statsRes,
        usersRes,
        noticesRes,
        ticketsRes,
        passAnalyticsRes,
        crowdRes,
        inventoryRes,
      ] = await Promise.all([
        axios.get("/api/admin/analytics", config),
        axios.get("/api/admin/users", config),
        axios.get("/api/announcements", config).catch(() => ({ data: [] })),
        axios.get("/api/support/admin", config).catch(() => ({ data: [] })),
        axios.get("/api/passes/analytics", config).catch(() => ({ data: null })),
        axios
          .get("/api/admin/crowd/forecast-public?refresh=true", config)
          .catch(() => ({ data: null })),
        axios
          .get(`/api/passes/inventory-analytics?date=${selectedCalendarDate}`, config)
          .catch(() => ({ data: null })),
      ]);
      setStats(statsRes.data);
      const cleanUsers = (usersRes.data || []).map((u) => ({
        ...u,
        name: u.name ? u.name.replace(/Sancthan/g, "Mahakal") : u.name,
      }));
      setUsersList(cleanUsers);
            setAdminNotices(Array.isArray(noticesRes.data) ? noticesRes.data : []);
      setSupportTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
      if (passAnalyticsRes && passAnalyticsRes.data)
        setPassAnalytics(passAnalyticsRes.data);

      if (inventoryRes && inventoryRes.data)
        setInventoryData(inventoryRes.data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Access Denied. Administrator credentials required.",
      );
    } finally {
      setLoading(false);
      setLoadingChronos(false);
    }
  };

  useEffect(() => {
    fetchInventoryAnalytics("today");
    if (user && (user.role === "official" || user.role === "admin"))
      fetchAdminData();
  }, [user]);

  const handleToggleApproval = async (userId) => {
    try {
      const res = await axios.patch(`/api/admin/users/${userId}/approve`);
      toast.success(res.data.message);
      fetchAdminData();
    } catch {
      toast.error("Failed to update approval status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("Account deleted.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  

  

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await axios.patch(`/api/support/admin/${ticketId}/status`, {
        status: newStatus,
      });
      toast.success(`Ticket status updated to ${newStatus}`);
      setSupportTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update ticket status.",
      );
    }
  };

  const handlePostGateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      toast.error("Title and description are required.");
      return;
    }
    setPostingNotice(true);
    try {
      await axios.post("/api/announcements", newNotice);
      toast.success("Notice published to devotees!");
      setNewNotice({
        title: "",
        category: "Gate Status",
        status: "Open",
        gateName: "",
        location: "Shri Mahakaleshwar Temple Premises",
        reason: "",
        description: "",
        priority: "Normal",
      });
      fetchAdminData();
    } catch {
      toast.error("Failed to publish notice.");
    } finally {
      setPostingNotice(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success("Notice deleted.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete notice.");
    }
  };

  const isAdmin =
    user &&
    (user.role === "official" ||
      user.role === "admin" ||
      (user.email && user.email.toLowerCase().includes("admin")));

  if (!isAdmin) {
    return (
      <div className="py-5 bg-black min-vh-100 text-white d-flex align-items-center justify-content-center pt-5">
        <div
          className="text-center p-5 bg-dark rounded-4 border border-warning border-opacity-30 shadow-2xl"
          style={{ maxWidth: 480 }}
        >
          <div
            className="rounded-circle bg-warning text-dark mx-auto d-flex align-items-center justify-content-center mb-4"
            style={{ width: 72, height: 72 }}
          >
            <ShieldCheck size={36} />
          </div>
          <h3 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>
            Administrator Access Required
          </h3>
          <p className="text-secondary small mb-4">
            This panel is restricted to Mahakal Administration officials.
          </p>
          <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-30 text-start small mb-4">
            <p className="text-warning fw-bold mb-1 small">
              Administrator Credentials:
            </p>
            <p className="text-light mb-0 small">
              Email: <strong>admin@mahakal.com</strong>
            </p>
            <p className="text-light mb-0 small">
              Password: <strong>admin123</strong>
            </p>
          </div>
          <button
            onClick={() => onOpenAuth && onOpenAuth("login")}
            className={`${styles.goldBtn} w-100`}
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const match =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);
    if (roleFilter === "pending")
      return match && u.role === "hotel" && !u.isApproved;
    if (roleFilter === "hotel") return match && u.role === "hotel";
    if (roleFilter === "devotee") return match && u.role === "devotee";
    return match;
  });

  return (
    <div className="admin-dashboard-container bg-light min-vh-100 d-flex flex-column" style={{ backgroundColor: '#faf9f6 !important' }}>
      
      {/* Top Header - Kept standard navbar from App.jsx but we inject a local style to ensure the page background is light */}
      <style>{`
        body { background-color: #faf9f6 !important; color: #1e293b !important; }
        .admin-sidebar { background-color: #ffffff; border-right: 1px solid #e2e8f0; width: 260px; min-height: calc(100vh - 80px); position: sticky; top: 80px; height: calc(100vh - 80px); overflow-y: auto; }
        .admin-content { flex: 1; padding: 2rem; }
        .admin-nav-item { padding: 10px 16px; margin-bottom: 4px; border-radius: 8px; color: #475569; display: flex; align-items: center; gap: 12px; font-weight: 500; font-size: 0.9rem; transition: all 0.2s; cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; }
        .admin-nav-item:hover { background-color: #f8fafc; color: #0f172a; }
        .admin-nav-item.active { background-color: #fef3c7; color: #0f172a; font-weight: 600; }
        .admin-nav-item.active svg { color: #d97706; }
        .admin-sidebar-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 700; margin: 1.5rem 0 0.75rem 1rem; }
        
        .admin-card { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .admin-card-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; background: #ffffff; border-radius: 12px 12px 0 0; }
        .admin-card-body { padding: 1.25rem; }
        
        /* Typography */
        .text-navy { color: #0f172a !important; }
        .text-slate { color: #64748b !important; }
        .bg-ivory { background-color: #faf9f6 !important; }
      `}</style>

      <div style={{ paddingTop: '80px' }} className="d-flex flex-grow-1 bg-ivory">
        {/* LEFT SIDEBAR */}
        <div className="admin-sidebar d-none d-lg-block p-3">
          <div className="mb-4 px-2">
            <h5 className="text-navy fw-bold mb-0">Platform Admin</h5>
            <small className="text-slate">Manage BharatDarshi Ops</small>
          </div>

          <div className="admin-sidebar-title">Core Operations</div>
          
          <button onClick={() => setActiveTab('dashboard')} className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <BarChart3 size={18} /> Dashboard
          </button>
          
          <button onClick={() => setActiveTab('destinations')} className={`admin-nav-item ${activeTab === 'destinations' ? 'active' : ''}`}>
            <Compass size={18} /> Destinations
          </button>
          
          <button onClick={() => setActiveTab('map')} className={`admin-nav-item ${activeTab === 'map' ? 'active' : ''}`}>
            <MapPin size={18} /> Tourism Map
          </button>
          
          <button onClick={() => setActiveTab('analytics')} className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}>
            <TrendingUp size={18} /> Analytics
          </button>

          <div className="admin-sidebar-title">Management</div>
          
          <button onClick={() => setActiveTab('partners')} className={`admin-nav-item ${activeTab === 'partners' ? 'active' : ''}`}>
            <ShieldCheck size={18} /> Partner Verification
          </button>
          
          <button onClick={() => setActiveTab('bookings')} className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}>
            <Ticket size={18} /> Bookings
          </button>
          
          <button onClick={() => setActiveTab('payments')} className={`admin-nav-item ${activeTab === 'payments' ? 'active' : ''}`}>
            <CreditCard size={18} /> Payments
          </button>
          
          <div className="admin-sidebar-title">Intelligence</div>

          <button onClick={() => setActiveTab('actions')} className={`admin-nav-item ${activeTab === 'actions' ? 'active' : ''}`}>
            <AlertTriangle size={18} /> Safety & Alerts
          </button>

          <button onClick={() => setActiveTab('gap')} className={`admin-nav-item ${activeTab === 'gap' ? 'active' : ''}`}>
            <Building2 size={18} /> Infrastructure
          </button>

          <button onClick={() => setActiveTab('impact')} className={`admin-nav-item ${activeTab === 'impact' ? 'active' : ''}`}>
            <Zap size={18} /> AI Insights
          </button>

          <div className="admin-sidebar-title">System</div>

          <button onClick={() => setActiveTab('reports')} className={`admin-nav-item ${activeTab === 'reports' ? 'active' : ''}`}>
            <FileText size={18} /> Reports
          </button>

          <button onClick={() => setActiveTab('users')} className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}>
            <Users size={18} /> Users & Roles
          </button>

          <button onClick={() => setActiveTab('settings')} className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={18} /> Settings
          </button>

          <div className="mt-5 pt-4 border-top px-3 text-center opacity-75">
            <img src="/landingpage_audiotape.mpeg" alt="" style={{display:'none'}}/> {/* Just a filler, ignoring the bizarre file name from previous git diff */}
            <h6 className="text-navy fw-bold mb-1" style={{fontFamily: 'serif'}}>Incredible India</h6>
            <p className="small text-slate mb-0" style={{fontSize: '0.7rem'}}>Smarter Tourism,<br/>Stronger Bharat.</p>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="admin-content w-100">
          
          {/* Mobile top navigation helper */}
          <div className="d-lg-none mb-3 d-flex align-items-center justify-content-between">
            <h5 className="text-navy fw-bold mb-0">Platform Admin</h5>
            <select 
              className="form-select form-select-sm w-auto shadow-sm border-0" 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="dashboard">Dashboard</option>
              <option value="destinations">Destinations</option>
              <option value="map">Tourism Map</option>
              <option value="analytics">Analytics</option>
              <option value="partners">Partner Verification</option>
              <option value="bookings">Bookings</option>
              <option value="payments">Payments</option>
              <option value="actions">Safety & Alerts</option>
              <option value="gap">Infrastructure</option>
              <option value="impact">AI Insights</option>
              <option value="reports">Reports</option>
              <option value="users">Users & Roles</option>
              <option value="settings">Settings</option>
            </select>
          </div>

          <div className="admin-tab-content">
            <ErrorBoundary>
              {activeTab === "gap" && (selectedDestinationId && viewType === 'gap' ? <GapDetail destinationId={selectedDestinationId} onBack={() => setSelectedDestinationId(null)} /> : <AdminGapDetection onSelectDestination={(id, type) => { setSelectedDestinationId(id); setViewType(type); }} />)}
              {activeTab === "impact" && (selectedDestinationId && viewType === 'impact' ? <ImpactDetail destinationId={selectedDestinationId} onBack={() => setSelectedDestinationId(null)} /> : <AdminImpactScore onSelectDestination={(id, type) => { setSelectedDestinationId(id); setViewType(type); }} />)}
              {activeTab === "map" && <AdminIntelligenceMap onSelectDestination={(id, type) => { setSelectedDestinationId(id); setViewType(type); setActiveTab(type); }} />}
              {activeTab === "partners" && <AdminPartners user={user} />}
              {activeTab === "actions" && <AdminActions />}
              {activeTab === "destinations" && <AdminDestinations />}
              {activeTab === "bookings" && <AdminBookings />}
              {activeTab === "circuits" && <AdminCircuits />}
              {activeTab === "reviews" && <AdminReviews />}
              {activeTab === "dashboard" && <AdminOverview setActiveTab={setActiveTab} onSelectDestination={(id, type) => { setSelectedDestinationId(id); setViewType(type); setActiveTab(type); }} />}
              {activeTab === "payments" && <AdminPayments />}
              {activeTab === "analytics" && <AdminAnalytics />}
              {activeTab === "events" && <AdminEvents />}
              {activeTab === "users" && <AdminUsers />}
              {activeTab === "reports" && <AdminReports />}
              {activeTab === "settings" && <AdminSettings user={user} />}
            </ErrorBoundary>
          </div>

        </div>
      </div>
    </div>
  );
}
