const mongoose = require('mongoose');

const governmentActionSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  issue: { type: String, required: true },
  department: { type: String, required: true },
  recommendation: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  deadline: { type: Date, required: true },
  assignedOfficer: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Assigned', 'In Progress', 'Resolved'], 
    default: 'Assigned' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  history: [{
    status: String,
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true, strict: false });

module.exports = mongoose.model('GovernmentAction', governmentActionSchema);