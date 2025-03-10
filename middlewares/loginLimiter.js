const rateLimit = require("express-rate-limit");

// Batasi login agar tidak bisa brute force
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 5,
  message: "Terlalu banyak percobaan login, coba lagi nanti.",
});

module.exports = loginLimiter;
