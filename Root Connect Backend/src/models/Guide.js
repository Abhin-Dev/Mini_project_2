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
  languages: [String],
  experience: Number,
  bio: String,
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
