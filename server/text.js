'use strict';


module.exports = {
  // Fill in material keywords in a part description with materials from custom palettes.
  describePart(partDesc, materialSubs) {
    let desc = partDesc;
    [...materialSubs.entries()].forEach(([material, name]) => {
      desc = desc.replace(`$${material}`, name);
    });

    // Change 'a' to 'an' before asterisked words, and remove the asterisks.
    desc = desc.replace(/(\ba )?\*/g, (m, m1) => (m1 ? 'an ' : ''));

    return desc;
  },

  // Generate text descriptions of the different parts of a sword.
  describeSword(layerParts, materialSubs) {
    const layerDescs = {};
    Object.entries(layerParts).forEach(([layer, layerPart]) => {
      layerDescs[layer] = this.describePart(layerPart.desc, materialSubs);
    });
    return layerDescs;
  },
};
