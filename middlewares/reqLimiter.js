const rateLimit = require("express-rate-limit");

// batasi req
const reqLimiter = rateLimit({
  windowMs: 7 * 1000, // 7 detik
  max: 1,
  message: "Terlalu banyak permintaan, coba lagi setelah beberapa detik.",
});

module.exports = reqLimiter;
