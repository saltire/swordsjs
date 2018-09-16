'use strict';

const data = require('./data');
const swordgen = require('./swordgen');
const text = require('./text');
const { dataUrl, random } = require('./utils');


// Fetch data in advance.
const dataPromise = Promise.all(
  [
    data.getCharacterData(),
    data.getStoryPages(),
  ])
  .then(([charData, pages]) => ({ charData, pages }));

module.exports = {
  async nextStage(currentStory, input) {
    const { charData, pages } = await dataPromise;
    const stageIds = Object.keys(pages);

    const story = Object.assign({}, currentStory || {});

    // Advance to the next stage, or go back to the first if finished.
    story.stage = stageIds[(stageIds.indexOf(story.stage) + 1) % stageIds.length];

    // Build text for this stage.
    story.text = random(pages[story.stage]);

    // Update the story object.
    if (story.stage === 'Character') {
      story.character = {
        adjective: random(charData.adjectives),
        noun: random(charData.nouns),
        gender: random('m', 'f', 'n'),
      };
    }
    else if (story.stage === 'Components') {
      story.optionSets = await swordgen.selectRandomPaletteOptions();
    }
    else if (story.stage === 'Forging') {
      const sword = await swordgen.createSwordFromChoices(story.optionSets, input.choices);
      story.image = await dataUrl(sword.image);
      story.descs = sword.text;
    }

    // Make any applicable text substitutions.
    if (story.character) {
      story.text = text.caseSub(story.text, '$characterfull',
        `${story.character.adjective} ${story.character.noun}`);
      story.text = text.caseSub(story.text, '$character', story.character.noun);
      story.text = text.caseSub(story.text, '$he', text.hePronouns[story.character.gender]);
      story.text = text.caseSub(story.text, '$him', text.himPronouns[story.character.gender]);
      story.text = text.caseSub(story.text, '$his', text.hisPronouns[story.character.gender]);
    }
    if (story.descs) {
      story.text = text.caseSub(story.text, '$blade',
        `${story.descs.blade}${story.descs.bladedeco ? `, ${story.descs.bladedeco}` : ''}`);
      story.text = text.caseSub(story.text, '$crossguard', story.descs.crossguard);
      story.text = text.caseSub(story.text, '$grip', story.descs.grip);
    }

    story.text = text.aToAn(story.text);

    return story;
  },

  formatStoryData(story) {
    return {
      text: story.text,
      optionSets: story.stage !== 'Components' ? undefined : story.optionSets
        .map(({ palettes }) => Object.values(palettes)
          .map(({ materials }) => Object.values(materials)
            .map(mat => mat.replace('*', ''))
            .join(' and '))),
      image: story.stage !== 'Description' ? undefined : story.image,
      desc: story.desc,
      end: story.stage === 'Delivery',
    };
  },
};
