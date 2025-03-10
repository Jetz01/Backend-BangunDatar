const express = require("express");
const admin = require("firebase-admin");
const db = require("../config/firebase");
const verifyToken = require("../middlewares/authMiddleware");
const reqLimiter = require("../middlewares/reqLimiter");

const router = express.Router();

// Ambil semua data siswa
router.get("/", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("siswa").get();
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "Tidak ada data siswa yang ditemukan" });
    }

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ambil data satu siswa
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("siswa").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Siswa tidak ditemukan" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tambah data siswa
router.post("/", reqLimiter, async (req, res) => {
  try {
    const { nama, kelas, sekolah, skor_bangun_datar, skor_luas_keliling } =
      req.body;

    if (!nama || !kelas || !sekolah) {
      return res
        .status(400)
        .json({ error: "nama, kelas, dan sekolah wajib diisi" });
    }

    const newDoc = await db.collection("siswa").add({
      nama,
      kelas,
      sekolah,
      skor_bangun_datar: String(skor_bangun_datar || "0"),
      skor_luas_keliling: String(skor_luas_keliling || "0"),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: null,
    });

    return res
      .status(201)
      .json({ id: newDoc.id, message: "Data berhasil ditambahkan" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Edit data siswa berdasarkan ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("siswa").doc(id);
    const doc = await docRef.get();

    // Jika data tidak ditemukan
    if (!doc.exists) {
      return res.status(404).json({ error: "Siswa tidak ditemukan" });
    }

    // Ambil data dari body request
    const { nama, kelas, sekolah, skor_bangun_datar, skor_luas_keliling } =
      req.body;

    // Validasi input wajib
    if (!nama || !kelas || !sekolah) {
      return res
        .status(400)
        .json({ error: "Nama, kelas, dan sekolah wajib diisi" });
    }

    // Update data siswa di Firestore
    await docRef.update({
      nama,
      kelas,
      sekolah,
      skor_bangun_datar:
        skor_bangun_datar !== undefined
          ? String(skor_bangun_datar)
          : doc.data().skor_bangun_datar,
      skor_luas_keliling:
        skor_luas_keliling !== undefined
          ? String(skor_luas_keliling)
          : doc.data().skor_luas_keliling,
      created_at: doc.data().created_at,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Data siswa berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Hapus data siswa
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("siswa").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Siswa tidak ditemukan" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Siswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
