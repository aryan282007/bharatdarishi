import React from "react";
import { Settings, User, Bell, Shield, Globe } from "lucide-react";

export default function AdminSettings({ user }) {
  return (
    <div className="p-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white fw-bold font-serif mb-0">Platform Settings</h3>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          {/* Profile Section */}
          <div className="card bg-dark text-white border border-secondary border-opacity-25 mb-4">
            <div className="card-header border-secondary border-opacity-25 bg-transparent p-3 d-flex align-items-center gap-2">
              <User size={18} className="text-warning" />
              <h5 className="mb-0 fw-bold">My Profile</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-secondary small mb-1">Full Name</label>
                <input type="text" className="form-control bg-black text-white border-secondary" defaultValue={user?.name || ''} readOnly />
              </div>
              <div className="mb-3">
                <label className="text-secondary small mb-1">Email Address</label>
                <input type="email" className="form-control bg-black text-white border-secondary" defaultValue={user?.email || ''} readOnly />
              </div>
              <div className="mb-3">
                <label className="text-secondary small mb-1">Assigned Role</label>
                <input type="text" className="form-control bg-black text-white border-secondary fw-bold text-primary" defaultValue={user?.role || 'Admin'} readOnly />
              </div>
              <button className="btn btn-outline-warning w-100">Update Profile</button>
            </div>
          </div>
          
          {/* Security */}
          <div className="card bg-dark text-white border border-secondary border-opacity-25">
            <div className="card-header border-secondary border-opacity-25 bg-transparent p-3 d-flex align-items-center gap-2">
              <Shield size={18} className="text-danger" />
              <h5 className="mb-0 fw-bold">Security</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-secondary w-100 mb-2">Change Password</button>
              <button className="btn btn-outline-secondary w-100">Enable 2FA (Coming Soon)</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          {/* Notifications Configuration */}
          <div className="card bg-dark text-white border border-secondary border-opacity-25 mb-4">
            <div className="card-header border-secondary border-opacity-25 bg-transparent p-3 d-flex align-items-center gap-2">
              <Bell size={18} className="text-info" />
              <h5 className="mb-0 fw-bold">Notification Preferences</h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="notif1" defaultChecked />
                <label className="form-check-label" htmlFor="notif1">Email me when a new Partner Verification is requested</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="notif2" defaultChecked />
                <label className="form-check-label" htmlFor="notif2">Email me for Critical Government Action deadlines</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" id="notif3" />
                <label className="form-check-label" htmlFor="notif3">Weekly digest of Tourism Analytics</label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="notif4" defaultChecked />
                <label className="form-check-label" htmlFor="notif4">Alert me when a user reports inappropriate content/reviews</label>
              </div>
              <button className="btn btn-warning mt-4 px-4">Save Preferences</button>
            </div>
          </div>

          {/* Platform Configuration */}
          <div className="card bg-dark text-white border border-secondary border-opacity-25">
            <div className="card-header border-secondary border-opacity-25 bg-transparent p-3 d-flex align-items-center gap-2">
              <Globe size={18} className="text-success" />
              <h5 className="mb-0 fw-bold">Platform Configuration</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-secondary small mb-1">Platform Name</label>
                  <input type="text" className="form-control bg-black text-white border-secondary" defaultValue="BharatDarshi" />
                </div>
                <div className="col-md-6">
                  <label className="text-secondary small mb-1">Support Contact Email</label>
                  <input type="text" className="form-control bg-black text-white border-secondary" defaultValue="support@bharatdarshi.gov.in" />
                </div>
                <div className="col-12">
                  <label className="text-secondary small mb-1">Default Base Currency</label>
                  <select className="form-select bg-black text-white border-secondary">
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                  </select>
                </div>
                <div className="col-12 mt-4">
                  <button className="btn btn-success px-4">Save Configuration</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
