'use strict';

import { aToAn } from './utils';


export default {
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
    return Object.fromEntries(
      layerParts.map(({ layer, desc }) => [layer, this.describePart(desc, materialSubs)]));
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
