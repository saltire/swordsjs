'use strict';

const express = require('express');

const { nextStage, formatStoryData } = require('../lib/story');


const router = module.exports = express.Router();

router.get('/state', (req, res, next) => {
  Promise.resolve(req.session.story || nextStage())
    .then((story) => {
      req.session.story = story;
      res.json({ story: formatStoryData(req.session.story) });
    })
    .catch(next);
});

router.post('/continue', (req, res, next) => {
  nextStage(req.session.story, req.body)
    .then((story) => {
      req.session.story = story;
      res.json({ story: formatStoryData(req.session.story) });
    })
    .catch(next);
});

router.get('/start', (req, res) => {
  delete req.session.story;
  res.redirect('/story');
});
