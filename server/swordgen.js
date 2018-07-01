'use strict';

const { layers } = require('./data');
const image = require('./image');
const text = require('./text');
const { random } = require('./utils');


module.exports = {
  // Pick random parts and random palettes from a set of each, then generate an image.
  async createRandomSword(paletteSets, parts) {
    const layerParts = layers.reduce(
      (lps, layer) => Object.assign(lps, { [layer]: random(parts[layer]) }), {});

    // TODO: refactor colourSubs to just be a map of src to dest palettes.
    const colourSubs = [];
    const materialSubs = {};
    paletteSets.forEach(({ srcColours, palettes }) => {
      const { colours, materials } = random(Object.values(palettes));
      colourSubs.push({
        src: srcColours,
        dest: colours,
      });
      Object.assign(materialSubs, materials);
    });

    return {
      image: await image.drawSword(layerParts, colourSubs),
      text: text.describeSword(layerParts, materialSubs),
    };
  },
};
