import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

async function bootstrap() {
  console.time("mongoConnect");
  try {
    await connectDB();
    console.timeEnd("mongoConnect");
  } catch (e) {
    console.error("Connect bootstrap failed:", e);
    process.exit(1);
  }
}

await bootstrap();

const app = express();

const corsOptions = {
  origin: "http://localhost:8080", // Your frontend's origin
  credentials: true, // Allow sending cookies
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());


app.get("/", (req, res) => res.send("RootConnect API running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
