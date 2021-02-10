import { Request } from 'express';
import Router from 'express-promise-router';
import { Session } from 'express-session';

import story, { Story } from '../lib/story';


interface StorySession extends Session {
  story?: Story,
}

interface StoryRequest extends Request {
  session: StorySession,
}

const router = Router();
export default router;

router.get('/state', async (req: StoryRequest, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  req.session.story = req.session.story || await story.nextStage();
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.post('/continue', async (req: StoryRequest, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  req.session.story = await story.nextStage(req.session.story, req.body.choices);
  res.json({ story: story.formatStoryData(req.session.story) });
});

router.get('/start', (req: StoryRequest, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  delete req.session.story;
  res.redirect('/story');
});
