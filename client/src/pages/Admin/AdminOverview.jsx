import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Users, Building2, MapPin, Ticket, CreditCard, 
  AlertTriangle, ShieldCheck, ArrowUpRight, ArrowDownRight, Activity, Zap,
  TrendingUp, Calendar, ChevronDown, CheckCircle2, ShieldAlert, RefreshCw, Compass
} from "lucide-react";
import toast from "react-hot-toast";

// Assuming AdminIntelligenceMap exists and we can import it
import { AdminIntelligenceMap } from "./AdminIntelligenceMap";

export default function AdminOverview({ setActiveTab, onSelectDestination }) {
  const [stats, setStats] = useState(null);
  const [intelligence, setIntelligence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [topDestMetric, setTopDestMetric] = useState('visitors');

  const [timeRange, setTimeRange] = useState('30days');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    try {
      const [res, intelRes] = await Promise.all([
        axios.get("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get("/api/tourism/gaps")
      ]);
      setStats(res.data);
      setIntelligence(intelRes.data);
      if (isManualRefresh) toast.success("Dashboard refreshed");
    } catch (err) {
      toast.error("Failed to load dashboard statistics");
      if (!stats) setStats({}); // Prevent crashing if failed
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setTimeRange('30days');
    setSelectedState('all');
    setSelectedCategory('all');
    setTopDestMetric('visitors');
    await fetchStats(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
        <div className="spinner-border text-warning" role="status" />
      </div>
    );
  }

  // Calculate Intelligence Widgets
  const avgImpact = intelligence.length ? (intelligence.reduce((sum, d) => sum + (d.scores?.impactScore || 0), 0) / intelligence.length).toFixed(1) : 0;
  
  // Filter intelligence based on selected dropdowns
  const filteredIntelligence = intelligence.filter(d => {
    if (selectedState !== 'all' && d.state !== selectedState) return false;
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    return true;
  });

  const topDestinations = [...filteredIntelligence]
    .sort((a,b) => {
      if (topDestMetric === 'visitors') return (b.metrics?.visitorsCurrentYear || 0) - (a.metrics?.visitorsCurrentYear || 0);
      if (topDestMetric === 'revenue') return (b.metrics?.revenueGenerated || 0) - (a.metrics?.revenueGenerated || 0);
      if (topDestMetric === 'growth') {
        const ag = ((a.metrics?.visitorsCurrentYear || 0) - (a.metrics?.visitorsLastYear || 0)) / (a.metrics?.visitorsLastYear || 1);
        const bg = ((b.metrics?.visitorsCurrentYear || 0) - (b.metrics?.visitorsLastYear || 0)) / (b.metrics?.visitorsLastYear || 1);
        return bg - ag;
      }
      return 0;
    })
    .slice(0, 5);

  const availableStates = [...new Set(intelligence.map(d => d.state).filter(Boolean))];
  const availableCategories = [...new Set(intelligence.map(d => d.category).filter(Boolean))];

  const formatMoney = (val) => {
    if (!val) return "0";
    if (val > 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val > 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const formatNumber = (val) => {
    if (!val) return "0";
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  return (
    <div className="pb-5">
      <style>
        {`
          .hover-scale { transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
          .hover-scale:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
          .hover-pill { transition: all 0.2s ease; }
          .hover-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important; }
          .hover-row { transition: background-color 0.15s ease; cursor: pointer; }
          .hover-row:hover { background-color: #f8fafc !important; }
          .hover-bg-light { transition: background-color 0.15s ease; }
          .hover-bg-light:hover { background-color: #f8fafc !important; color: #0d6efd !important; }
        `}
      </style>
      {/* HERO SECTION */}
      <div className="admin-card mb-4 position-relative" style={{ minHeight: '180px', backgroundColor: '#1e293b' }}>
        {/* Subtle landscape background effect */}
        <div className="position-absolute w-100 h-100" style={{
          backgroundImage: 'linear-gradient(to right, rgba(30, 41, 59, 0.95) 0%, rgba(30, 41, 59, 0.7) 40%, rgba(30, 41, 59, 0.4) 100%), url("/header-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 1,
          zIndex: 0,
          borderRadius: 'inherit'
        }}></div>
        
        <div className="admin-card-body position-relative z-1 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center h-100 p-4 p-md-5">
          <div style={{ position: 'relative', zIndex: 10 }}>
            <div className="fw-bold mb-2" style={{ color: '#fbbf24', fontSize: '2rem', margin: 0 }}>Welcome back, Admin!</div>
            <div className="mb-0" style={{ fontSize: '1.1rem', color: '#ffffff', margin: 0 }}>Here's what's happening with BharatDarshi today.</div>
          </div>
          
          <div className="d-flex flex-wrap gap-2 mt-4 mt-lg-0">
            <CustomDropdown 
              icon={<Calendar size={16} className="text-slate" />}
              label="Select Time Range"
              options={[
                { value: '30days', label: 'Last 30 Days' },
                { value: '7days', label: 'Last 7 Days' },
                { value: 'year', label: 'This Year' }
              ]}
              value={timeRange}
              onChange={setTimeRange}
              width="180px"
              displayValue={timeRange === '30days' ? 'Last 30 Days' : timeRange === '7days' ? 'Last 7 Days' : 'This Year'}
            />
            
            <CustomDropdown 
              icon={<MapPin size={16} className="text-slate" />}
              label="All States"
              options={INDIAN_STATES}
              value={selectedState}
              onChange={setSelectedState}
              width="220px"
              displayValue={selectedState === 'all' ? 'All States' : selectedState}
            />
            
            <CustomDropdown 
              icon={<Compass size={16} className="text-slate" />}
              label="All Types"
              options={availableCategories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              width="200px"
              displayValue={selectedCategory === 'all' ? 'All Types' : selectedCategory}
            />
            <button onClick={handleManualRefresh} disabled={isRefreshing} className="btn btn-white rounded-pill px-3 py-2 d-flex align-items-center gap-2 bg-white border-0 shadow-sm hover-pill" style={{ fontSize: '0.9rem' }}>
              {isRefreshing ? (
                <div className="spinner-border spinner-border-sm text-navy" role="status" />
              ) : (
                <RefreshCw size={14} className="text-navy" />
              )}
              <span className="fw-medium text-navy">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS ROW */}
      <div className="row g-3 mb-4">
        {/* Tourist Footfall */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-warning hover-scale" 
            onClick={() => setActiveTab && setActiveTab('destinations')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Tourist Footfall</span>
                <div className="bg-warning bg-opacity-10 p-1.5 rounded text-warning">
                  <Users size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{formatNumber(stats?.totalTourists || 0)}</h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-success d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 12.4%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Destinations */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-success hover-scale"
            onClick={() => setActiveTab && setActiveTab('destinations')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Active Destinations</span>
                <div className="bg-success bg-opacity-10 p-1.5 rounded text-success">
                  <MapPin size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{stats?.activeDestinations || 0}</h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-success d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 8.7%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tourism Revenue */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-info hover-scale"
            onClick={() => setActiveTab && setActiveTab('payments')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Tourism Revenue</span>
                <div className="bg-info bg-opacity-10 p-1.5 rounded text-info">
                  <CreditCard size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{formatMoney(stats?.totalRevenue || 0)}</h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-success d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 15.6%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Score */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-primary hover-scale"
            onClick={() => setActiveTab && setActiveTab('gap')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Impact Score</span>
                <div className="p-1.5 rounded bg-primary bg-opacity-10 text-primary">
                  <Zap size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{avgImpact || 0} <span className="text-slate fw-normal" style={{ fontSize: '1rem' }}>/100</span></h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-success d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 6.2%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Partners */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-success hover-scale"
            onClick={() => setActiveTab && setActiveTab('partners')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Verified Partners</span>
                <div className="p-1.5 rounded bg-success bg-opacity-10 text-success">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{stats?.verifiedPartners?.toLocaleString() || "0"}</h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-success d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 11.3%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="col-12 col-md-4 col-xl-2">
          <div 
            className="admin-card h-100 border border-danger hover-scale"
            onClick={() => setActiveTab && setActiveTab('actions')}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-slate fw-semibold" style={{ fontSize: '0.85rem' }}>Critical Alerts</span>
                <div className="bg-danger bg-opacity-10 p-1.5 rounded text-danger">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <h3 className="text-navy fw-bold mb-1">{stats?.actionCenterStats?.critical || 0}</h3>
              <div className="d-flex align-items-center gap-1 mt-2">
                <span className="text-danger d-flex align-items-center fw-bold" style={{ fontSize: '0.75rem' }}>
                  <ArrowUpRight size={12} /> 2.1%
                </span>
                <span className="text-slate" style={{ fontSize: '0.75rem' }}>vs. last 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION - MAP, DESTINATIONS, INTELLIGENCE */}
      <div className="row g-4 mb-4">
        
        {/* Tourism Intelligence Map */}
        <div className="col-12 col-xl-8">
          <AdminIntelligenceMap inline={true} onSelectDestination={onSelectDestination} />
        </div>

        {/* Right Columns */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          
          {/* Top Destinations by Demand */}
          <div className="admin-card">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h6 className="text-navy fw-bold mb-0">Top Destinations by Demand</h6>
              <MoreIcon />
            </div>
            <div className="admin-card-body p-0">
              <div className="d-flex gap-2 px-3 pt-3 pb-2 border-bottom border-light">
                <span onClick={() => setTopDestMetric('visitors')} style={{cursor:'pointer'}} className={`badge px-3 py-1.5 rounded-pill border ${topDestMetric === 'visitors' ? 'bg-warning text-dark border-warning' : 'bg-light text-slate border-light'}`}>Visitors</span>
                <span onClick={() => setTopDestMetric('revenue')} style={{cursor:'pointer'}} className={`badge px-3 py-1.5 rounded-pill border ${topDestMetric === 'revenue' ? 'bg-warning text-dark border-warning' : 'bg-light text-slate border-light'}`}>Revenue</span>
                <span onClick={() => setTopDestMetric('growth')} style={{cursor:'pointer'}} className={`badge px-3 py-1.5 rounded-pill border ${topDestMetric === 'growth' ? 'bg-warning text-dark border-warning' : 'bg-light text-slate border-light'}`}>Growth</span>
              </div>
              <div className="px-3 py-2">
                {topDestinations.map((dest, i) => {
                  const growthPercent = (((dest.metrics?.visitorsCurrentYear || 0) - (dest.metrics?.visitorsLastYear || 0)) / (dest.metrics?.visitorsLastYear || 1) * 100).toFixed(1);
                  return (
                  <div key={dest._id} className="d-flex align-items-center justify-content-between px-2 py-2 border-bottom border-light last-no-border hover-row rounded">
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-slate fw-medium" style={{ width: '12px' }}>{i + 1}</span>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                        {(dest.image || dest.images?.[0]) && <img src={dest.image || dest.images[0]} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />}
                      </div>
                      <span className="text-navy fw-semibold" style={{ fontSize: '0.9rem' }}>{dest.name}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-navy fw-semibold" style={{ fontSize: '0.9rem' }}>
                        {topDestMetric === 'visitors' && formatNumber(dest.metrics?.visitorsCurrentYear)}
                        {topDestMetric === 'revenue' && formatMoney(dest.metrics?.revenueGenerated)}
                        {topDestMetric === 'growth' && (growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`)}
                      </span>
                      {topDestMetric !== 'growth' && (
                        <span className={`fw-bold d-flex align-items-center ${growthPercent >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.8rem', width: '45px', justifyContent: 'flex-end' }}>
                          {growthPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(growthPercent)}%
                        </span>
                      )}
                    </div>
                  </div>
                )})}
                {topDestinations.length === 0 && (
                  <div className="text-center py-4 text-slate">No destination data available.</div>
                )}
              </div>
            </div>
          </div>

          {/* Safety & Alerts */}
          <div className="admin-card mt-auto">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <AlertTriangle size={16} className="text-danger" />
                <h6 className="text-navy fw-bold mb-0">Safety & Alerts</h6>
              </div>
              <span onClick={() => setActiveTab && setActiveTab('actions')} className="text-primary small fw-semibold cursor-pointer">View All →</span>
            </div>
            <div className="admin-card-body py-2">
              <div className="d-flex align-items-start gap-3 py-3 border-bottom border-light">
                <div className="bg-danger bg-opacity-10 p-2 rounded-circle text-danger mt-1">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h6 className="text-navy fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Crowd Alert</h6>
                  <p className="text-slate mb-0" style={{ fontSize: '0.8rem' }}>Varanasi — High Crowd Density</p>
                </div>
                <span className="text-slate small ms-auto mt-1" style={{ fontSize: '0.75rem' }}>2h ago</span>
              </div>
              
              <div className="d-flex align-items-start gap-3 py-3 border-bottom border-light">
                <div className="bg-warning bg-opacity-10 p-2 rounded-circle text-warning mt-1">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h6 className="text-navy fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Weather Warning</h6>
                  <p className="text-slate mb-0" style={{ fontSize: '0.8rem' }}>Ladakh — Heavy Snowfall expected</p>
                </div>
                <span className="text-slate small ms-auto mt-1" style={{ fontSize: '0.75rem' }}>4h ago</span>
              </div>

              <div className="d-flex align-items-start gap-3 py-3 border-bottom border-light">
                <div className="bg-warning bg-opacity-10 p-2 rounded-circle text-warning mt-1">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h6 className="text-navy fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Tourist Complaint</h6>
                  <p className="text-slate mb-0" style={{ fontSize: '0.8rem' }}>Goa — Service Issue reported</p>
                </div>
                <span className="text-slate small ms-auto mt-1" style={{ fontSize: '0.75rem' }}>6h ago</span>
              </div>

              <div className="d-flex align-items-start gap-3 py-3">
                <div className="bg-info bg-opacity-10 p-2 rounded-circle text-info mt-1">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h6 className="text-navy fw-bold mb-1" style={{ fontSize: '0.9rem' }}>Positive Update</h6>
                  <p className="text-slate mb-0" style={{ fontSize: '0.8rem' }}>Kerala — New direct flights operational</p>
                </div>
                <span className="text-slate small ms-auto mt-1" style={{ fontSize: '0.75rem' }}>8h ago</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION - TABLES AND GRIDS */}
      <div className="row g-4">
        
        {/* Destination Performance Table */}
        <div className="col-12 col-xl-7">
          <div className="admin-card h-100">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h6 className="text-navy fw-bold mb-0">Destination Performance</h6>
              <span onClick={() => setActiveTab && setActiveTab('destinations')} className="text-primary small fw-semibold cursor-pointer">View All →</span>
            </div>
            <div className="admin-card-body p-0">
              <div className="table-responsive">
                <table className="table table-borderless table-hover mb-0 align-middle">
                  <thead className="bg-light border-bottom border-secondary border-opacity-25 text-slate" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <tr>
                      <th className="py-3 px-3 font-weight-semibold">Destination</th>
                      <th className="py-3 font-weight-semibold">State</th>
                      <th className="py-3 font-weight-semibold">Visitors</th>
                      <th className="py-3 font-weight-semibold">Revenue</th>
                      <th className="py-3 font-weight-semibold">Rating</th>
                      <th className="py-3 font-weight-semibold">Growth</th>
                      <th className="py-3 font-weight-semibold pe-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDestinations.map(dest => {
                      const isHigh = dest.scores?.impactLevel === 'VERY HIGH' || dest.scores?.impactLevel === 'HIGH';
                      const isMod = dest.scores?.impactLevel === 'MODERATE';
                      
                      return (
                      <tr key={dest._id} className="border-bottom border-light">
                        <td className="px-3 py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                              {(dest.image || dest.images?.[0]) && <img src={dest.image || dest.images[0]} alt="" className="w-100 h-100" style={{ objectFit: 'cover' }} />}
                            </div>
                            <span className="fw-semibold text-navy" style={{ fontSize: '0.9rem' }}>{dest.name}</span>
                          </div>
                        </td>
                        <td className="text-slate" style={{ fontSize: '0.85rem' }}>{dest.state || 'Madhya Pradesh'}</td>
                        <td className="text-navy fw-medium" style={{ fontSize: '0.85rem' }}>{dest.metrics?.visitorsCurrentYear?.toLocaleString()}</td>
                        <td className="text-navy fw-medium" style={{ fontSize: '0.85rem' }}>{formatMoney(dest.metrics?.revenueGenerated)}</td>
                        <td className="text-navy fw-medium" style={{ fontSize: '0.85rem' }}>{dest.metrics?.sustainabilityScore?.toFixed(1) || '4.5'}</td>
                        <td className="text-success fw-bold" style={{ fontSize: '0.85rem' }}>
                          <ArrowUpRight size={14} className="me-1"/>12%
                        </td>
                        <td className="pe-3">
                          <span className={`badge rounded-pill fw-medium ${isHigh ? 'bg-success bg-opacity-25 text-success' : isMod ? 'bg-warning bg-opacity-25 text-warning' : 'bg-secondary bg-opacity-25 text-secondary'}`}>
                            {isHigh ? 'High' : isMod ? 'Medium' : 'Low'}
                          </span>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Gap Detection Grid */}
        <div className="col-12 col-xl-5">
          <div className="admin-card h-100">
            <div className="admin-card-header d-flex justify-content-between align-items-center">
              <h6 className="text-navy fw-bold mb-0">Tourist Gap Detection</h6>
              <span onClick={() => setActiveTab && setActiveTab('gap')} className="text-primary small fw-semibold cursor-pointer">View All →</span>
            </div>
            <div className="admin-card-body bg-light p-3">
              <div className="row g-3">
                <GapCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>} title="Transport" subtitle="28 locations" status="Critical" />
                <GapCard icon={<Building2 size={18} />} title="Accommodation" subtitle="42 locations" status="High" />
                <GapCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21V10"/><path d="M15 21V10"/><path d="M19 10a2 2 0 0 0-2-2h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v1h17v-1z"/><path d="M22 13v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8"/></svg>} title="Toilets & Sanitation" subtitle="17 locations" status="Moderate" />
                <GapCard icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} title="Medical Facilities" subtitle="14 locations" status="Moderate" />
                <GapCard icon={<ShieldCheck size={18} />} title="Safety & Security" subtitle="9 locations" status="Good" />
                <GapCard icon={<MapPin size={18} />} title="Signage & Navigation" subtitle="22 locations" status="Moderate" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function GapCard({ icon, title, subtitle, status }) {
  const getStatusColor = (s) => {
    switch (s) {
      case 'Critical': return 'text-danger bg-danger bg-opacity-10 border border-danger border-opacity-25';
      case 'High': return 'text-warning bg-warning bg-opacity-10 border border-warning border-opacity-25'
      case 'Moderate': return 'text-warning bg-warning bg-opacity-10 border border-warning border-opacity-25';
      case 'Good': return 'text-success bg-success bg-opacity-10 border border-success border-opacity-25';
      default: return 'text-slate bg-light';
    }
  }

  return (
    <div className="col-12 col-sm-6">
      <div className="bg-white rounded-3 p-3 h-100 border border-light shadow-sm d-flex flex-column justify-content-between hover-scale" style={{ cursor: 'pointer' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="text-warning bg-warning bg-opacity-10 p-1.5 rounded">
            {icon}
          </div>
          <div>
            <h6 className="text-navy fw-semibold mb-0" style={{ fontSize: '0.85rem' }}>{title}</h6>
            <span className="text-slate small" style={{ fontSize: '0.75rem' }}>{subtitle}</span>
          </div>
        </div>
        <div className="mt-2 text-center">
          <span className={`badge rounded-pill px-3 py-1 fw-semibold ${getStatusColor(status)}`}>{status}</span>
        </div>
      </div>
    </div>
  )
}

function MoreIcon() {
  return (
    <svg className="text-slate cursor-pointer" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  );
}

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function CustomDropdown({ icon, label, options, value, onChange, width = '200px', displayValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm border-0 hover-pill" 
        style={{ fontSize: '0.9rem' }}
      >
        {icon}
        <span className="fw-medium text-navy text-truncate text-start" style={{ maxWidth: '130px' }}>
          {displayValue}
        </span>
        <ChevronDown size={14} className="text-slate" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      
      {isOpen && (
        <div 
          className="position-absolute top-100 start-0 mt-2 bg-white rounded-3 shadow-lg border border-light z-3" 
          style={{ width, maxHeight: '300px', overflowY: 'auto', minWidth: '100%', zIndex: 1050 }}
        >
          <div className="d-flex flex-column py-1">
            <button 
              className={`btn btn-link text-start text-decoration-none px-3 py-2 ${value === 'all' ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-slate hover-bg-light'}`}
              onClick={() => { onChange('all'); setIsOpen(false); }}
            >
              {label}
            </button>
            {options.map((opt, i) => {
              const optValue = typeof opt === 'string' ? opt : opt.value;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <button 
                  key={i}
                  className={`btn btn-link text-start text-decoration-none px-3 py-2 ${value === optValue ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'text-slate hover-bg-light'}`}
                  onClick={() => { onChange(optValue); setIsOpen(false); }}
                >
                  {optLabel}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}
