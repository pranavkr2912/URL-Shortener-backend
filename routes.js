const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Inline model (NO separate models folder needed)
const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
});

const Url = mongoose.model("Url", UrlSchema);

// ✅ CREATE SHORT URL
router.post("/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: "Long URL required" });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    const url = new Url({ longUrl, shortCode });
    await url.save();

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


