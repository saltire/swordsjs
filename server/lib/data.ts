'use strict';

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

import image from './image';
import { dataUrl, pixelGetter, range, readCsv } from './utils';


const dataDir = path.resolve(__dirname, '../../data');
const partsDir = path.resolve(dataDir, 'parts');

const gemImage = path.resolve(dataDir, 'gem.png');
const paletteImage = path.resolve(dataDir, 'palette8.png');

const chaptersFile = path.resolve(dataDir, 'chapters.csv');
const charactersFile = path.resolve(dataDir, 'characters.csv');
const partNamesFile = path.resolve(dataDir, 'parts.csv');
const paletteNamesFile = path.resolve(dataDir, 'palettes.csv');
const weatherFile = path.resolve(dataDir, 'weather.csv');

export const layers = [
  'grip',
  'blade',
  'bladedeco',
  'crossguard',
];

export default {
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
    const img = sharp(paletteImage);

    const [{ width, height, channels }, buffer] = await Promise.all([
      img.metadata(),
      img.raw().toBuffer(),
    ]);

    const getPixel = pixelGetter(buffer, width, channels);

    return range(Math.floor((height || 0) / ph)) // each palette set
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

    const paletteSets: any[] = [];
    let materialTypes: string[] = [];
    let colours = [];

    await rows.reduce(async (lastRow, [setname, name, ...entries]) => {
      await lastRow;

      // If there's an entry in the first column, it's a header for a palette set.
      // Get the corresponding set of colour palettes,
      // and the names of the material types starting from the third column.
      if (setname) {
        materialTypes = entries.filter(Boolean);
        colours = colourSets[paletteSets.length];
        paletteSets.push({
          srcColours: colours[0],
          palettes: [],
        });
      }

      // If there's an entry in the second column, it's a palette.
      // Get the internal name of the palette and the name for its material of each type.
      else if (name) {
        const paletteSet = paletteSets[paletteSets.length - 1];
        const paletteColours = colours[paletteSet.palettes.length];
        const colourSubs = new Map(paletteSets[0].srcColours.map(
          (src, i) => [src, paletteColours[i]]));
        paletteSet.palettes.push({
          name,
          materials: materialTypes.map((type, i) => ({ type, name: entries[i] })),
          colours: paletteColours,
          gemImage: await dataUrl(await image.imageFromBuffer(
            await image.colourPart(gemImage, colourSubs), 10)),
        });
      }
    }, Promise.resolve());

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
