'use strict';

const express = require('express');

const app = require('./app');
const swordgen = require('../swordgen');
const { dataUrl } = require('../utils');


const router = module.exports = express.Router();

router.get('/sword.png', (req, res, next) => {
  swordgen.createRandomSword()
    .then(({ image }) => image.png().toBuffer())
    .then((buffer) => {
      res.set('Content-type', 'image/png');
      res.send(buffer);
    })
    .catch(next);
});

router.get('/sword/data', (req, res, next) => {
  swordgen.createRandomSword()
    .then(({ image, text }) => dataUrl(image)
      .then(imageUrl => res.json({
        image: imageUrl,
        desc: text,
      })))
    .catch(next);
});

router.get('/sword/options', (req, res, next) => {
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

router.post('/sword/forge', (req, res, next) => {
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

router.use(app);
