const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Url = require("./models/Url"); // make sure this exists

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ ROOT ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("URL Shortener Backend is running 🚀");
});

// ✅ CREATE SHORT URL
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Long URL required" });
  }

  const shortCode = Math.random().toString(36).substring(2, 8);

  const newUrl = new Url({
    longUrl,
    shortCode,
  });

  await newUrl.save();

  res.json({
    shortUrl: `${process.env.BASE_URL}/${shortCode}`,
  });
});

// ✅ REDIRECT SHORT URL (THIS WAS MISSING)
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  const url = await Url.findOne({ shortCode });

  if (!url) {
    return res.status(404).send("URL not found");
  }

  res.redirect(url.longUrl);
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

