'use strict';

const { Router } = require('@awaitjs/express');

const story = require('../lib/story');


const router = module.exports = Router();

router.getAsync('/state', async (req, res) => {
  req.session.story = req.session.story || await story.nextStage();
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.postAsync('/continue', async (req, res) => {
  req.session.story = await story.nextStage(req.session.story, req.body);
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.get('/start', (req, res) => {
  delete req.session.story;
  res.redirect('/story');
});
