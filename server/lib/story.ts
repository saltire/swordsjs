'use strict';

import data from './data';
import swordgen from './swordgen';
import { pronouns } from './text';
import { Palette } from './types';
import { aToAn, caseSub, conjugate, dataUrl, random } from './utils';


// Fetch data in advance.
const dataPromise = Promise.all([
  data.getCharacterData(),
  data.getStoryChapters(),
  data.getWeather(),
]);

const colours = [
  '#df3e23', '#fa6a0a', '#f9a31b', '#fffc40', '#59c135', '#249fde', '#20d6c7', '#f5a097',
  '#e86a73', '#bc4a9b', '#bb7547', '#dba463', '#ba756a', '#849be4', '#5daf8d', '#a08662'];

type Story = {
  character?: {
    adjective: string,
    noun: string,
    gender: string,
    colour: string,
  }
  chapter?: string[],
  descs?: { [layer: string]: string },
  end: boolean,
  image?: string,
  optionSets?: Palette[],
  page: number,
  tags: string[],
  text?: string,
};

export default {
  async nextStage(currentStory?: Story, choices?: number[]) {
    const [charData, chapters, weather] = await dataPromise;

    // Copy the ongoing story object, if it exists and isn't finished.
    const story: Story = (currentStory && !currentStory.end) ? { ...currentStory } : {
      end: false,
      page: 0,
      tags: [],
    };

    // Choose a random chapter and go to the first page.
    if (!story.chapter) {
      story.chapter = random(chapters);
      story.page = 0;
    }

    // Build text for this stage, stripping tags from the beginning.
    story.tags = [];
    story.text = story.chapter[story.page]
      .replace(/\[(\w+)\]\s*/g, (_, tag) => {
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
        gender: random(['m', 'f', 'n']),
        colour: random(colours),
      };
    }
    if (story.tags.includes('options')) {
      story.optionSets = await swordgen.selectRandomPaletteOptions();
    }
    if (choices && story.optionSets) {
      const { image, descs } =
        await swordgen.createSwordFromChoices(story.optionSets, choices);
      story.image = await dataUrl(image);
      story.descs = descs;
    }

    // Make any applicable text substitutions.
    if (story.character) {
      // Character nouns.
      story.text = caseSub(story.text, '$characterfull',
        `${story.character.adjective} ${story.character.noun}`);
      story.text = caseSub(story.text, '$character', story.character.noun);
      // Character pronouns.
      story.text = caseSub(story.text, '$he', pronouns.he[story.character.gender]);
      story.text = caseSub(story.text, '$him', pronouns.him[story.character.gender]);
      story.text = caseSub(story.text, '$his', pronouns.his[story.character.gender]);
      // Character verbs.
      story.text = conjugate(story.text, story.character.gender === 'n');
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

  formatStoryData(story: Story) {
    return {
      text: story.text,
      charColour: story.character && story.character.colour,
      optionSets: story.optionSets && !story.descs && story.optionSets
        .map(({ materials }) => Object.values(materials)
          .map(({ gemImage, materialNames }) => ({
            gemImage,
            materialList: Array
              .from(new Set(Object.values(materialNames)
                .map((name: string) => name.replace('*', ''))))
              .join(' and '),
          }))),
      image: story.tags.includes('image') ? story.image : undefined,
      end: story.end,
    };
  },
};
