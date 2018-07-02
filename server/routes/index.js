'use strict';

const express = require('express');

const app = require('./app');
const swordgen = require('../swordgen');
const { dataUrl } = require('../utils');


const router = module.exports = express.Router();

router.get('/sword.png', async (req, res) => {
  const { image } = await swordgen.createRandomSword();
  res.set('Content-type', 'image/png');
  res.send(await image.png().toBuffer());
});

router.get('/sword/data', async (req, res) => {
  const { image, text } = await swordgen.createRandomSword();

  res.json({
    image: await dataUrl(image),
    desc: text,
  });
});

router.get('/sword/options', async (req, res) => {
  const optionSets = await swordgen.selectRandomPaletteOptions();
  req.session.optionSets = optionSets;

  return res.json({
    optionSets: optionSets
      .map(({ palettes }) => Object.values(palettes)
        .map(({ materials }) => Object.values(materials)
          .map(mat => mat.replace('*', ''))
          .join(' and '))),
  });
});

router.post('/sword/forge', async (req, res, next) => {
  const { optionSets } = req.session;
  if (!optionSets) {
    return next(new Error('Session not found.'));
  }
  delete req.session.optionSets;

  const { choices } = req.body;
  if (!choices) {
    return next(new Error('Choices not found.'));
  }

  const { image, text } = await swordgen.createSwordFromChoices(optionSets, choices);
  return res.json({
    image: await dataUrl(image),
    desc: text,
  });
});

router.use(app);
