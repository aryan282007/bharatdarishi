import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { MapPin, AlertTriangle, Search, ExternalLink } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Map Error Boundary Caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light text-center p-4" style={{ minHeight: '400px' }}>
          <AlertTriangle size={48} className="text-danger mb-3" />
          <h5 className="text-navy fw-bold">Tourism Intelligence could not be loaded.</h5>
          <button className="btn btn-outline-primary mt-2" onClick={() => this.setState({ hasError: false })}>Retry</button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export function AdminIntelligenceMapComponent({ onSelectDestination, inline = false }) {
  const [destinations, setDestinations] = useState([]);
  const [activeLayer, setActiveLayer] = useState('demand'); // demand, popular, emerging, gap, impact, safety, infra
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [selectedDest, setSelectedDest] = useState(null);

  const fetchMapData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/tourism/map?';
      if (filterState) url += `state=${encodeURIComponent(filterState)}&`;
      if (filterCategory) url += `category=${encodeURIComponent(filterCategory)}&`;
      
      const res = await axios.get(url);
      if (res.data && res.data.success) {
        setDestinations(res.data.data);
      } else {
        setError('Unable to load tourism intelligence data.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load tourism intelligence data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [filterState, filterCategory]);

  const filteredDestinations = useMemo(() => {
    let result = [...destinations];
    if (search) {
      result = result.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    result.sort((a, b) => {
      if (activeLayer === 'demand') return (b.demandScore || 0) - (a.demandScore || 0);
      if (activeLayer === 'gap') return (b.gapScore || 0) - (a.gapScore || 0);
      if (activeLayer === 'impact') return (b.impactScore || 0) - (a.impactScore || 0);
      if (activeLayer === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      if (activeLayer === 'emerging') return (b.isEmerging ? 1 : 0) - (a.isEmerging ? 1 : 0);
      if (activeLayer === 'safety') return (b.activeAlertsCount || 0) - (a.activeAlertsCount || 0);
      if (activeLayer === 'infra') return (a.infrastructureStatus === 'Needs Attention' ? -1 : 1);
      return 0;
    });
    
    return result;
  }, [destinations, search, activeLayer]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const layers = [
    { id: 'demand', label: 'Demand' },
    { id: 'popular', label: 'Popular' },
    { id: 'emerging', label: 'Emerging' },
    { id: 'gap', label: 'Gap' },
    { id: 'impact', label: 'Impact' },
    { id: 'safety', label: 'Safety' },
    { id: 'infra', label: 'Infrastructure' }
  ];

  const getMetricColor = (d, layer) => {
    if (layer === 'demand') return d.demandScore > 80 ? 'text-danger fw-bold' : d.demandScore > 50 ? 'text-warning fw-bold' : 'text-success fw-bold';
    if (layer === 'popular') return d.isPopular ? 'text-primary fw-bold' : 'text-slate';
    if (layer === 'emerging') return d.isEmerging ? 'text-purple fw-bold' : 'text-slate';
    if (layer === 'gap') return d.gapPriority === 'HIGH' ? 'text-danger fw-bold' : d.gapPriority === 'MEDIUM' ? 'text-warning fw-bold' : 'text-success fw-bold';
    if (layer === 'impact') return d.impactLevel === 'VERY HIGH' || d.impactLevel === 'HIGH' ? 'text-success fw-bold' : d.impactLevel === 'MODERATE' ? 'text-warning fw-bold' : 'text-slate fw-bold';
    if (layer === 'safety') return d.highestAlertSeverity === 'CRITICAL' || d.highestAlertSeverity === 'HIGH' ? 'text-danger fw-bold' : d.activeAlertsCount > 0 ? 'text-warning fw-bold' : 'text-success fw-bold';
    if (layer === 'infra') return d.infrastructureStatus === 'Needs Attention' ? 'text-danger fw-bold' : d.infrastructureStatus === 'Moderate' ? 'text-warning fw-bold' : 'text-success fw-bold';
    return 'text-navy';
  };

  const getMetricValue = (d, layer) => {
    if (layer === 'demand') return `Demand Score: ${d.demandScore}`;
    if (layer === 'popular') return d.isPopular ? 'Highly Popular' : 'Standard';
    if (layer === 'emerging') return d.isEmerging ? 'Emerging Destination' : 'Standard';
    if (layer === 'gap') return `Gap Score: ${d.gapScore} (${d.gapPriority})`;
    if (layer === 'impact') return `Impact: ${d.impactScore} (${d.impactLevel})`;
    if (layer === 'safety') return `Alerts: ${d.activeAlertsCount} ${d.highestAlertSeverity ? '('+d.highestAlertSeverity+')' : ''}`;
    if (layer === 'infra') return `Infra: ${d.infrastructureStatus}`;
    return '';
  };

  useEffect(() => {
    if (!selectedDest && filteredDestinations.length > 0) {
      setSelectedDest(filteredDestinations[0]);
    }
  }, [filteredDestinations, selectedDest]);

  return (
    <div className={`admin-card ${!inline ? 'mb-4' : 'h-100'}`} style={{ minHeight: inline ? '600px' : '700px', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER CONTROLS */}
      <div className="admin-card-header d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <MapPin className="text-slate" size={20}/>
            <h6 className="text-navy mb-0 fw-bold fs-5">Tourism Intelligence Grid</h6>
          </div>
          <div className="d-flex gap-2">
            <select className="form-select form-select-sm shadow-sm border-light" value={filterState} onChange={(e) => setFilterState(e.target.value)} style={{ width: '140px' }}>
              <option value="">All States</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
            <select className="form-select form-select-sm shadow-sm border-light" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: '140px' }}>
              <option value="">All Categories</option>
              <option value="Heritage">Heritage</option>
              <option value="Nature">Nature</option>
              <option value="Spiritual">Spiritual</option>
            </select>
            <div className="input-group input-group-sm shadow-sm" style={{ width: '200px' }}>
              <span className="input-group-text bg-white border-end-0 border-light"><Search size={14} className="text-slate"/></span>
              <input type="text" className="form-control border-start-0 border-light ps-0" placeholder="Search destination..." value={search} onChange={handleSearchChange} />
            </div>
          </div>
        </div>

        {/* LAYER TABS */}
        <div className="d-flex flex-wrap gap-2">
          {layers.map(l => (
            <button 
              key={l.id}
              className={`btn btn-sm px-3 rounded-pill fw-medium transition-all hover-pill ${activeLayer === l.id ? 'btn-primary text-white shadow' : 'btn-light text-secondary border-light'}`}
              onClick={() => setActiveLayer(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* BODY */}
      <div className="admin-card-body p-0 position-relative flex-grow-1 bg-light d-flex flex-column" style={{ borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
        
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status" />
              <div className="fw-semibold text-navy">Loading location...</div>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white" style={{ zIndex: 10 }}>
            <div className="text-center">
              <AlertTriangle size={40} className="text-danger mb-2" />
              <div className="fw-semibold text-navy mb-3">{error}</div>
              <button className="btn btn-primary btn-sm" onClick={fetchMapData}>Retry</button>
            </div>
          </div>
        )}

        {/* MAP EMBED AREA */}
        {!loading && !error && (
          <div className="w-100 p-4 bg-white border-bottom shadow-sm z-1 position-relative">
            {selectedDest ? (
              selectedDest.googleMapsEmbedUrl ? (
                <div className="w-100 rounded-3 overflow-hidden shadow-sm border border-light" style={{ height: "420px" }}>
                  <iframe
                    src={selectedDest.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${selectedDest.name} location map`}
                  ></iframe>
                </div>
              ) : (
                <div className="w-100 rounded-3 d-flex flex-column align-items-center justify-content-center bg-light border border-light" style={{ height: "420px" }}>
                  <MapPin size={48} className="text-secondary mb-3" />
                  <h5 className="text-secondary">Location map unavailable.</h5>
                  <p className="text-muted">Address: {selectedDest.name}, {selectedDest.district}, {selectedDest.state}</p>
                  {selectedDest.googleMapsUrl && (
                    <a href={selectedDest.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-2">Open in Google Maps</a>
                  )}
                </div>
              )
            ) : (
              <div className="w-100 rounded-3 d-flex align-items-center justify-content-center bg-light border border-light" style={{ height: "420px" }}>
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-2 text-navy fw-semibold">Loading location...</span>
              </div>
            )}
            
            {selectedDest && (
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-navy mb-1 text-uppercase">{selectedDest.name}</h4>
                  <p className="text-slate mb-0">{selectedDest.district}, {selectedDest.state} • {selectedDest.category}</p>
                </div>
                <div className="d-flex gap-4">
                  <div className="text-center">
                    <div className="fw-bold text-navy fs-5">{selectedDest.visitorCount?.toLocaleString()}</div>
                    <div className="text-slate small text-uppercase" style={{fontSize: '11px'}}>Visitors</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold text-navy fs-5">{selectedDest.bookingCount?.toLocaleString()}</div>
                    <div className="text-slate small text-uppercase" style={{fontSize: '11px'}}>Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold text-success fs-5">₹{(selectedDest.revenue / 100000).toFixed(1)}L</div>
                    <div className="text-slate small text-uppercase" style={{fontSize: '11px'}}>Revenue</div>
                  </div>
                  <div className="text-center border-start ps-4">
                    <div className={`fw-bold fs-5 ${selectedDest.gapScore > 50 ? 'text-danger' : 'text-success'}`}>{selectedDest.gapScore}</div>
                    <div className="text-slate small text-uppercase" style={{fontSize: '11px'}}>Gap Score</div>
                  </div>
                  <div className="text-center">
                    <div className="fw-bold text-primary fs-5">{selectedDest.impactScore}</div>
                    <div className="text-slate small text-uppercase" style={{fontSize: '11px'}}>Impact Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && filteredDestinations.length === 0 && (
          <div className="position-absolute top-50 start-50 translate-middle bg-white p-4 rounded shadow-sm text-center" style={{ zIndex: 10, width: '300px' }}>
            <p className="text-slate fw-medium mb-3">No tourism destinations found for the selected filters.</p>
            <button className="btn btn-outline-primary btn-sm" onClick={() => { setSearch(''); setFilterState(''); setFilterCategory(''); }}>Clear Filters</button>
          </div>
        )}

        {/* DESTINATIONS GRID */}
        {!loading && !error && filteredDestinations.length > 0 && (
          <div className="container-fluid py-4 overflow-auto flex-grow-1" style={{ backgroundColor: '#f8fafc' }}>
            <h6 className="fw-bold text-slate mb-3 ms-2">DESTINATION INTELLIGENCE LIST</h6>
            <div className="row g-3">
              {filteredDestinations.map(dest => (
                <div key={dest.id} className="col-12 col-md-6 col-xl-4">
                  <div 
                    className={`bg-white rounded shadow-sm border p-3 h-100 d-flex flex-column cursor-pointer transition-all hover-scale ${selectedDest?.id === dest.id ? 'border-primary shadow' : 'border-light'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedDest(dest)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className={`fw-bold mb-1 ${selectedDest?.id === dest.id ? 'text-primary' : 'text-navy'}`}>{dest.name}</h6>
                        <p className="text-slate small mb-0">{dest.district}, {dest.state} • {dest.category}</p>
                      </div>
                      <div className="text-end">
                        <div className={getMetricColor(dest, activeLayer)} style={{ fontSize: '0.85rem' }}>
                          {getMetricValue(dest, activeLayer)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex-grow-1">
                      <div className="row g-2 text-center border-top pt-2">
                        <div className="col-4">
                          <div className="small fw-bold text-navy">{dest.visitorCount?.toLocaleString()}</div>
                          <div className="text-slate" style={{fontSize: '10px'}}>VISITORS</div>
                        </div>
                        <div className="col-4 border-start border-end">
                          <div className="small fw-bold text-navy">{dest.demandScore}</div>
                          <div className="text-slate" style={{fontSize: '10px'}}>DEMAND</div>
                        </div>
                        <div className="col-4">
                          <div className="small fw-bold text-navy">{dest.gapScore}</div>
                          <div className="text-slate" style={{fontSize: '10px'}}>GAP</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary w-50 hover-pill"
                        onClick={(e) => { e.stopPropagation(); onSelectDestination && onSelectDestination(dest.id, 'gap'); }}
                      >
                        View Details
                      </button>
                      
                      <button 
                        className={`btn btn-sm ${selectedDest?.id === dest.id ? 'btn-primary' : 'btn-navy'} w-50 hover-pill`}
                        onClick={(e) => { e.stopPropagation(); setSelectedDest(dest); }}
                      >
                        {selectedDest?.id === dest.id ? 'Selected' : 'Show on Map'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminIntelligenceMap(props) {
  return (
    <ErrorBoundary>
      <AdminIntelligenceMapComponent {...props} />
    </ErrorBoundary>
  )
}
