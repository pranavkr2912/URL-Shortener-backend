const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Prevent model overwrite on hot reload
const Url =
  mongoose.models.Url ||
  mongoose.model(
    "Url",
    new mongoose.Schema({
      longUrl: { type: String, required: true },
      shortCode: { type: String, required: true },
    })
  );

// POST /api/shorten
router.post("/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "Long URL is required" });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    await Url.create({ longUrl, shortCode });

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



