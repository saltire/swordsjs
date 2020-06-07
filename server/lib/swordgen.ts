'use strict';

import data, { layers } from './data';
import image from './image';
import text from './text';
import { random, range } from './utils';


// Fetch data in advance.
const dataPromise = Promise
  .all([
    data.getPaletteSets(),
    data.getParts(),
  ])
  .then(([paletteSets, parts]) => ({ paletteSets, parts }));

export default {
  async selectRandomParts() {
    const { parts } = await dataPromise;

    return layers.map(layer => ({ layer, ...random(parts[layer]) }));
  },

  async selectRandomPaletteSubs() {
    const { paletteSets } = await dataPromise;

    const colourSubs = new Map();
    const materialSubs = new Map();
    paletteSets.forEach(({ srcColours, palettes }) => {
      const { colours, materials } = random(palettes);
      srcColours.forEach((src, i) => colourSubs.set(src, colours[i]));
      materials.forEach(({ type, name }) => materialSubs.set(type, name));
    });

    return { colourSubs, materialSubs };
  },

  async selectRandomPaletteOptions(count = 2) {
    const { paletteSets } = await dataPromise;

    // There are two palette sets: gold and silver. Pick [count] palette options from each.
    return paletteSets.map(({ srcColours, palettes }) => {
      const palettesCopy = [...palettes];
      return {
        srcColours,
        palettes: range(count)
          .map(() => palettesCopy.splice(Math.floor(Math.random() * palettesCopy.length), 1))
          .flat(),
      };
    });
  },

  getPaletteSubsFromChoices(optionSets, choices) {
    const colourSubs = new Map();
    const materialSubs = new Map();
    optionSets.forEach(({ srcColours, palettes }, p) => {
      const { colours, materials } = palettes[choices[p]];
      srcColours.forEach((src, i) => colourSubs.set(src, colours[i]));
      materials.forEach(({ type, name }) => materialSubs.set(type, name));
    });

    return { colourSubs, materialSubs };
  },

  // Pick random parts and random palettes from a set of each, then generate an image.
  async createRandomSword() {
    const layerParts = await this.selectRandomParts();
    const { colourSubs, materialSubs } = await this.selectRandomPaletteSubs();

    return {
      image: await image.drawSword(layerParts, colourSubs),
      descs: text.describeSword(layerParts, materialSubs),
    };
  },

  async createSwordFromChoices(optionSets, choices) {
    const layerParts = await this.selectRandomParts();
    const { colourSubs, materialSubs } = this.getPaletteSubsFromChoices(optionSets, choices);

    return {
      image: await image.drawSword(layerParts, colourSubs),
      descs: text.describeSword(layerParts, materialSubs),
    };
  },
};
