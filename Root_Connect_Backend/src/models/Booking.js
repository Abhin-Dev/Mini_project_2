import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Link to the user who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Link to the guide for this tour
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guide',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    visitingPlace: {
      type: String,
      required: [true, 'Visiting place is required'],
    },
    numberOfPeople: {
      type: String, // Stored as string to accommodate '6+'
      required: [true, 'Number of people is required'],
    },
    tourDate: {
      type: Date,
      required: [true, 'Tour date is required'],
    },
    aadhaarNumber: {
      type: String,
      required: [true, 'Aadhaar number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    specialRequirements: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model('Booking', bookingSchema);
