const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/jwt");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Akses ditolak. Token tidak ada." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token telah kedaluwarsa. Silakan login kembali.",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid." });
  }
};

module.exports = verifyToken;
