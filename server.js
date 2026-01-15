const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

// Root check
app.get("/", (req, res) => {
  res.send("URL Shortener Backend is running 🚀");
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

// API
app.use("/api", routes);

// Redirect
app.get("/:shortCode", async (req, res) => {
  try {
    const Url = mongoose.model("Url");
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) return res.status(404).send("URL not found");

    res.redirect(url.longUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


