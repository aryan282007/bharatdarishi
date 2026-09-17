const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const { authenticateToken } = require("../middleware/auth");
const { sendETicketEmail } = require("../services/emailService");

// GET all hotels directly from MongoDB
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hotels from MongoDB" });
  }
});

// POST book hotel directly (Protected by JWT Authentication)
router.post("/book", authenticateToken, async (req, res) => {
  try {
    const {
      hotelId,
      hotelName,
      roomType,
      nights,
      checkInDate,
      checkOutDate,
      guestName,
      guestPhone,
      totalPrice,
      paymentId,
    } = req.body;

    const ticketCode = `BHARAT-STAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const calcCheckOut =
      checkOutDate ||
      new Date(
        new Date(checkInDate || Date.now()).getTime() +
          (nights || 1) * 86400000,
      )
        .toISOString()
        .substring(0, 10);

    const booking = new Booking({
      userId: req.user.userId,
      guestName: guestName || req.user.name || "Guest Traveler",
      guestEmail: req.user.email || "guest@bharatdarshi.gov.in",
      guestPhone: guestPhone || req.user.contactPhone || "+91 98765 43210",
      hotelName: hotelName || "Bharat Stay Verified Hotel",
      roomType: roomType || "Deluxe Suite",
      checkInDate: checkInDate || new Date().toISOString().substring(0, 10),
      checkOutDate: calcCheckOut,
      nights: nights || 1,
      totalPrice: totalPrice || 2500,
      ticketCode,
      bookingRef: ticketCode,
      status: "confirmed",
    });

    await booking.save();

    // Trigger Nodemailer E-Ticket email dispatch
    sendETicketEmail({
      toEmail: req.user.email || "guest@bharatdarshi.gov.in",
      ticketType: "HOTEL STAY RESERVATION E-TICKET",
      ticketDetails: {
        passId: ticketCode,
        primaryName: booking.guestName,
        contactPhone: booking.guestPhone,
        bookingDate: booking.checkInDate,
        hotelName: booking.hotelName,
        roomType: booking.roomType,
        numberOfPersons: 1,
        totalAmount: booking.totalPrice,
      },
    }).catch((emailErr) => {
      console.warn("⚠️ Nodemailer email dispatch warning:", emailErr.message);
    });

    res.json({
      success: true,
      booking,
      ticketCode,
      message: `Reservation confirmed for ${booking.guestName}! E-Ticket emailed successfully.`,
    });
  } catch (err) {
    console.error("Hotel reservation MongoDB save error:", err);
    res.status(500).json({ error: "Hotel reservation failed. " + err.message });
  }
});

module.exports = router;
