const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false },
  hotelPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, default: '' },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  nights: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  roomType: { type: String },
  hotelName: { type: String },
  roomNumber: { type: String },
  bookingRef: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'], 
    default: 'confirmed' 
  },
  // Added for payment / general tracking
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }
}, { timestamps: true, strict: false });

// Auto-generate booking reference before save
bookingSchema.pre("save", async function () {
  if (!this.bookingRef) {
    this.bookingRef = "HTL-" + Math.floor(100000 + Math.random() * 900000);
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
