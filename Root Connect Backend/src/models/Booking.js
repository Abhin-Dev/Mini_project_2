import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guide: { type: mongoose.Schema.Types.ObjectId, ref: "Guide" }, // one of guide or product
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["pending","confirmed","cancelled"], default: "pending" },
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);
