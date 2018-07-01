'use strict';

const express = require('express');

const app = require('./app');
const swordgen = require('../swordgen');


const router = module.exports = express.Router();

router.get('/sword.png', async (req, res) => {
  const { image } = await swordgen.createRandomSword();
  res.set('Content-type', 'image/png');
  res.send(await image.png().toBuffer());
});

router.get('/sword/data', async (req, res) => {
  const { image, text } = await swordgen.createRandomSword();
  res.json({
    image: `data:image/png;base64,${(await image.png().toBuffer()).toString('base64')}`,
    desc: text,
  });
});

router.use(app);
