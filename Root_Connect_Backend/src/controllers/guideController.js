import Guide from "../models/Guide.js";
import jwt from "jsonwebtoken";

// Register a new guide
export const registerGuide = async (req, res) => {
  try {
  console.log("Request body:", req.body); // Debugging line to check incoming data
    // UPDATED DESTRUCTURING: Using keys from the React form's formData
    const { 
      name, 
      email, 
      phone, 
      location, 
      languages, 
      experience, 
      description, // Mapped from form's 'description'
      specialties, // NEW FIELD from form
      price,       // NEW FIELD from form
      aadharCard, // NEW FIELD from form
      profileImage // Kept for future image upload implementation
    } = req.body;

    // UPDATED VALIDATION: Check all required fields from the front-end form
    if (!name || !email || !location || !description || !specialties || !price || !aadharCard || !languages || languages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Email, Location, Description, Specialties, Price, Aadhar Card, or Languages)"
      });
    }

    // Check if guide with email already exists (using unique index)
    const existingGuide = await Guide.findOne({ email });
    if (existingGuide) {
      return res.status(409).json({
        success: false,
        message: "A guide with this email already exists"
      });
    }

    // Create new guide
    const guide = await Guide.create({
      name,
      email,
      phone,
      location,
      languages,
      experience,
      description, // Saved to MongoDB
      specialties, // Saved to MongoDB
      price,       // Saved to MongoDB
      aadharCard,  // Saved to MongoDB
      profileImage // Saved to MongoDB
    });

    res.status(201).json({
      success: true,
      data: guide,
      message: "Guide registered successfully"
    });

  } catch (error) {
    console.error("Error registering guide:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }

    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A guide with this email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all guides with optional filtering
export const getGuides = async (req, res) => {
  try {
    const { location, language, name } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (language) {
      filter.languages = { $in: [new RegExp(language, 'i')] };
    }
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const guides = await Guide.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: guides,
      count: guides.length
    });

  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get guide by ID
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found"
      });
    }

    res.status(200).json({
      success: true,
      data: guide
    });

  } catch (error) {
    console.error("Error fetching guide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update guide
export const updateGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found"
      });
    }

    // Check if email is being updated and if it already exists
    if (req.body.email && req.body.email !== guide.email) {
      const existingGuide = await Guide.findOne({ email: req.body.email });
      if (existingGuide) {
        return res.status(409).json({
          success: false,
          message: "A guide with this email already exists"
        });
      }
    }

    Object.assign(guide, req.body);
    await guide.save();

    res.status(200).json({
      success: true,
      data: guide,
      message: "Guide updated successfully"
    });

  } catch (error) {
    console.error("Error updating guide:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A guide with this email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete guide
export const deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Guide deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting guide:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const createToken = (guideId) => {
  return jwt.sign({ id: guideId, role: 'guide' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const loginGuide = async (req, res) => {
  const { email, aadharNumber } = req.body;

  try {
    console.log("Login attempt for guide with email:", email);
    // 1. Find the guide by their email address
    const guide = await Guide.findOne({ email });

    // 2. Check if a guide was found and if the Aadhaar number matches
    // Note: We perform a simple string comparison for the Aadhaar number
    if (!guide || guide.aadharCard.replace(/\s/g, "") !== aadharNumber.replace(/\s/g, "")) {
      return res.status(401).json({ message: 'Invalid email or Aadhaar number.' });
    }

    // 3. If credentials are correct, create a token
    const token = createToken(guide._id);

    // 4. Send the token and guide data back to the client
    res.status(200).json({
      token,
      guide: {
        id: guide._id,
        name: guide.name,
        email: guide.email,
        location: guide.location,
      },
    });
  } catch (error) {
    console.error('Guide login error:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
