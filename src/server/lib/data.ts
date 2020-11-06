'use strict';

import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

import image from './image';
import { Colour, Descs, Gradient, Material, Palette, Part } from './types';
import { dataUrl, pixelGetter, range, readCsv } from './utils';


const dataDir = path.resolve(__dirname, '../../../data');
const partsDir = path.resolve(dataDir, 'parts');

const gemImage = path.resolve(dataDir, 'gem.png');
const paletteImage = path.resolve(dataDir, 'palette8.png');

const chaptersFile = path.resolve(dataDir, 'chapters.csv');
const charactersFile = path.resolve(dataDir, 'characters.csv');
const materialsFile = path.resolve(dataDir, 'materials.csv');
const partNamesFile = path.resolve(dataDir, 'parts.csv');
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
    const descs: Descs = {};
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
    const parts: Part[] = [];

    files.forEach((filename) => {
      const m = filename.match(/^(\w+?)-([-\w]+)\.png$/);
      if (m) {
        const layer = m[1];
        const name = m[2].replace('-', ' ');
        if (layers.includes(layer)) {
          parts.push({
            layer,
            name,
            path: path.join(partsDir, filename),
            desc: descs[layer][name] || '',
          });
        }
      }
    });

    return parts;
  },

  // Get a list of lists of RGBA colour gradients from an image file.
  async getGradientSets() {
    const ph = 8;
    const img = sharp(paletteImage);

    const [{ width, height, channels }, buffer] = await Promise.all([
      img.metadata() as Promise<{ width: number, height: number, channels: number }>,
      img.raw().toBuffer(),
    ]);

    const getPixel = pixelGetter(buffer, width, channels);

    return range(Math.floor((height || 0) / ph)) // each gradient set
      .map(p => (p * (ph + 1))) // the top of each gradient set
      .map(py => range(width) // each gradient in the set
        .filter(px => (getPixel(px, py)[3] > 0)) // non-transparent pixels
        .map(px => range(ph).map(y => getPixel(px, py + y)))); // each of 8 pixels down
  },

  // Get a list of materials from a CSV file and add their colours.
  async getPalettes() {
    const [gradientSets, rows] = await Promise.all([
      this.getGradientSets(),
      readCsv(materialsFile),
    ]);

    const palettes: Palette[] = [];
    let materialTypes: string[] = [];
    let gradientSet: Gradient[] = [];

    await rows.reduce(async (lastRow, [paletteName, materialName, ...entries]) => {
      await lastRow;

      // If there's an entry in the first column, it's a header for a palette.
      // Get the corresponding set of colour gradients,
      // and the names of the material types starting from the third column.
      if (paletteName) {
        materialTypes = entries.filter(Boolean);
        gradientSet = gradientSets[palettes.length];
        palettes.push({
          srcGradient: gradientSet[0],
          materials: [],
        });
      }

      // If there's an entry in the second column, it's a material in the palette.
      // Get its internal name and its display name for each material type.
      else if (materialName) {
        const palette = palettes[palettes.length - 1];
        const gradient = gradientSet[palette.materials.length];
        const colourSubs = new Map(palettes[0].srcGradient.map(
          (src, i) => [src, gradient[i]]));
        palette.materials.push({
          name: materialName,
          materialNames: Object.fromEntries(materialTypes.map((type, i) => [type, entries[i]])),
          gradient,
          gemImage: await dataUrl(await image.imageFromBuffer(
            await image.colourPart(gemImage, colourSubs), 10)),
        });
      }
    }, Promise.resolve());

    return palettes;
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
