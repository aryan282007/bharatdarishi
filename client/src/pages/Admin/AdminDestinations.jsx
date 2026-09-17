import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, X, MapPin, EyeOff, Eye } from 'lucide-react';

export function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Heritage',
    state: 'Madhya Pradesh',
    city: '',
    image: '',
    isPublished: true,
    isFeatured: false
  });

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/destinations');
      setDestinations(res.data);
    } catch (err) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDestinations(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '', category: 'Heritage', state: 'Madhya Pradesh', city: '', image: '', isPublished: true, isFeatured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dest) => {
    setEditingId(dest._id);
    setFormData({
      name: dest.name,
      category: dest.category || 'Heritage',
      state: dest.state || 'Madhya Pradesh',
      city: dest.city || '',
      image: dest.image || '',
      isPublished: dest.isPublished,
      isFeatured: dest.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/api/admin/destinations/${editingId}`, formData);
        toast.success('Destination updated successfully');
      } else {
        await axios.post('/api/admin/destinations', formData);
        toast.success('Destination created successfully');
      }
      setIsModalOpen(false);
      fetchDestinations();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/admin/destinations/${id}`);
      toast.success('Destination deleted');
      fetchDestinations();
    } catch (err) {
      toast.error('Failed to delete destination');
    }
  };

  const togglePublish = async (dest) => {
    try {
      await axios.put(`/api/admin/destinations/${dest._id}`, { isPublished: !dest.isPublished });
      toast.success(dest.isPublished ? 'Destination unpublished' : 'Destination published');
      fetchDestinations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = destinations.filter(d => 
    (categoryFilter === 'all' || d.category === categoryFilter) &&
    (d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.city?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [...new Set(destinations.map(d => d.category).filter(Boolean))];

  if (loading) return <div className="p-5 text-center text-secondary">Loading destinations...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Destinations</h3>
        <button onClick={openAddModal} className='btn btn-warning d-flex align-items-center gap-2'>
          <Plus size={18} /> Add Destination
        </button>
      </div>

      <div className='row mb-4'>
        <div className='col-md-8'>
          <div className='input-group bg-black rounded-3 border border-secondary border-opacity-50 overflow-hidden'>
            <span className='input-group-text bg-transparent border-0 text-secondary'><Search size={18}/></span>
            <input type='text' className='form-control bg-transparent border-0 text-white shadow-none' placeholder='Search destinations...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className='col-md-4'>
          <select className='form-select bg-black text-white border-secondary' value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value='all'>All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className='table-responsive'>
        <table className='table table-dark table-hover align-middle'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d._id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{width:'40px', height:'40px', borderRadius:'6px', overflow:'hidden', backgroundColor:'#333'}}>
                      {d.image && <img src={d.image} alt={d.name} className="w-100 h-100 object-fit-cover"/>}
                    </div>
                    <div>
                      <div className="fw-bold">{d.name}</div>
                      <small className="text-secondary">{d.city}, {d.state}</small>
                    </div>
                  </div>
                </td>
                <td><span className="badge bg-secondary bg-opacity-50 border border-secondary">{d.category || 'N/A'}</span></td>
                <td>
                  {d.googleMapsUrl ? (
                    <a href={d.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1">
                      <MapPin size={14}/> Map
                    </a>
                  ) : (
                    <span className="text-secondary small">Unavailable</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${d.isPublished ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {d.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button onClick={() => togglePublish(d)} className={`btn btn-sm ${d.isPublished ? 'btn-outline-warning' : 'btn-outline-success'}`} title={d.isPublished ? "Unpublish" : "Publish"}>
                      {d.isPublished ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                    <button onClick={() => openEditModal(d)} className='btn btn-sm btn-outline-light' title="Edit">
                      <Edit size={16}/>
                    </button>
                    <button onClick={() => handleDelete(d._id)} className='btn btn-sm btn-outline-danger' title="Delete">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan='5' className='text-center py-5 text-secondary'>No destinations found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary border-opacity-25">
                <h5 className="modal-title fw-bold">{editingId ? 'Edit Destination' : 'Add Destination'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body text-start">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small mb-1">Destination Name *</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small mb-1">Category *</label>
                      <select className="form-select bg-black text-white border-secondary" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Heritage">Heritage</option>
                        <option value="Nature">Nature</option>
                        <option value="Spiritual">Spiritual</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Wildlife">Wildlife</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small mb-1">State *</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small mb-1">City/District</label>
                      <input type="text" className="form-control bg-black text-white border-secondary" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small mb-1">Cover Image URL *</label>
                      <input type="url" className="form-control bg-black text-white border-secondary" placeholder="https://example.com/image.jpg" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckPublished" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} />
                        <label className="form-check-label text-white" htmlFor="flexSwitchCheckPublished">Published (visible to public)</label>
                      </div>
                      <div className="form-check form-switch mt-2">
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckFeatured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
                        <label className="form-check-label text-white" htmlFor="flexSwitchCheckFeatured">Featured on Homepage</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-secondary border-opacity-25">
                  <button type="button" className="btn btn-outline-light" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-warning fw-bold" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Destination'}
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
