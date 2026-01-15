import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortid from "shortid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String,
});

const Url = mongoose.model("Url", urlSchema);


app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Long URL required" });
  }

  const shortCode = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortCode,
  });

  await newUrl.save();

  res.json({ shortCode });
});


app.get("/:code", async (req, res) => {
  const { code } = req.params;

  const url = await Url.findOne({ shortCode: code });

  if (!url) {
    return res.status(404).send("URL not found");
  }

  res.redirect(url.longUrl);
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
