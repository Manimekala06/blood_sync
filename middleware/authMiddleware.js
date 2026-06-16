const { verifyToken } = require("../utils/auth");

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token is required"
      });
    }

    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    }); 
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "You do not have permission to access this resource"
    });
  }

  return next();
}; 

module.exports = {
  authenticate,
  authorize
};
