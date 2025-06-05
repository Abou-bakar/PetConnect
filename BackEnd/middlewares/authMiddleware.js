const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // 1. Check for Bearer token format
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or invalid" });
  }

  // 2. Extract token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = decoded;

    // 5. Remove admin check here (do it in routes if needed)
    next();
  } catch (err) {
    // 6. Handle specific JWT errors
    const errorMessage =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";

    return res.status(401).json({ message: errorMessage });
  }
};

module.exports = authMiddleware;
