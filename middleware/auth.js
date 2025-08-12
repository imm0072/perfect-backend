const constant = require("../constant");
const { verifyJWT } = require("../util/jwt");

module.exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.headers["authorization"]?.split(" ")?.[1];
    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const payload = await verifyJWT(req, token, constant.ACCESS_TOKEN);
    if (!payload) {
      return res.status(401).json({ message: "Invalid or expired access token" });
    }

    // Attach user payload to request for downstream usage
    req.user = payload;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports.isAuthorized = (role) => (req, res, next) => {
  if (!req.user || (role && req.user.role !== role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
