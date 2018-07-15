'use strict';

const express = require('express');

const swordgen = require('../lib/swordgen');
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

async function nextStage(currentStory) {
  const story = Object.assign({}, currentStory || {});

  // Advance to the next stage, or go back to the first if finished.
  story.stage = stageIds[(stageIds.indexOf(story.stage) + 1) % stageIds.length];

  // Build text for this stage.
  story.text = stages[story.stage];

  if (story.stage === 'request') {
    story.text = story.text.replace('$effect', random(effects));
  }

  if (story.stage === 'materials') {
    story.optionSets = await swordgen.selectRandomPaletteOptions();
  }

  if (story.stage === 'forge') {
    delete story.optionSets;
  }

  return story;
}

function formatStoryData(story) {
  return {
    text: story.text,
    optionSets: story.optionSets && story.optionSets
      .map(({ palettes }) => Object.values(palettes)
        .map(({ materials }) => Object.values(materials)
          .map(mat => mat.replace('*', ''))
          .join(' and '))),
  };
}

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
  nextStage(req.session.story)
    .then((story) => {
      req.session.story = story;
      res.json({ story: formatStoryData(req.session.story) });
    })
    .catch(next);
});
