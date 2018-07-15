'use strict';

const swordgen = require('../lib/swordgen');
const { dataUrl, random } = require('../lib/utils');


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

module.exports = {
  async nextStage(currentStory, data) {
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
      const { image } = await swordgen.createSwordFromChoices(story.optionSets, data.choices);
      story.image = await dataUrl(image);
      delete story.optionSets;
    }

    if (story.stage === 'deliver') {
      delete story.image;
    }

    return story;
  },

  formatStoryData(story) {
    return {
      text: story.text,
      optionSets: story.optionSets && story.optionSets
        .map(({ palettes }) => Object.values(palettes)
          .map(({ materials }) => Object.values(materials)
            .map(mat => mat.replace('*', ''))
            .join(' and '))),
      image: story.image,
      desc: story.desc,
    };
  },
};
