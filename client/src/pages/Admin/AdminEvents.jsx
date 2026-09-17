import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Search, MapPin, Eye, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/admin/events", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(e => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5 text-warning">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold font-serif mb-0">Events & Heritage Content</h3>
        <button onClick={() => toast.success('Event creation is locked by IT cell.')} className="btn btn-warning fw-bold d-flex align-items-center gap-2">
          <Calendar size={16} /> Create Content
        </button>
      </div>

      <div className="card bg-dark text-white border border-secondary border-opacity-25">
        <div className="card-header border-secondary border-opacity-25 d-flex gap-3 bg-transparent p-3">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-dark border-secondary text-secondary">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              className="form-control bg-dark text-white border-secondary" 
              placeholder="Search title, category, location" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th className="text-secondary font-monospace small">TITLE</th>
                <th className="text-secondary font-monospace small">CATEGORY</th>
                <th className="text-secondary font-monospace small">LOCATION</th>
                <th className="text-secondary font-monospace small">DATE / TIME</th>
                <th className="text-secondary font-monospace small">TICKETS/PRICE</th>
                <th className="text-secondary font-monospace small text-end">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {e.image ? (
                        <img src={e.image} alt="" className="rounded object-cover" style={{ width: 40, height: 40 }} />
                      ) : (
                        <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                          <Calendar size={20} className="text-secondary" />
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">{e.title}</div>
                        <span className={`badge ${e.verified ? 'bg-success text-white' : 'bg-warning text-dark'} px-2 py-0`}>
                          {e.verified ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge bg-secondary bg-opacity-25 text-light">{e.category}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-1 text-secondary small">
                      <MapPin size={12} /> {e.city}, {e.state}
                    </div>
                  </td>
                  <td>
                    <div className="small">{e.date}</div>
                    <div className="text-secondary small">{e.time}</div>
                  </td>
                  <td>
                    <div className="small fw-bold">₹{e.price}</div>
                    <div className="text-secondary small">Cap: {e.availableTickets}</div>
                  </td>
                  <td className="text-end">
                    <div className="btn-group">
                      <button onClick={() => toast.success('Event viewing is restricted.')} className="btn btn-sm btn-outline-secondary" title="View"><Eye size={14} /></button>
                      <button onClick={() => toast.success('Event edits are locked.')} className="btn btn-sm btn-outline-info" title="Edit"><Edit size={14} /></button>
                      <button onClick={() => toast.success('Event archival requires super admin.')} className="btn btn-sm btn-outline-danger" title="Archive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-secondary">
                    No events or content found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
