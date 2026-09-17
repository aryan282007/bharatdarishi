import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowRight, BarChart, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminImpactScore({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await axios.get('/api/tourism/impact');
        setDestinations(res.data);
      } catch (err) {
        toast.error('Failed to load impact data');
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'all' || d.scores?.impactLevel === levelFilter;
    return matchSearch && matchLevel;
  });

  const getLevelColor = (level) => {
    if (level === 'VERY HIGH') return 'text-success bg-success bg-opacity-25';
    if (level === 'HIGH') return 'text-primary bg-primary bg-opacity-25';
    if (level === 'MODERATE') return 'text-warning bg-warning bg-opacity-25';
    return 'text-secondary bg-secondary bg-opacity-25';
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" /></div>;

  const veryHigh = destinations.filter(d => d.scores?.impactLevel === 'VERY HIGH').length;
  const high = destinations.filter(d => d.scores?.impactLevel === 'HIGH').length;
  const moderate = destinations.filter(d => d.scores?.impactLevel === 'MODERATE').length;
  const low = destinations.filter(d => d.scores?.impactLevel === 'LOW').length;
  const avgImpact = destinations.length ? Math.round(destinations.reduce((sum, d) => sum + (d.scores?.impactScore || 0), 0) / destinations.length) : 0;

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1">Tourism Impact</h3>
          <p className="text-secondary small mb-0">Measure tourism's economic and community contribution across destinations.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-2">
          <div className="card bg-dark border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2 d-flex justify-content-between">Avg Impact <Activity size={16} className="text-info"/></div>
              <h3 className="text-white mb-0">{avgImpact}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark border-success border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">Very High</div>
              <h3 className="text-white mb-0">{veryHigh}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark border-primary border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">High</div>
              <h3 className="text-white mb-0">{high}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark border-warning border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">Moderate</div>
              <h3 className="text-white mb-0">{moderate}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark border-secondary border-opacity-50 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">Low</div>
              <h3 className="text-white mb-0">{low}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-dark border-secondary border-opacity-25 mb-4">
        <div className="card-header bg-transparent border-secondary border-opacity-25 p-3 d-flex gap-3">
          <div className="input-group" style={{ maxWidth: 300 }}>
            <span className="input-group-text bg-black border-secondary text-secondary"><Search size={16}/></span>
            <input 
              type="text" 
              className="form-control bg-black border-secondary text-white shadow-none" 
              placeholder="Search destination..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select bg-black border-secondary text-white w-auto shadow-none"
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="VERY HIGH">Very High</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="text-secondary small font-monospace">DESTINATION</th>
                <th className="text-secondary small font-monospace">ECONOMIC ACT.</th>
                <th className="text-secondary small font-monospace">EMPLOYMENT</th>
                <th className="text-secondary small font-monospace">SATISFACTION</th>
                <th className="text-secondary small font-monospace">LOCAL PART.</th>
                <th className="text-secondary small font-monospace">VISITOR GWTH</th>
                <th className="text-secondary small font-monospace">IMPACT SCORE</th>
                <th className="text-secondary small font-monospace">LEVEL</th>
                <th className="text-secondary small font-monospace text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d._id}>
                  <td>
                    <div className="fw-bold">{d.name}</div>
                  </td>
                  <td>{d.metrics?.economicActivity || 0}</td>
                  <td>{d.metrics?.employment || 0}</td>
                  <td>{d.metrics?.satisfaction || 0}</td>
                  <td>{d.metrics?.localParticipation || 0}</td>
                  <td>{d.metrics?.visitorGrowth || 0}</td>
                  <td className="fw-bold text-info">{d.scores?.impactScore || 0}</td>
                  <td><span className={`badge ${getLevelColor(d.scores?.impactLevel)}`}>{d.scores?.impactLevel || 'LOW'}</span></td>
                  <td className="text-end">
                    <button 
                      onClick={() => onSelectDestination && onSelectDestination(d._id, 'impact')} 
                      className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                    >
                      View <ArrowRight size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
