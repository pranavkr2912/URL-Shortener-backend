const express = require('express');
const shortid = require('shortid');
const mongoose = require('mongoose');

const router = express.Router();

// schema
const urlSchema = new mongoose.Schema({
  longUrl: String,
  shortCode: String
});

const Url = mongoose.model('Url', urlSchema);

// test route
router.get('/', (req, res) => {
  res.send('Backend working');
});

// create short url
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  const shortCode = shortid.generate();

  const newUrl = new Url({
    longUrl,
    shortCode
  });

  await newUrl.save();

  res.json({
    shortUrl: `http://localhost:5000/api/${shortCode}`
  });
});

// redirect
router.get('/:code', async (req, res) => {
  const url = await Url.findOne({ shortCode: req.params.code });

  if (url) {
    return res.redirect(url.longUrl);
  } else {
    return res.status(404).send('URL not found');
  }
});

module.exports = router;
