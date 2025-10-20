import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Guide from '../models/Guide.js';

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No auth token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 1. Decode the token to get the ID and role
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let foundUser;

    // 2. Based on the role in the token, search the correct collection
    if (decoded.role === 'guide') {
      foundUser = await Guide.findById(decoded.id);
    } else {
      // For any other role (e.g., 'user', 'admin'), check the User collection
      foundUser = await User.findById(decoded.id).select("-password");
    }

    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    
    // 3. Attach the found user or guide object to the request
    req.user = foundUser;
    // We can also explicitly attach the role from the token for consistency
    req.user.role = decoded.role; 

    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const protectGuide = (req, res, next) => {
  protect(req, res, () => {
    if (req.user && req.user.role === 'guide') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized. Access restricted to guides only.' });
    }
  });
};
