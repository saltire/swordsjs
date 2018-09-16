'use strict';


module.exports = {
  // Fill in material keywords in a part description with materials from custom palettes.
  describePart(partDesc, materialSubs) {
    let desc = partDesc;
    [...materialSubs.entries()].forEach(([material, name]) => {
      desc = desc.replace(`$${material}`, name);
    });

    return this.aToAn(desc);
  },

  // Generate text descriptions of the different parts of a sword.
  describeSword(layerParts, materialSubs) {
    const layerDescs = {};
    Object.entries(layerParts).forEach(([layer, layerPart]) => {
      layerDescs[layer] = this.describePart(layerPart.desc, materialSubs);
    });
    return layerDescs;
  },

  caseSub(text, search, replace) {
    return text.replace(new RegExp(search.replace('$', '\\$'), 'gi'),
      match => (/^\$[a-z]/.test(match) ? replace :
        (replace.charAt(0).toUpperCase() + replace.slice(1))));
  },

  aToAn(text) {
    // Change 'a' to 'an' before asterisked words, and remove the asterisks.
    return text.replace(/(\ba )?\*/g, (m, m1) => (m1 ? 'an ' : ''));
  },

  hePronouns: {
    m: 'he',
    f: 'she',
    n: 'they',
  },

  himPronouns: {
    m: 'him',
    f: 'her',
    n: 'they',
  },

  hisPronouns: {
    m: 'his',
    f: 'her',
    n: 'their',
  },
};
