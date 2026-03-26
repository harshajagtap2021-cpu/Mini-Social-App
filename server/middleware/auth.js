import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** Verifies JWT and sets `req.userId` for downstream handlers. */
export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

/** Loads `req.user` (username + email) when `req.userId` is present. */
export async function attachUser(req, res, next) {
  if (!req.userId) return next();
  try {
    const user = await User.findById(req.userId).select("username email");
    req.user = user;
  } catch {
    req.user = null;
  }
  next();
}
