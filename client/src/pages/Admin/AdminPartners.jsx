import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, CheckCircle2, XCircle, AlertTriangle, Eye, Download } from 'lucide-react';

export function AdminPartners({ user }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedKycImage, setSelectedKycImage] = useState(null);

  const fetchPartners = async () => {
    try {
      const res = await axios.get('/api/admin/partners/verification');
      setPartners(res.data);
    } catch (err) {
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleVerify = async (id, status) => {
    try {
      let note = 'Admin updated via dashboard';
      if (status === 'CHANGES_REQUESTED' || status === 'REJECTED' || status === 'SUSPENDED') {
        note = window.prompt(`Enter reason for ${status}:`) || note;
      }
      await axios.patch(`/api/admin/partners/${id}/verify`, { status, note });
      toast.success(`Partner status updated to ${status.replace('_', ' ')}`);
      fetchPartners();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const exportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Name,Email,Role,Status,Contact\n';
    partners.forEach(p => {
      csvContent += `${p.name},${p.email},${p.role},${p.verificationStatus},${p.contactPhone || 'N/A'}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'partners.csv');
    document.body.appendChild(link);
    link.click();
  };

  const filtered = partners.filter(p => 
    (statusFilter === 'all' || p.verificationStatus === statusFilter) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getKycImage = (p) => {
    const isDefault = (url) => !url || url.includes("images.unsplash.com/photo-1566073771259");
    
    if (p.documents && p.documents.length > 0 && p.documents[0].url) {
      return p.documents[0].url;
    }
    if (p.hotelImage && !isDefault(p.hotelImage)) {
      return p.hotelImage;
    }
    if (p.image && !isDefault(p.image)) {
      return p.image;
    }
    // If no real KYC image was uploaded, show the demo selfie from the public folder
    return "/atul.jpeg";
  };

  if (loading) return <div>Loading partners...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Partner Verification</h3>
        <button onClick={exportCsv} className='btn btn-outline-light d-flex align-items-center gap-2'>
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className='row mb-4'>
        <div className='col-md-8'>
          <div className='input-group bg-black rounded-3 border border-secondary border-opacity-50 overflow-hidden'>
            <span className='input-group-text bg-transparent border-0 text-secondary'><Search size={18}/></span>
            <input type='text' className='form-control bg-transparent border-0 text-white shadow-none' placeholder='Search partners...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className='col-md-4'>
          <select className='form-select bg-white text-dark border-secondary' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value='all'>All Statuses</option>
            <option value='Pending'>Pending</option>
            <option value='Verified'>Verified</option>
            <option value='Rejected'>Rejected</option>
          </select>
        </div>
      </div>
      <div className='table-responsive'>
        <table className='table table-hover align-middle bg-white'>
          <thead>
            <tr>
              <th>Partner</th>
              <th>Type</th>
              <th>Status</th>
              <th>KYC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p._id}>
                <td>
                  <div className='fw-bold'>{p.name}</div>
                  <div className='small text-secondary'>{p.email}</div>
                </td>
                <td><span className='badge bg-light text-dark border'>{p.userType || p.role}</span></td>
                <td>
                  <span className={`badge ${
                    ['Verified', 'VERIFIED', 'ACTIVE'].includes(p.verificationStatus) ? 'bg-success' : 
                    ['Pending', 'PENDING', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'RESUBMITTED'].includes(p.verificationStatus || 'Pending') ? 'bg-warning text-dark' : 
                    'bg-danger'
                  }`}>{p.verificationStatus || 'Pending'}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 bg-white shadow-sm"
                    onClick={() => setSelectedKycImage(getKycImage(p))}
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
                <td>
                  <div className='d-flex flex-wrap gap-2'>
                    {(!p.verificationStatus || p.verificationStatus === 'Pending' || p.verificationStatus === 'PENDING') && <>
                      <button className='btn btn-sm btn-success fw-bold px-3 py-1' onClick={() => handleVerify(p._id, 'Verified')}>Approve</button>
                      <button className='btn btn-sm btn-danger fw-bold px-3 py-1' onClick={() => handleVerify(p._id, 'Rejected')}>Reject</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* KYC Image Modal */}
      {selectedKycImage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }} onClick={() => setSelectedKycImage(null)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content bg-white border-0 shadow">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold text-dark">KYC Document / Image</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedKycImage(null)}></button>
              </div>
              <div className="modal-body p-4 text-center bg-light rounded-bottom">
                <img src={selectedKycImage} alt="KYC" className="img-fluid rounded shadow-sm" style={{ maxHeight: '70vh', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}