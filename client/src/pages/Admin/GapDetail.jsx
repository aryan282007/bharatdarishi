import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export function GapDetail({ destinationId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingAction, setSavingAction] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionDesc, setActionDesc] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/tourism/gaps/${destinationId}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [destinationId]);

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-warning" /></div>;
  if (!data) return <div className="p-5 text-center text-secondary">Data not found</div>;

  const m = data.metrics || {};
  const s = data.scores || {};
  const gapPriority = s.gapPriority || 'LOW';
  
  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') return 'text-danger bg-danger bg-opacity-25';
    if (priority === 'MEDIUM') return 'text-warning bg-warning bg-opacity-25';
    return 'text-success bg-success bg-opacity-25';
  };

  const handleCreateAction = async (e) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      await axios.post('/api/admin/actions', {
        destination: destinationId,
        title: actionTitle,
        description: actionDesc,
        priority: gapPriority,
        category: 'Infrastructure',
        status: 'Assigned'
      });
      toast.success('Government Action Created Successfully');
      setIsModalOpen(false);
      setActionTitle('');
      setActionDesc('');
    } catch (err) {
      toast.error('Failed to create action');
    } finally {
      setSavingAction(false);
    }
  };

  return (
    <div className="p-2">
      <button onClick={onBack} className="btn btn-outline-secondary btn-sm mb-4 d-flex align-items-center gap-2">
        <ArrowLeft size={14}/> Back to Gap Detection
      </button>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card bg-dark border-secondary border-opacity-25 mb-4">
            <div className="card-body p-4 position-relative">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-warning position-absolute top-0 end-0 mt-4 me-4 fw-bold"
              >
                Create Government Action
              </button>
              <h2 className="text-white fw-bold mb-1">{data.name}</h2>
              <div className="text-secondary mb-4">{data.category} • {data.city}, {data.state}</div>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="text-secondary font-monospace mb-3 border-bottom border-secondary pb-2">TOURISM DEMAND</h6>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-light">Demand Score</span>
                    <span className="fw-bold fs-4 text-white">{m.demand} / 100</span>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <h6 className="text-secondary font-monospace mb-3 border-bottom border-secondary pb-2">READINESS</h6>
                  {[
                    { label: 'Transport', val: m.transport },
                    { label: 'Accommodation', val: m.accommodation },
                    { label: 'Sanitation', val: m.sanitation },
                    { label: 'Safety', val: m.safety },
                    { label: 'Medical', val: m.medical },
                    { label: 'Information', val: m.information },
                    { label: 'Local Services', val: m.localServices },
                  ].map(item => (
                    <div key={item.label} className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">{item.label}</span>
                      <span className="text-white fw-bold">{item.val}</span>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mt-3 pt-3 border-top border-secondary">
                    <span className="text-light fw-bold">READINESS SCORE</span>
                    <span className="text-white fw-bold fs-5">{s.readinessScore} / 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-dark border-secondary border-opacity-25 mb-4">
            <div className="card-body text-center p-4">
              <h6 className="text-secondary font-monospace mb-2">TOURISM GAP</h6>
              <div className="display-3 fw-bold text-white mb-2">{s.gapScore}</div>
              <div className="text-secondary mb-3">/ 100</div>
              <div className={`badge px-3 py-2 ${getPriorityColor(gapPriority)} w-100`}>Priority: {gapPriority}</div>
            </div>
          </div>

          <div className="card bg-dark border-secondary border-opacity-25">
            <div className="card-body p-4">
              <h6 className="text-secondary font-monospace mb-3">WHY THIS GAP EXISTS</h6>
              
              <div className="mb-3">
                <div className="text-danger small fw-bold mb-1 d-flex align-items-center gap-1">
                  <AlertTriangle size={14}/> Primary:
                </div>
                <div className="text-white bg-black p-2 rounded border border-secondary border-opacity-25">
                  Low {data.gapReasons?.primary?.name?.toLowerCase()} ({data.gapReasons?.primary?.val})
                </div>
              </div>

              <div>
                <div className="text-warning small fw-bold mb-1">Secondary:</div>
                <div className="text-white bg-black p-2 rounded border border-secondary border-opacity-25 mb-2">
                  {data.gapReasons?.secondary?.[0]?.name} ({data.gapReasons?.secondary?.[0]?.val})
                </div>
                <div className="text-white bg-black p-2 rounded border border-secondary border-opacity-25">
                  {data.gapReasons?.secondary?.[1]?.name} ({data.gapReasons?.secondary?.[1]?.val})
                </div>
              </div>

              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <div className="text-secondary small mb-2">Suggested administrative areas:</div>
                <ul className="text-light small mb-0 ps-3">
                  <li>{data.gapReasons?.primary?.name}</li>
                  <li>{data.gapReasons?.secondary?.[0]?.name}</li>
                  <li>{data.gapReasons?.secondary?.[1]?.name}</li>
                </ul>
                <div className="text-muted" style={{fontSize: '10px', marginTop: '10px'}}>These are rule-based labels derived directly from the lowest readiness metrics.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold text-white">Create Government Action</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCreateAction}>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="form-label text-secondary small">Destination</label>
                    <input type="text" className="form-control bg-black text-secondary border-secondary" value={data.name} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">Action Title *</label>
                    <input type="text" className="form-control bg-black text-white border-secondary" required value={actionTitle} onChange={e => setActionTitle(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">Description *</label>
                    <textarea className="form-control bg-black text-white border-secondary" rows="3" required value={actionDesc} onChange={e => setActionDesc(e.target.value)}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">Suggested Priority based on Gap</label>
                    <div className={`badge ${getPriorityColor(gapPriority)} d-block p-2 text-start`}>{gapPriority}</div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning fw-bold" disabled={savingAction}>
                    {savingAction ? 'Saving...' : 'Submit Action'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
