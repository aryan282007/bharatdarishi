import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, Download } from 'lucide-react';

export function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/admin/bookings');
      setBookings(res.data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const exportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Ref,Guest,Partner,Destination,Total,Status,Payment\n';
    bookings.forEach(b => {
      csvContent += `${b.bookingRef},${b.guestName},${b.hotelPartnerId?.name || 'N/A'},${b.destinationId?.name || 'N/A'},${b.totalPrice},${b.status},${b.paymentStatus}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'bookings.csv');
    document.body.appendChild(link);
    link.click();
  };

  const filtered = bookings.filter(b => {
    const matchSearch = b.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) || b.guestName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4 bg-dark rounded-4 border border-secondary border-opacity-25'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0 fw-bold'>Bookings & Transactions</h3>
        <button onClick={exportCsv} className='btn btn-outline-light d-flex align-items-center gap-2'>
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className='mb-4 d-flex gap-3'>
        <div className='input-group bg-black rounded-3 border border-secondary border-opacity-50 overflow-hidden w-50'>
          <span className='input-group-text bg-transparent border-0 text-secondary'><Search size={18}/></span>
          <input type='text' className='form-control bg-transparent border-0 text-white shadow-none' placeholder='Search bookings...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className='form-select bg-black text-white border-secondary w-auto' value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value='all'>All Statuses</option>
          <option value='pending'>Pending</option>
          <option value='confirmed'>Confirmed</option>
          <option value='completed'>Completed</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      </div>
      <div className='table-responsive'>
        <table className='table table-dark table-hover align-middle'>
          <thead>
            <tr>
              <th>Ref</th>
              <th>Guest</th>
              <th>Partner</th>
              <th>Destination</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td>{b.bookingRef}</td>
                <td>{b.guestName}</td>
                <td>{b.hotelPartnerId?.name || 'N/A'}</td>
                <td>{b.destinationId?.name || 'N/A'}</td>
                <td>₹{b.totalPrice}</td>
                <td><span className={`badge ${b.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>{b.status}</span></td>
                <td><span className={`badge ${b.paymentStatus === 'completed' ? 'bg-success' : 'bg-danger'}`}>{b.paymentStatus}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan='7' className='text-center py-4 text-secondary'>No bookings found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
