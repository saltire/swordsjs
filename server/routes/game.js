'use strict';

const { Router } = require('express');
const { addAsync } = require('@awaitjs/express');

const swordgen = require('../lib/swordgen');
const { dataUrl } = require('../lib/utils');


const router = module.exports = addAsync(Router());

router.getAsync('/options', async (req, res) => {
  const optionSets = await swordgen.selectRandomPaletteOptions();
  req.session.optionSets = optionSets;
  res.json({
    optionSets: optionSets
      .map(({ palettes }) => Object.values(palettes)
        .map(({ materials }) => Object.values(materials)
          .map(mat => mat.replace('*', ''))
          .join(' and '))),
  });
});

router.postAsync('/forge', async (req, res) => {
  const { optionSets } = req.session;
  if (!optionSets) {
    throw new Error('Session not found.');
  }
  delete req.session.optionSets;

  const { choices } = req.body;
  if (!choices) {
    throw new Error('Choices not found.');
  }

  const { image, descs } = await swordgen.createSwordFromChoices(optionSets, choices);
  const imageUrl = await dataUrl(image);
  res.json({
    image: imageUrl,
    descs,
  });
});
