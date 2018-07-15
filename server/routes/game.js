'use strict';

const express = require('express');

const swordgen = require('../lib/swordgen');
const { dataUrl } = require('../lib/utils');


const router = module.exports = express.Router();

router.get('/options', (req, res, next) => {
  swordgen.selectRandomPaletteOptions()
    .then((optionSets) => {
      req.session.optionSets = optionSets;
      res.json({
        optionSets: optionSets
          .map(({ palettes }) => Object.values(palettes)
            .map(({ materials }) => Object.values(materials)
              .map(mat => mat.replace('*', ''))
              .join(' and '))),
      });
    })
    .catch(next);
});

router.post('/forge', (req, res, next) => {
  const { optionSets } = req.session;
  if (!optionSets) {
    return next(new Error('Session not found.'));
  }
  delete req.session.optionSets;

  const { choices } = req.body;
  if (!choices) {
    return next(new Error('Choices not found.'));
  }

  return swordgen.createSwordFromChoices(optionSets, choices)
    .then(({ image, text }) => dataUrl(image)
      .then(imageUrl => res.json({
        image: imageUrl,
        desc: text,
      })))
    .catch(next);
});
