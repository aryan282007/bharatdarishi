import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, User, X, Sparkles, Image, Info, Tag, Plus, Check } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../styles/custom.module.css';

const EVENT_CATEGORIES = [
  "Taxi & City Cabs",
  "Car Rentals (Self/Driver)",
  "Mountain & Outstation",
  "Airport Transfers",
  "Tours & Shuttles",
  "Tourist Guide",
  "Home 2 Wheeler",
  "Rent 4 Wheeler"
];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
];

export function AddLocalEventModal({ isOpen, onClose, onEventAdded, user }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Taxi & City Cabs',
    city: 'Gangtok',
    state: 'Sikkim',
    location: 'M G Marg, Gangtok',
    price: 1500,
    phone: user?.contactPhone || '+91 98320 12345',
    openingHours: 'Open until 11:00 PM',
    estYear: 'Est. 2018',
    image: PRESET_IMAGES[0],
    description: 'Trusted local service provider offering reliable travel across Sikkim and Himalayan circuits.',
    tagsText: 'Local Expert, Clean Vehicles, On-Time',
    organizer: user?.name ? `${user.name} Travels` : 'Sikkim Verified Travels'
  });

  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      toast.error("Please fill in Service Title and Location.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        tags: form.tagsText.split(',').map(t => t.trim()).filter(Boolean)
      };

      const res = await axios.post('/api/events/add', payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      toast.success("✨ Local Service published! Saved in MongoDB.");
      if (onEventAdded) onEventAdded(res.data.event);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to publish local service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 1065 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content bg-dark text-white border border-warning border-opacity-30 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-bottom border-warning border-opacity-20 bg-black p-4">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 44, height: 44, fontSize: '1.2rem' }}
              >
                🚕
              </div>
              <div>
                <h5 className={`modal-title text-warning fw-bold mb-0 ${styles.playfairFont}`}>
                  Post Verified Local Service
                </h5>
                <p className="text-secondary small mb-0">
                  List your cab service, tour agency, guide service, or bike rental directly in MongoDB.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
              disabled={submitting}
            />
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 max-vh-75 overflow-auto">
              <div className="row g-3">
                {/* Title */}
                <div className="col-md-8">
                  <label className="form-label text-secondary small fw-semibold">
                    Event Title (English / Hindi) *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Mahakal Lok Sandhya Bhajan & Classical Ensemble"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-4">
                  <label className="form-label text-secondary small fw-semibold">
                    Category *
                  </label>
                  <select
                    className="form-select bg-black text-white border-secondary border-opacity-50"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {EVENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Venue */}
                <div className="col-md-7">
                  <label className="form-label text-secondary small fw-semibold">
                    Venue / Location Address *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Amphitheatre, Mahakal Lok Corridor / Ram Ghat, Shipra River"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    required
                  />
                </div>

                {/* Distance */}
                <div className="col-md-5">
                  <label className="form-label text-secondary small fw-semibold">
                    Distance Landmark
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. 200m from Temple Gate 1"
                    value={form.distance}
                    onChange={(e) => setForm({ ...form, distance: e.target.value })}
                  />
                </div>

                {/* Date & Time */}
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Schedule / Dates *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Every Evening / Ongoing 7-Day Katha"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Timing *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. 06:30 PM - 08:30 PM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    required
                  />
                </div>

                {/* Organiser & Phone */}
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Organiser / Samiti Name *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Mahakal Lok Sanskritik Samiti"
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="+91 98260 14782"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Entry Fee & Coordinator */}
                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Entry Fee / Pass Info
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="Free Entry / Pass Required"
                    value={form.entryFee}
                    onChange={(e) => setForm({ ...form, entryFee: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-secondary small fw-semibold">
                    Contact Person / Host
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Shri Rakesh Sharma (Coordinator)"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  />
                </div>

                {/* Banner Image URL */}
                <div className="col-12">
                  <label className="form-label text-secondary small fw-semibold d-flex justify-content-between align-items-center">
                    <span>Banner Image URL</span>
                    <span className="text-warning small" style={{ fontSize: '0.75rem' }}>Select Preset or Paste Link</span>
                  </label>
                  <input
                    type="url"
                    className="form-control bg-black text-white border-secondary border-opacity-50 mb-2"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  <div className="d-flex gap-2">
                    {PRESET_IMAGES.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn btn-sm p-0 rounded border overflow-hidden ${form.image === imgUrl ? 'border-warning border-2' : 'border-secondary border-opacity-40'}`}
                        style={{ width: 42, height: 32 }}
                        onClick={() => setForm({ ...form, image: imgUrl })}
                      >
                        <img src={imgUrl} alt="preset" className="w-100 h-100 object-fit-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label text-secondary small fw-semibold">
                    Event Description
                  </label>
                  <textarea
                    rows={2}
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="Describe the divine proceedings, spiritual discourse, or bhajan mandali..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Highlights */}
                <div className="col-12">
                  <label className="form-label text-secondary small fw-semibold">
                    Key Highlights (One point per line)
                  </label>
                  <textarea
                    rows={3}
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="Free Leaf Lamps provided&#10;Seating for 500+ devotees&#10;Live acoustics with Tabla"
                    value={form.highlightsText}
                    onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top border-warning border-opacity-20 bg-black p-3 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`${styles.goldBtn} d-inline-flex align-items-center gap-2`}
                style={{ padding: '8px 24px' }}
              >
                <Sparkles size={16} />
                {submitting ? 'Publishing Event...' : 'Publish Event Live'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddLocalEventModal;
