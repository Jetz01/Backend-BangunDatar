require("dotenv").config();
const express = require("express");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authRoutes = require("./routes/authRoutes");
const siswaRoutes = require("./routes/siswaRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(express.json());

// Gunakan rute
app.use("/auth", authRoutes);
app.use("/siswa", siswaRoutes);

// Middleware untuk menangani 404 jika rute tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
