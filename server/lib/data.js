'use strict';

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const { pixelGetter, range, readCsv } = require('./utils');


const dataDir = path.resolve(__dirname, '../../data');
const chaptersFile = path.resolve(dataDir, 'chapters.csv');
const charactersFile = path.resolve(dataDir, 'characters.csv');
const partNamesFile = path.resolve(dataDir, 'parts.csv');
const partsDir = path.resolve(dataDir, 'parts');
const paletteImage = path.resolve(dataDir, 'palette8.png');
const paletteNamesFile = path.resolve(dataDir, 'palettes.csv');
const weatherFile = path.resolve(dataDir, 'weather.csv');

const layers = [
  'grip',
  'blade',
  'bladedeco',
  'crossguard',
];

module.exports = {
  layers,

  // Get a list of descriptions for each part on each layer.
  async getPartDescriptions() {
    const rows = await readCsv(partNamesFile);
    const descs = {};
    let layer = '';

    rows.forEach(([name, desc]) => {
      if (name && !desc) {
        layer = name.toLowerCase().replace(' ', '');
        descs[layer] = {};
      }
      else if (name && desc) {
        descs[layer][name] = desc;
      }
    });

    return descs;
  },

  // Get a list of image filenames for each part on each layer, and add their descriptions.
  async getParts() {
    const [descs, files] = await Promise.all([
      this.getPartDescriptions(),
      fs.readdir(partsDir),
    ]);
    const partsMap = {};

    files.forEach((filename) => {
      const m = filename.match(/^(\w+?)-([-\w]+)\.png$/);
      if (m) {
        const layer = m[1];
        const name = m[2].replace('-', ' ');
        if (layers.includes(layer)) {
          partsMap[layer] = (partsMap[layer] || []).concat({
            name,
            path: path.join(partsDir, filename),
            desc: descs[layer][name] || '',
          });
        }
      }
    });

    return partsMap;
  },

  // Get a list of lists of RGBA colour palettes from an image file.
  async getColourSets() {
    const ph = 8;
    const image = sharp(paletteImage);

    const [{ width, height, channels }, buffer] = await Promise.all([
      image.metadata(),
      image.raw().toBuffer(),
    ]);

    const getPixel = pixelGetter(buffer, width, channels);

    return range(Math.floor(height / ph)) // each palette set
      .map(p => (p * (ph + 1))) // the top of each palette set
      .map(py => range(width) // each palette in the set
        .filter(px => (getPixel(px, py)[3] > 0)) // non-transparent pixels
        .map(px => range(ph).map(y => getPixel(px, py + y)))); // each of 8 pixels down
  },

  // Get a list of palettes and material names from a CSV file and add their colours.
  async getPaletteSets() {
    const [colourSets, rows] = await Promise.all([
      this.getColourSets(),
      readCsv(paletteNamesFile),
    ]);

    const paletteSets = [];
    let materials = [];
    let colours = [];

    rows.forEach(([setname, name, ...entries]) => {
      // If there's an entry in the first column, it's a header for a palette set.
      // Get the corresponding set of colour palettes,
      // and the names of the materials starting from the third column.
      if (setname) {
        materials = entries.filter(Boolean);
        colours = colourSets[paletteSets.length];
        paletteSets.push({
          srcColours: colours[0],
          palettes: {},
        });
      }

      // If there's an entry in the second column, it's a palette.
      // Get the internal name of the palette and its name for each material.
      else if (name) {
        const paletteSet = paletteSets[paletteSets.length - 1];
        paletteSet.palettes[name] = {
          materials: materials.reduce((pms, mat, i) => ({ ...pms, [mat]: entries[i] }), {}),
          colours: colours[Object.keys(paletteSet.palettes).length],
        };
      }
    });

    return paletteSets;
  },

  async getCharacterData() {
    const [adjectives, nouns] = await readCsv(charactersFile);

    return {
      adjectives: adjectives.filter(Boolean),
      nouns: nouns.filter(Boolean),
    };
  },

  async getStoryChapters() {
    const rows = await readCsv(chaptersFile);
    return rows.map(row => row.filter(Boolean));
  },

  async getWeather() {
    const rows = await readCsv(weatherFile);
    return rows.map(row => row[0]);
  },
};
