const express = require("express");
const shortid = require("shortid");
const Url = require("./models");

const router = express.Router();


router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "URL required" });
  }

  const shortId = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortId,
  });

  await newUrl.save();

  res.json({
    shortUrl: `${process.env.BASE_URL}/${shortId}`,
  });
});

module.exports = router;

