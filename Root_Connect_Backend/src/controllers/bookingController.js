import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Guide from '../models/Guide.js';
/**
 * @desc    Create a new tour booking
 * @route   POST /api/bookings
 * @access  Private (requires user to be logged in)
 */
export const createBooking = async (req, res) => {
  try {
    // We get the logged-in user's ID from the `protect` middleware
    const userId = req.user.id;
    
    // The guide's ID must be sent from the frontend
    const { guideId, ...bookingData } = req.body;

    if (!guideId) {
      return res.status(400).json({ message: 'Guide ID is required.' });
    }

    // Check if the guide exists and is actually a guide
    const guide = await Guide.findById(guideId);
    console.log(guide,"guide found");
    if (!guide) {
      return res.status(404).json({ message: 'Selected guide not found.' });
    }

    // Create a new booking instance with all the data
    const newBooking = new Booking({
      ...bookingData,
      user: userId,
      guide: guideId,
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Your booking has been successfully created!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    // 1. Find bookings where the 'user' field matches the logged-in user's ID
    const bookings = await Booking.find({ user: req.user.id })
      // 2. Populate the 'guide' field with the name and location from the User model
      .populate('guide', 'name location')
      // 3. Sort by the most recently created booking first
      .sort({ createdAt: -1 });
    // 4. Map the results to match the exact format your frontend expects
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      visitingPlace: booking.visitingPlace,
      numberOfPeople: booking.numberOfPeople,
      tourDate: booking.tourDate,
      aadhaarNumber: booking.aadhaarNumber,
      address: booking.address,
      specialRequirements: booking.specialRequirements,
      guideName: booking.guide ? booking.guide.name : 'N/A',
      guideLocation: booking.guide ? booking.guide.location : 'N/A',
      bookedAt: booking.createdAt,
    }));

    console.log(formattedBookings, 'Formatted bookings sent to user');

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const getGuideBookings = async (req, res) => {
  try {
    // req.user.id will be the guide's ID, extracted from the token by the middleware
    const bookings = await Booking.find({ guide: req.user.id })
      .populate('user', 'name') // Optionally populate the traveller's name from the User collection
      .sort({ tourDate: 1 });   // Sort by the soonest tour date

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching guide bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings.' });
  }
};