import Guide from "../models/Guide.js";

// Register a new guide
export const registerGuide = async (req, res) => {
  try {
    const { name, email, phone, location, languages, experience, bio, profileImage } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, email, phone, and location are required"
      });
    }

    // Check if guide with email already exists
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
      languages: languages || [],
      experience,
      bio,
      profileImage
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
