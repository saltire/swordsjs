'use strict';

const { aToAn } = require('./utils');


module.exports = {
  // Fill in material keywords in a part description with materials from custom palettes.
  describePart(partDesc, materialSubs) {
    let desc = partDesc;
    [...materialSubs.entries()].forEach(([material, name]) => {
      desc = desc.replace(`$${material}`, name);
    });

    return aToAn(desc);
  },

  // Generate text descriptions of the different parts of a sword.
  describeSword(layerParts, materialSubs) {
    const layerDescs = {};
    Object.entries(layerParts).forEach(([layer, layerPart]) => {
      layerDescs[layer] = this.describePart(layerPart.desc, materialSubs);
    });
    return layerDescs;
  },

  hePronouns: {
    m: 'he',
    f: 'she',
    n: 'they',
  },

  himPronouns: {
    m: 'him',
    f: 'her',
    n: 'them',
  },

  hisPronouns: {
    m: 'his',
    f: 'her',
    n: 'their',
  },
};
