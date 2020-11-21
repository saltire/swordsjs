'use strict';

import { Part } from './types';
import { aToAn } from './utils';

type Pronouns = { [gender: string]: string };


export default {
  // Fill in material keywords in a part description with materials from custom palettes.
  describePart(partDesc: string, materialSubs: Map<string, string>) {
    let desc = partDesc;
    [...materialSubs.entries()].forEach(([material, name]) => {
      desc = desc.replace(`$${material}`, name);
    });

    return aToAn(desc);
  },

  // Generate text descriptions of the different parts of a sword.
  describeSword(layerParts: Part[], materialSubs: Map<string, string>) {
    return Object.fromEntries(
      layerParts.map(({ layer, desc }) => [layer, this.describePart(desc, materialSubs)]));
  },
};

export const pronouns: { he: Pronouns, him: Pronouns, his: Pronouns } = {
  he: { m: 'he', f: 'she', n: 'they' },
  him: { m: 'him', f: 'her', n: 'them' },
  his: { m: 'his', f: 'her', n: 'their' },
};
