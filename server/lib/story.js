'use strict';

const data = require('./data');
const swordgen = require('./swordgen');
const text = require('./text');
const { aToAn, caseSub, conjugate, dataUrl, random } = require('./utils');


// Fetch data in advance.
const dataPromise = Promise.all(
  [
    data.getCharacterData(),
    data.getStoryPages(),
  ])
  .then(([charData, pages]) => ({ charData, pages }));

const colours = [
  '#df3e23', '#fa6a0a', '#f9a31b', '#fffc40', '#59c135', '#249fde', '#20d6c7', '#f5a097',
  '#e86a73', '#bc4a9b', '#bb7547', '#dba463', '#ba756a', '#849be4', '#5daf8d', '#a08662'];

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
        pronoun: random(['m', 'f', 'n']),
        colour: random(colours),
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
      story.text = caseSub(story.text, '$characterfull',
        `${story.character.adjective} ${story.character.noun}`);
      story.text = caseSub(story.text, '$character', story.character.noun);
      story.text = caseSub(story.text, '$he', text.hePronouns[story.character.pronoun]);
      story.text = caseSub(story.text, '$him', text.himPronouns[story.character.pronoun]);
      story.text = caseSub(story.text, '$his', text.hisPronouns[story.character.pronoun]);
      story.text = conjugate(story.text, story.character.pronoun === 'n');
    }
    if (story.descs) {
      story.text = caseSub(story.text, '$blade',
        `${story.descs.blade}${story.descs.bladedeco ? `, ${story.descs.bladedeco}` : ''}`);
      story.text = caseSub(story.text, '$crossguard', story.descs.crossguard);
      story.text = caseSub(story.text, '$grip', story.descs.grip);
    }

    story.text = aToAn(story.text);

    return story;
  },

  formatStoryData(story) {
    return {
      text: story.text,
      charColour: story.character && story.character.colour,
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
