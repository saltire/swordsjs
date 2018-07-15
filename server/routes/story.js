'use strict';

const express = require('express');

// const swordgen = require('../swordgen');
// const { dataUrl } = require('../utils');


const router = module.exports = express.Router();

router.get('/state', (req, res) => {
  res.json({ state: {} });
});
