import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"] 
  },
  location: { 
    type: String, 
    required: [true, "Location is required"] 
  },

  // --- NEW FIELDS ADDED/UPDATED BELOW ---
  description: { // Renamed from 'bio' to match form's 'description'
    type: String,
    required: [true, "Guide description is required"]
  },
  specialties: { // New field for comma-separated specialties string
    type: String,
    required: [true, "Specialties are required"]
  },
  price: { // New field for the daily rate string
    type: String,
    required: [true, "Daily rate is required"]
  },
  aadharCard: { // New unique field for verification
    type: String,
    required: [true, "Aadhar Card number is required"],
    unique: true, // Crucial to prevent duplicate guide registration using the same ID
    minlength: 12,
    maxlength: 14 
  },
  // --- END NEW FIELDS ---
  
  languages: [String],
  experience: Number,
  profileImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
guideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Guide", guideSchema);
