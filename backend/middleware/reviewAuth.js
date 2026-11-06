import jwt from "jsonwebtoken";

const getToken = (req) => {
  if (req.headers.token) return req.headers.token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.split(" ")[1];
  return null;
};

// Must be logged in
export const requireAuth = (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.json({ success: false, message: "Please login first" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid or expired token" });
  }
};

// Login optional (used to know if the viewer owns a review)
export const optionalAuth = (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    }
  } catch (error) {
    // ignore: treat as guest
  }
  next();
};
