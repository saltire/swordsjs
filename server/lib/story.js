'use strict';

const data = require('./data');
const swordgen = require('./swordgen');
const text = require('./text');
const { aToAn, caseSub, conjugate, dataUrl, random } = require('./utils');


// Fetch data in advance.
const dataPromise = Promise.all(
  [
    data.getCharacterData(),
    data.getStoryChapters(),
    data.getWeather(),
  ]);

const colours = [
  '#df3e23', '#fa6a0a', '#f9a31b', '#fffc40', '#59c135', '#249fde', '#20d6c7', '#f5a097',
  '#e86a73', '#bc4a9b', '#bb7547', '#dba463', '#ba756a', '#849be4', '#5daf8d', '#a08662'];

module.exports = {
  async nextStage(currentStory, input) {
    const [charData, chapters, weather] = await dataPromise;

    // Copy the ongoing story object, if it exists and isn't finished.
    const story = (currentStory && !currentStory.end) ? Object.assign({}, currentStory) : {};

    // Choose a random chapter and go to the first page.
    if (!story.chapter) {
      story.chapter = random(chapters);
      story.page = 0;
    }

    // Build text for this stage, stripping tags from the beginning.
    story.tags = [];
    story.text = story.chapter[story.page]
      .replace(/\*(\w+)\s*/g, (_, tag) => {
        // Some tags can be replaced immediately with text.
        if (tag === 'weather') {
          return random(weather);
        }

        // Other tags get pushed on the stack to be dealt with later.
        story.tags.push(tag);
        return '';
      });
    story.page += 1;

    // Generate data needed for the story as soon as applicable.
    if (!story.character) {
      story.character = {
        adjective: random(charData.adjectives),
        noun: random(charData.nouns),
        pronoun: random(['m', 'f', 'n']),
        colour: random(colours),
      };
    }
    if (story.tags.includes('options')) {
      story.optionSets = await swordgen.selectRandomPaletteOptions();
    }
    if (input && input.choices) {
      const sword = await swordgen.createSwordFromChoices(story.optionSets, input.choices);
      story.image = await dataUrl(sword.image);
      story.descs = sword.descs;
    }

    // Make any applicable text substitutions.
    if (story.character) {
      // Character nouns.
      story.text = caseSub(story.text, '$characterfull',
        `${story.character.adjective} ${story.character.noun}`);
      story.text = caseSub(story.text, '$character', story.character.noun);
      // Character pronouns.
      story.text = caseSub(story.text, '$he', text.hePronouns[story.character.pronoun]);
      story.text = caseSub(story.text, '$him', text.himPronouns[story.character.pronoun]);
      story.text = caseSub(story.text, '$his', text.hisPronouns[story.character.pronoun]);
      // Character verbs.
      story.text = conjugate(story.text, story.character.pronoun === 'n');
    }
    if (story.descs) {
      // Sword descriptions.
      story.text = caseSub(story.text, '$blade',
        `${story.descs.blade}${story.descs.bladedeco ? `, ${story.descs.bladedeco}` : ''}`);
      story.text = caseSub(story.text, '$crossguard', story.descs.crossguard);
      story.text = caseSub(story.text, '$grip', story.descs.grip);
    }
    story.text = aToAn(story.text);

    story.end = story.page === story.chapter.length;

    return story;
  },

  formatStoryData(story) {
    return {
      text: story.text,
      charColour: story.character && story.character.colour,
      optionSets: story.optionSets && !story.descs && story.optionSets
        .map(({ palettes }) => Object.values(palettes)
          .map(({ materials }) => Array.from(new Set(Object.values(materials)
            .map(mat => mat.replace('*', ''))))
            .join(' and '))),
      image: story.tags.includes('image') ? story.image : undefined,
      desc: story.desc,
      end: story.end,
    };
  },
};
