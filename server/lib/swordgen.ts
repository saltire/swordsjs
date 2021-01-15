import data, { layers } from './data';
import image from './image';
import text from './text';
import { Palette } from './types';
import { random, range } from './utils';


// Fetch data in advance.
const dataPromise = Promise
  .all([
    data.getPalettes(),
    data.getParts(),
  ])
  .then(([palettes, parts]) => ({ palettes, parts }));

export default {
  async selectRandomParts() {
    const { parts } = await dataPromise;

    return layers.map(layer => random(parts.filter(part => part.layer === layer)));
  },

  async selectRandomPaletteSubs() {
    const { palettes } = await dataPromise;

    const colourSubs = new Map();
    const materialSubs = new Map();
    palettes.forEach(({ srcGradient, materials }) => {
      const { gradient, materialNames } = random(materials);
      srcGradient.forEach((src, i) => colourSubs.set(src, gradient[i]));
      Object.entries(materialNames).forEach(([type, name]) => materialSubs.set(type, name));
    });

    return { colourSubs, materialSubs };
  },

  async selectRandomPaletteOptions(count = 2): Promise<Palette[]> {
    const { palettes } = await dataPromise;

    // There are two palettes: gold and silver. Pick [count] material options from each.
    return palettes.map(({ srcGradient, materials }) => {
      const materialsCopy = [...materials];
      return {
        srcGradient,
        materials: range(count)
          .flatMap(() => materialsCopy.splice(Math.floor(Math.random() * materialsCopy.length), 1)),
      };
    });
  },

  getPaletteSubsFromChoices(optionSets: Palette[], choices: number[]) {
    const colourSubs = new Map();
    const materialSubs = new Map();
    optionSets.forEach(({ srcGradient, materials }, p) => {
      const { gradient, materialNames } = materials[choices[p]];
      srcGradient.forEach((src, i) => colourSubs.set(src, gradient[i]));
      Object.entries(materialNames).forEach(([type, name]) => materialSubs.set(type, name));
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

  async createSwordFromChoices(optionSets: Palette[], choices: number[]) {
    const layerParts = await this.selectRandomParts();
    const { colourSubs, materialSubs } = this.getPaletteSubsFromChoices(optionSets, choices);

    return {
      image: await image.drawSword(layerParts, colourSubs),
      descs: text.describeSword(layerParts, materialSubs),
    };
  },
};
