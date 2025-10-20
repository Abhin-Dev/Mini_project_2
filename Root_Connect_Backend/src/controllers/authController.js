import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role , phone = '' , location } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role ,phone ,location });
    const token = createToken(user);
    const { password: _, ...userSafe } = user.toObject();
    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 2. Find the user by either their email OR their phone number
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    console.log(password,user.password,"Comparison result:", ok);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    const { password: _, ...userSafe } = user.toObject();
    res.json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
