const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Url = require("./models/Url"); // adjust path if needed

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;

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

/* 🔥 THIS IS THE MISSING PART */
app.get("/:shortCode", async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.shortCode });

  if (!url) return res.status(404).send("URL not found");

  res.redirect(url.longUrl);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
