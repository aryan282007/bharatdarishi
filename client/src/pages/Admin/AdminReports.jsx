import React, { useState } from "react";
import axios from "axios";
import { FileText, Download, Filter, Map, Users, Ticket, CreditCard, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReports() {
  const [loading, setLoading] = useState(false);

  const downloadCSV = (filename, data) => {
    if (!data || !data.length) {
      toast.error("No data available for this report.");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          let val = row[header];
          if (val === null || val === undefined) val = "";
          else if (typeof val === 'object') val = JSON.stringify(val);
          // Escape quotes and wrap in quotes
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReport = async (type) => {
    setLoading(true);
    try {
      let endpoint = '';
      let filename = '';
      
      switch(type) {
        case 'destinations':
          endpoint = '/api/admin/destinations';
          filename = 'destinations_report';
          break;
        case 'bookings':
          endpoint = '/api/admin/bookings';
          filename = 'bookings_report';
          break;
        case 'transactions':
          endpoint = '/api/admin/transactions';
          filename = 'transactions_report';
          break;
        case 'partners':
          endpoint = '/api/admin/partners/verification';
          filename = 'partners_report';
          break;
        case 'actions':
          endpoint = '/api/admin/actions';
          filename = 'govt_actions_report';
          break;
        default:
          throw new Error('Unknown report type');
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Clean up nested objects for CSV
      const flatData = res.data.map(item => {
        const flat = { ...item };
        if (flat.userId) flat.userName = flat.userId.name || flat.userId;
        if (flat.placeId) flat.placeName = flat.placeId.name || flat.placeId;
        if (flat.destination) flat.destinationName = flat.destination.name || flat.destination;
        if (flat.partnerId) flat.partnerName = flat.partnerId.name || flat.partnerId;
        delete flat.userId;
        delete flat.placeId;
        delete flat.destination;
        delete flat.partnerId;
        delete flat.__v;
        return flat;
      });

      downloadCSV(filename, flatData);
      toast.success("Report generated successfully!");

    } catch (err) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold font-serif mb-0">System Reports</h3>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white border border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <Map className="text-info me-2" size={20} />
                <h5 className="mb-0 fw-bold">Destinations Report</h5>
              </div>
              <p className="text-secondary small mb-4">Export a complete list of all destinations, their status, categories, and geographic coordinates.</p>
              <button 
                onClick={() => generateReport('destinations')}
                disabled={loading}
                className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
              >
                <Download size={16} className="me-2" /> Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white border border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <Ticket className="text-success me-2" size={20} />
                <h5 className="mb-0 fw-bold">Bookings Report</h5>
              </div>
              <p className="text-secondary small mb-4">Export all tourist bookings including dates, statuses, and associated destination IDs.</p>
              <button 
                onClick={() => generateReport('bookings')}
                disabled={loading}
                className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center"
              >
                <Download size={16} className="me-2" /> Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white border border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <CreditCard className="text-warning me-2" size={20} />
                <h5 className="mb-0 fw-bold">Transactions Report</h5>
              </div>
              <p className="text-secondary small mb-4">Export financial data, payment statuses, and revenue aggregates across the platform.</p>
              <button 
                onClick={() => generateReport('transactions')}
                disabled={loading}
                className="btn btn-outline-warning w-100 d-flex align-items-center justify-content-center"
              >
                <Download size={16} className="me-2" /> Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white border border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <Users className="text-primary me-2" size={20} />
                <h5 className="mb-0 fw-bold">Partners Report</h5>
              </div>
              <p className="text-secondary small mb-4">Export a list of all local businesses, guides, and hotels along with their verification status.</p>
              <button 
                onClick={() => generateReport('partners')}
                disabled={loading}
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
              >
                <Download size={16} className="me-2" /> Download CSV
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark text-white border border-secondary border-opacity-25 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <ShieldAlert className="text-danger me-2" size={20} />
                <h5 className="mb-0 fw-bold">Govt. Actions Report</h5>
              </div>
              <p className="text-secondary small mb-4">Export operational tasks, resolution statuses, deadlines, and assigned officers.</p>
              <button 
                onClick={() => generateReport('actions')}
                disabled={loading}
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
              >
                <Download size={16} className="me-2" /> Download CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
