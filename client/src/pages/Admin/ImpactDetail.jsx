import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Target, Percent } from 'lucide-react';

export function ImpactDetail({ destinationId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/tourism/impact/${destinationId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [destinationId]);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-info" /></div>;
  if (!data) return <div className="p-5 text-center text-secondary">Data not found</div>;

  const m = data.metrics || {};
  const s = data.scores || {};
  const level = s.impactLevel || 'LOW';
  
  const getLevelColor = (l) => {
    if (l === 'VERY HIGH') return 'text-success bg-success bg-opacity-25';
    if (l === 'HIGH') return 'text-primary bg-primary bg-opacity-25';
    if (l === 'MODERATE') return 'text-warning bg-warning bg-opacity-25';
    return 'text-secondary bg-secondary bg-opacity-25';
  };

  return (
    <div className="p-2">
      <button onClick={onBack} className="btn btn-outline-secondary btn-sm mb-4 d-flex align-items-center gap-2">
        <ArrowLeft size={14}/> Back to Tourism Impact
      </button>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card bg-dark border-secondary border-opacity-25 mb-4">
            <div className="card-body p-4">
              <h2 className="text-white fw-bold mb-1">{data.name}</h2>
              <div className="text-secondary mb-4">{data.category} • {data.city}, {data.state}</div>
              
              <div className="row g-4">
                {[
                  { label: 'ECONOMIC ACTIVITY', val: m.economicActivity, w: 30 },
                  { label: 'EMPLOYMENT', val: m.employment, w: 20 },
                  { label: 'VISITOR SATISFACTION', val: m.satisfaction, w: 20 },
                  { label: 'LOCAL PARTICIPATION', val: m.localParticipation, w: 15 },
                  { label: 'VISITOR GROWTH', val: m.visitorGrowth, w: 15 },
                ].map(item => (
                  <div key={item.label} className="col-md-6 mb-3">
                    <h6 className="text-secondary font-monospace mb-2">{item.label}</h6>
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-bold fs-4 text-white">{item.val} <span className="text-secondary fs-6 fw-normal">/ 100</span></span>
                      <span className="badge bg-secondary bg-opacity-50 text-light d-flex align-items-center gap-1">Weight: {item.w}%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="progress mt-2" style={{height: 6, backgroundColor: '#333'}}>
                      <div className="progress-bar bg-info" style={{width: `${item.val}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card bg-dark border-secondary border-opacity-25">
             <div className="card-body p-4">
               <h6 className="text-secondary font-monospace mb-3">DESTINATION INTELLIGENCE</h6>
               <div className="text-white bg-black p-3 border border-secondary border-opacity-50 rounded fst-italic">
                 "{data.intelligence}"
               </div>
               <div className="text-muted small mt-2">Rule-based interpretation generated from combined Gap and Impact scores.</div>
             </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary border-opacity-25 mb-4">
            <div className="card-body text-center p-4">
              <h6 className="text-secondary font-monospace mb-2">IMPACT SCORE</h6>
              <div className="display-3 fw-bold text-info mb-2">{s.impactScore}</div>
              <div className="text-secondary mb-3">/ 100</div>
              <div className={`badge px-3 py-2 ${getLevelColor(level)} w-100`}>Level: {level}</div>
            </div>
          </div>

          <div className="card bg-dark border-secondary border-opacity-25">
            <div className="card-body p-4">
              <h6 className="text-secondary font-monospace mb-3 d-flex align-items-center gap-2">
                <Target size={16}/> SCORE CALCULATION
              </h6>
              
              <ul className="list-unstyled text-light font-monospace small mb-0">
                <li className="d-flex justify-content-between mb-2">
                  <span>30% × Eco. Activity</span> <span>{(m.economicActivity * 0.3).toFixed(1)}</span>
                </li>
                <li className="d-flex justify-content-between mb-2">
                  <span>20% × Employment</span> <span>{(m.employment * 0.2).toFixed(1)}</span>
                </li>
                <li className="d-flex justify-content-between mb-2">
                  <span>20% × Satisfaction</span> <span>{(m.satisfaction * 0.2).toFixed(1)}</span>
                </li>
                <li className="d-flex justify-content-between mb-2">
                  <span>15% × Local Part.</span> <span>{(m.localParticipation * 0.15).toFixed(1)}</span>
                </li>
                <li className="d-flex justify-content-between mb-3 border-bottom border-secondary pb-2">
                  <span>15% × Visitor Growth</span> <span>{(m.visitorGrowth * 0.15).toFixed(1)}</span>
                </li>
                <li className="d-flex justify-content-between fw-bold text-white fs-6">
                  <span>FINAL</span> <span>{s.impactScore}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
