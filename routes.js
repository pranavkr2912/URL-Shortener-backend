const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Url =
  mongoose.models.Url ||
  mongoose.model(
    "Url",
    new mongoose.Schema({
      longUrl: String,
      shortCode: String,
    })
  );

router.post("/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "longUrl missing" });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);

    await Url.create({ longUrl, shortCode });

    const baseUrl = process.env.BASE_URL;

    if (!baseUrl) {
      return res.status(500).json({ error: "BASE_URL not set" });
    }

    res.status(200).json({
      shortUrl: `${baseUrl}/${shortCode}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

