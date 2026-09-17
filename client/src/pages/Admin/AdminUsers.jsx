import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCog, Search, Shield, Save } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "TOURISM_AUTHORITY",
  "VERIFICATION_OFFICER",
  "CONTENT_MANAGER",
  "SUPPORT_ADMIN",
  "devotee",
  "hotel",
  "guide",
  "driver"
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const filtered = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold font-serif mb-0">Users & Roles</h3>
      </div>

      <div className="card bg-dark text-white border border-secondary border-opacity-25 mb-4">
        <div className="card-body">
          <h5 className="text-warning mb-3"><Shield size={18} className="me-2" /> Role Descriptions</h5>
          <div className="row g-3 small text-secondary">
            <div className="col-md-6"><strong>SUPER_ADMIN:</strong> Full platform access</div>
            <div className="col-md-6"><strong>TOURISM_AUTHORITY:</strong> Dashboard, Destinations, Analytics, Actions</div>
            <div className="col-md-6"><strong>VERIFICATION_OFFICER:</strong> Partner Management & Verification</div>
            <div className="col-md-6"><strong>CONTENT_MANAGER:</strong> Destinations, Events, Circuits</div>
            <div className="col-md-6"><strong>SUPPORT_ADMIN:</strong> Bookings, Payments, Reviews</div>
          </div>
        </div>
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
              placeholder="Search Name or Email" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select bg-dark text-white border-secondary w-auto"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            {ADMIN_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th className="text-secondary font-monospace small">USER</th>
                <th className="text-secondary font-monospace small">EMAIL</th>
                <th className="text-secondary font-monospace small">CURRENT ROLE</th>
                <th className="text-secondary font-monospace small text-end">CHANGE ROLE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="fw-bold">{u.name || 'Unknown'}</div>
                    <small className="text-secondary font-monospace">ID: {u._id.substring(18)}</small>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${ADMIN_ROLES.indexOf(u.role) < 5 ? 'bg-primary text-white' : 'bg-secondary'}`}>
                      {u.role || 'devotee'}
                    </span>
                  </td>
                  <td className="text-end">
                    <select 
                      className="form-select form-select-sm bg-dark text-white border-secondary d-inline-block"
                      style={{ width: "160px" }}
                      value={u.role || 'devotee'}
                      onChange={(e) => {
                        if(window.confirm(`Change role to ${e.target.value}?`)) {
                          updateRole(u._id, e.target.value);
                        }
                      }}
                    >
                      {ADMIN_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-secondary">
                    No users found matching criteria
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
