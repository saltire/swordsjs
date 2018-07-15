'use strict';

const express = require('express');

const { random } = require('../lib/utils');


const stages = {
  request: 'A customer enters the shop. “I need a sword that $effect,” they say.',
  materials: 'You gather materials from the back of the shop, narrowing them down to a couple of choices.',
  forge: 'You shape the metal into a blade, and decorate it with gems.',
  deliver: 'The customer takes the blade, says “Thank you,” and leaves.',
};
const stageIds = Object.keys(stages);

const effects = [
  'shoots fire',
  'glows in the dark',
  'makes me look rich',
  'eats the souls of my victims',
];

function nextStage(currentStory) {
  const story = Object.assign({}, currentStory || {});

  // Advance to the next stage, or go back to the first if finished.
  story.stage = stageIds[(stageIds.indexOf(story.stage) + 1) % stageIds.length];

  // Build text for this stage.
  story.text = stages[story.stage];
  if (story.stage === 'request') {
    story.text = story.text.replace('$effect', random(effects));
  }

  return story;
}

const router = module.exports = express.Router();

router.get('/state', (req, res) => {
  if (!req.session.story) {
    req.session.story = nextStage();
  }

  const { story } = req.session;

  res.json({ text: story.text });
});

router.post('/continue', (req, res) => {
  const story = nextStage(req.session.story);
  req.session.story = story;

  res.json({ text: story.text });
});
