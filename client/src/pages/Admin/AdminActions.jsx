import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export function AdminActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActions = async () => {
    try {
      const res = await axios.get('/api/admin/actions');
      setActions(res.data);
    } catch (err) {
      toast.error('Failed to load actions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/actions/${id}/status`, { status });
      toast.success('Status updated');
      fetchActions();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => { fetchActions(); }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Government Action Center</h3>
        <button className='btn btn-warning d-flex align-items-center gap-2'>
          <Plus size={18} /> New Action
        </button>
      </div>
      <div className='table-responsive'>
        <table className='table table-dark table-hover align-middle'>
          <thead>
            <tr>
              <th>Issue</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {actions.map(a => (
              <tr key={a._id}>
                <td>{a.issue}</td>
                <td>{a.department}</td>
                <td>{a.priority}</td>
                <td>
                  <select 
                    className={`form-select form-select-sm bg-dark border-secondary text-white ${a.status === 'Resolved' ? 'text-success' : a.status === 'In Progress' ? 'text-warning' : ''}`}
                    value={a.status || 'Assigned'}
                    onChange={e => updateStatus(a._id, e.target.value)}
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => toast.success('Edits are locked.')} className='btn btn-sm btn-outline-light'><Edit size={16}/></button>
                </td>
              </tr>
            ))}
            {actions.length === 0 && <tr><td colSpan='5' className='text-center py-4 text-secondary'>No actions found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}