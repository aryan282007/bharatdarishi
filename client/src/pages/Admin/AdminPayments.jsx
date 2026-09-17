import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, Search, DollarSign, CheckCircle2, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/admin/transactions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTransactions(res.data);
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.partnerId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge bg-success bg-opacity-25 text-success">Completed</span>;
      case 'failed': return <span className="badge bg-danger bg-opacity-25 text-danger">Failed</span>;
      case 'refunded': return <span className="badge bg-secondary bg-opacity-25 text-secondary">Refunded</span>;
      default: return <span className="badge bg-warning bg-opacity-25 text-warning">Pending</span>;
    }
  };

  const totalRevenue = transactions.filter(t => t.paymentStatus === 'completed').reduce((sum, t) => sum + (t.totalPrice || 0), 0);
  const totalRefunds = transactions.filter(t => t.paymentStatus === 'refunded').reduce((sum, t) => sum + (t.totalPrice || 0), 0);

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
        <h3 className="text-white fw-bold font-serif mb-0">Payments & Transactions</h3>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-dark text-white border-success border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Total Revenue</span>
                <DollarSign className="text-success" size={16} />
              </div>
              <h3 className="fw-bold mt-2">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-white border-warning border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Pending Payments</span>
                <Clock className="text-warning" size={16} />
              </div>
              <h3 className="fw-bold mt-2">{transactions.filter(t => !['completed', 'failed', 'refunded'].includes(t.paymentStatus)).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-white border-danger border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Failed Transactions</span>
                <XCircle className="text-danger" size={16} />
              </div>
              <h3 className="fw-bold mt-2">{transactions.filter(t => t.paymentStatus === 'failed').length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-dark text-white border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <span className="text-secondary small">Total Refunded</span>
                <CreditCard className="text-secondary" size={16} />
              </div>
              <h3 className="fw-bold mt-2">₹{totalRefunds.toLocaleString()}</h3>
            </div>
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
              placeholder="Search ID, Tourist or Partner" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-select bg-dark text-white border-secondary w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th className="text-secondary font-monospace small">TXN ID</th>
                <th className="text-secondary font-monospace small">DATE</th>
                <th className="text-secondary font-monospace small">TOURIST</th>
                <th className="text-secondary font-monospace small">DESTINATION / PARTNER</th>
                <th className="text-secondary font-monospace small">AMOUNT</th>
                <th className="text-secondary font-monospace small">METHOD</th>
                <th className="text-secondary font-monospace small">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id}>
                  <td className="font-monospace small">{t._id.substring(18)}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div>{t.userId?.name || 'Unknown'}</div>
                    <small className="text-secondary">{t.userId?.email}</small>
                  </td>
                  <td>
                    <div>{t.placeId?.name || 'N/A'}</div>
                    <small className="text-secondary">{t.partnerId?.name || 'No Partner'}</small>
                  </td>
                  <td className="fw-bold">₹{t.totalPrice}</td>
                  <td><span className="badge bg-secondary">{t.paymentMethod || 'Credit Card'}</span></td>
                  <td>{getStatusBadge(t.paymentStatus)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-secondary">
                    No transactions found
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
