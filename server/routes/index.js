'use strict';

const express = require('express');

const swordgen = require('../lib/swordgen');
const { dataUrl } = require('../lib/utils');


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
    .then(({ image, descs }) => dataUrl(image)
      .then(imageUrl => res.json({
        image: imageUrl,
        descs,
      })))
    .catch(next);
});

router.use('/game', require('./game'));
router.use('/story', require('./story'));
router.use(require('./app'));
