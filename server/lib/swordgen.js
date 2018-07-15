'use strict';

const data = require('./data');
const image = require('./image');
const text = require('./text');
const { random, range } = require('./utils');


// Fetch data in advance.
const dataPromise = data.getData();

module.exports = {
  async selectRandomParts() {
    const { parts } = await dataPromise;

    return data.layers.reduce(
      (lps, layer) => Object.assign(lps, { [layer]: random(parts[layer]) }), {});
  },

  async selectRandomPaletteSubs() {
    const { paletteSets } = await dataPromise;

    const colourSubs = new Map();
    const materialSubs = new Map();
    paletteSets.forEach(({ srcColours, palettes }) => {
      const { colours, materials } = random(Object.values(palettes));
      srcColours.forEach((src, i) => colourSubs.set(src, colours[i]));
      Object.entries(materials).forEach(([src, dest]) => materialSubs.set(src, dest));
    });

    return { colourSubs, materialSubs };
  },

  async selectRandomPaletteOptions(count = 2) {
    const { paletteSets } = await dataPromise;

    return paletteSets.map(({ srcColours, palettes }) => {
      const names = Object.keys(palettes);
      const paletteOptions = {};
      range(count).forEach(() => {
        const name = names.splice(Math.floor(Math.random() * names.length), 1);
        paletteOptions[name] = palettes[name];
      });

      return { srcColours, palettes: paletteOptions };
    });
  },

  getPaletteSubsFromChoices(paletteSets, choices) {
    const colourSubs = new Map();
    const materialSubs = new Map();
    paletteSets.forEach(({ srcColours, palettes }, p) => {
      const { colours, materials } = Object.values(palettes)[choices[p]];
      srcColours.forEach((src, i) => colourSubs.set(src, colours[i]));
      Object.entries(materials).forEach(([src, dest]) => materialSubs.set(src, dest));
    });

    return { colourSubs, materialSubs };
  },

  // Pick random parts and random palettes from a set of each, then generate an image.
  async createRandomSword() {
    const layerParts = await this.selectRandomParts();
    const { colourSubs, materialSubs } = await this.selectRandomPaletteSubs();

    return {
      image: await image.drawSword(layerParts, colourSubs),
      text: text.describeSword(layerParts, materialSubs),
    };
  },

  async createSwordFromChoices(paletteSets, choices) {
    const layerParts = await this.selectRandomParts();
    const { colourSubs, materialSubs } = this.getPaletteSubsFromChoices(paletteSets, choices);

    return {
      image: await image.drawSword(layerParts, colourSubs),
      text: text.describeSword(layerParts, materialSubs),
    };
  },
};
