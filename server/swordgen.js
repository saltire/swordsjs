'use strict';

const data = require('./data');
const image = require('./image');
const text = require('./text');
const { random } = require('./utils');


// Fetch data in advance.
const dataPromise = data.getData();

module.exports = {
  // Pick random parts and random palettes from a set of each, then generate an image.
  async createRandomSword() {
    const { paletteSets, parts } = await dataPromise;

    const layerParts = data.layers.reduce(
      (lps, layer) => Object.assign(lps, { [layer]: random(parts[layer]) }), {});

    const colourSubs = new Map();
    const materialSubs = new Map();
    paletteSets.forEach(({ srcColours, palettes }) => {
      const { colours, materials } = random(Object.values(palettes));
      srcColours.forEach((src, i) => colourSubs.set(src, colours[i]));
      Object.entries(materials).forEach(([src, dest]) => materialSubs.set(src, dest));
    });

    return {
      image: await image.drawSword(layerParts, colourSubs),
      text: text.describeSword(layerParts, materialSubs),
    };
  },
};
