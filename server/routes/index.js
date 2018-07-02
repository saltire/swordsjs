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

router.get('/sword/choices', async (req, res) => {
  const choiceSets = await swordgen.selectRandomPaletteChoices();
  res.json({
    choiceSets: choiceSets
      .map(({ choices }) => Object.values(choices)
        .map(({ materials }) => Object.values(materials)
          .map(mat => mat.replace('*', ''))
          .join(' and '))),
  });
});

router.use(app);
