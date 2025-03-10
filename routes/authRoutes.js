const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../config/jwt");
const loginLimiter = require("../middlewares/loginLimiter");

const router = express.Router();

// Endpoint login
router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res
      .status(404)
      .json({ success: false, message: "Username tidak terdaftar" });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Password salah" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "4h" });

  return res.json({ success: true, token: token });
});

module.exports = router;
