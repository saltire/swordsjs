'use strict';

import { Router } from '@awaitjs/express';

import story from '../lib/story';


const router = Router();
export default router;

router.getAsync('/state', async (req, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  req.session.story = req.session.story || await story.nextStage();
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.postAsync('/continue', async (req, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  req.session.story = await story.nextStage(req.session.story, req.body);
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.get('/start', (req, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  delete req.session.story;
  res.redirect('/story');
});
