import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", auth, createBooking);            // user creates a booking
router.get("/my", auth, getMyBookings);           // user’s own bookings
router.get("/", auth, getBookings);               // admin only (filter inside controller if needed)
router.put("/:id/status", auth, updateBookingStatus); // admin updates status
router.delete("/:id", auth, deleteBooking);       // admin or user can cancel

export default router;
