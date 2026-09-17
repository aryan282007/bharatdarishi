import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';

export function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/admin/reviews');
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/reviews/${id}/status`, { status });
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Content Moderation & Reviews</h3>
      </div>
      <div className='table-responsive'>
        <table className='table table-dark table-hover align-middle'>
          <thead>
            <tr>
              <th>Tourist</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td>{r.tourist?.name}</td>
                <td>{r.rating}/5</td>
                <td>{r.content}</td>
                <td>
                  <span className={`badge ${r.status === 'approved' ? 'bg-success' : r.status === 'reported' ? 'bg-warning' : 'bg-danger'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className='d-flex gap-2'>
                    {r.status !== 'approved' && <button className='btn btn-sm btn-success' onClick={() => handleUpdateStatus(r._id, 'approved')}><CheckCircle2 size={16}/></button>}
                    {r.status !== 'hidden' && <button className='btn btn-sm btn-danger' onClick={() => handleUpdateStatus(r._id, 'hidden')}><EyeOff size={16}/></button>}
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && <tr><td colSpan='5' className='text-center py-4 text-secondary'>No reviews found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
