import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  description: String,
  category: String,
  price: Number,
  images: [String],
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);
