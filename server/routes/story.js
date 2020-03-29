'use strict';

const { Router } = require('express');
const { addAsync } = require('@awaitjs/express');

const { nextStage, formatStoryData } = require('../lib/story');


const router = module.exports = addAsync(Router());

router.getAsync('/state', async (req, res) => {
  const story = req.session.story || await nextStage();
  req.session.story = story;
  res.json({ story: formatStoryData(req.session.story) });
});

router.postAsync('/continue', async (req, res) => {
  const story = await nextStage(req.session.story, req.body);
  req.session.story = story;
  res.json({ story: formatStoryData(req.session.story) });
});

router.get('/start', (req, res) => {
  delete req.session.story;
  res.redirect('/story');
});
