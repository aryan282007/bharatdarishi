import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit } from 'lucide-react';

export function AdminCircuits() {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCircuits = async () => {
    try {
      const res = await axios.get('/api/admin/circuits');
      setCircuits(res.data);
    } catch (err) {
      toast.error('Failed to load circuits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCircuits(); }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Tourism Circuits</h3>
        <button onClick={() => toast.success('Circuit creation is currently managed via Government IT cell.')} className='btn btn-warning d-flex align-items-center gap-2'>
          <Plus size={18} /> Add Circuit
        </button>
      </div>
      <div className='table-responsive'>
        <table className='table table-dark table-hover align-middle'>
          <thead>
            <tr>
              <th>Circuit Name</th>
              <th>Destinations</th>
              <th>Duration</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {circuits.map(c => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                  <ul className="list-unstyled mb-0 small">
                    {c.destinations && c.destinations.map((d, i) => (
                      <li key={d._id || i} className="mb-1">
                        <span className="fw-medium text-light">{i + 1}. {d.name}</span>
                        {d.googleMapsUrl && (
                          <a href={d.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ms-2 text-warning text-decoration-none" style={{fontSize: '0.75rem'}}>
                            [View on Google Maps]
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{c.duration}</td>
                <td>{c.category}</td>
                <td><span className={`badge ${c.isPublished ? 'bg-success' : 'bg-secondary'}`}>{c.isPublished ? 'Published' : 'Draft'}</span></td>
                <td>
                  <button onClick={() => toast.success('Circuit edits are currently locked.')} className='btn btn-sm btn-outline-light'><Edit size={16}/></button>
                </td>
              </tr>
            ))}
            {circuits.length === 0 && <tr><td colSpan='6' className='text-center py-4 text-secondary'>No circuits found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
