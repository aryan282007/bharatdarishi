import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, ArrowRight, Activity, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminGapDetection({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        const res = await axios.get('/api/tourism/gaps');
        setDestinations(res.data);
      } catch (err) {
        toast.error('Failed to load gap data');
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPriority = priorityFilter === 'all' || d.scores?.gapPriority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'text-danger bg-danger bg-opacity-25';
    if (priority === 'MEDIUM') return 'text-warning bg-warning bg-opacity-25';
    return 'text-success bg-success bg-opacity-25';
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-warning" /></div>;

  const highGaps = destinations.filter(d => d.scores?.gapPriority === 'HIGH').length;
  const mediumGaps = destinations.filter(d => d.scores?.gapPriority === 'MEDIUM').length;
  const lowGaps = destinations.filter(d => d.scores?.gapPriority === 'LOW').length;
  const avgGap = destinations.length ? Math.round(destinations.reduce((sum, d) => sum + (d.scores?.gapScore || 0), 0) / destinations.length) : 0;

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1">Tourism Gap Detection</h3>
          <p className="text-secondary small mb-0">Identify destinations where tourism demand is outpacing local readiness.</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-dark border-danger border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2 d-flex justify-content-between">High Gap Destinations <AlertTriangle size={16} className="text-danger"/></div>
              <h3 className="text-white mb-0">{highGaps}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-warning border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">Medium Gap Destinations</div>
              <h3 className="text-white mb-0">{mediumGaps}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-success border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2">Low Gap Destinations</div>
              <h3 className="text-white mb-0">{lowGaps}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="text-secondary small mb-2 d-flex justify-content-between">Average Gap Score <Activity size={16} className="text-primary"/></div>
              <h3 className="text-white mb-0">{avgGap}</h3>
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
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Gap</option>
            <option value="MEDIUM">Medium Gap</option>
            <option value="LOW">Low Gap</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="text-secondary small font-monospace">DESTINATION</th>
                <th className="text-secondary small font-monospace">DEMAND</th>
                <th className="text-secondary small font-monospace">READINESS</th>
                <th className="text-secondary small font-monospace">GAP SCORE</th>
                <th className="text-secondary small font-monospace">PRIMARY GAP</th>
                <th className="text-secondary small font-monospace">PRIORITY</th>
                <th className="text-secondary small font-monospace text-end">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d._id}>
                  <td>
                    <div className="fw-bold">{d.name}</div>
                    <small className="text-secondary">{d.city}, {d.state}</small>
                  </td>
                  <td>{d.metrics?.demand || 0}</td>
                  <td>{d.scores?.readinessScore || 0}</td>
                  <td className="fw-bold">{d.scores?.gapScore || 0}</td>
                  <td>
                    {d.gapReasons?.primary?.name || 'None'}
                    <div className="text-secondary small">({d.gapReasons?.primary?.val || 0}/100)</div>
                  </td>
                  <td><span className={`badge ${getPriorityColor(d.scores?.gapPriority)}`}>{d.scores?.gapPriority || 'LOW'}</span></td>
                  <td className="text-end">
                    <button 
                      onClick={() => onSelectDestination && onSelectDestination(d._id, 'gap')} 
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
