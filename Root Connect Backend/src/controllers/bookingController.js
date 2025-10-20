import Booking from "../models/Booking.js";

// Create booking (for guide or product)
export const createBooking = async (req, res) => {
  try {
    const { guide, product, startDate, endDate, totalPrice } = req.body;

    if (!guide && !product) {
      return res.status(400).json({ message: "Booking must have either guide or product" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      guide,
      product,
      startDate,
      endDate,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookings (admin only)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("guide")
      .populate("product");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("guide")
      .populate("product");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = req.body.status || booking.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete booking (admin or booking owner)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await booking.remove();
    res.json({ message: "Booking removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
