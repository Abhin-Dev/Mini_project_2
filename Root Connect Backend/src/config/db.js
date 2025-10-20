// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log("MONGO_URI length:", (uri || "").length);
    mongoose.set("debug", { shell: true });
    mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
    mongoose.connection.on("connected", () => console.log("✅ Mongoose connected"));
    mongoose.connection.on("disconnected", () => console.warn("⚠️  Mongoose disconnected"));

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      family: 4,
      retryWrites: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
