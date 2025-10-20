import express from "express";
import {
  registerGuide, getGuides, getGuideById, updateGuide, deleteGuide,loginGuide
} from "../controllers/guideController.js";

const router = express.Router();

// Public routes
router.post("/register", registerGuide);  // Register new guide (no auth required)
router.get("/", getGuides);               // Get all guides with optional filtering
router.get("/:id", getGuideById);         // Get guide by ID

router.post('/login', loginGuide);

// Protected routes (if you want to add auth later)
// router.put("/:id", auth, updateGuide);     // Update guide
// router.delete("/:id", auth, deleteGuide);  // Delete guide

// For now, keeping update and delete as public (you can add auth later)
router.put("/:id", updateGuide);     // Update guide
router.delete("/:id", deleteGuide);  // Delete guide

export default router;
