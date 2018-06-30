'use strict';

const csvParse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const util = require('util');


const partNamesFile = path.resolve(__dirname, './data/parts.csv');
const partsDir = path.resolve(__dirname, './data/parts');
const paletteImage = path.resolve(__dirname, './data/palette8.png');
const paletteNamesFile = path.resolve(__dirname, './data/palettes.csv');

const layers = [
  'grip',
  'blade',
  'bladedeco',
  'crossguard',
];

const range = length => [...Array(length).keys()];

module.exports = {
  // Get a list of descriptions for each part on each layer.
  getPartDescriptions() {
    return util.promisify(fs.readFile)(partNamesFile)
      .then(data => util.promisify(csvParse)(data))
      .then((rows) => {
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
      });
  },

  // Get a list of image filenames for each part on each layer, and add their descriptions.
  getParts(descs) {
    return util.promisify(fs.readdir)(partsDir)
      .then((files) => {
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
      });
  },

  // Get a list of lists of RGBA colour palettes from an image file.
  getColourSets() {
    const ph = 8;
    const image = sharp(paletteImage);
    return image.metadata()
      .then(({ width, height, channels }) => (
        image
          .raw()
          .toBuffer()
          .then((buffer) => {
            const pixel = (x, y) => {
              const offset = (y * width + x) * channels;
              return Array.from(buffer.slice(offset, offset + channels));
            };

            return range(Math.floor(height / ph)) // each palette set
              .map(p => (p * (ph + 1))) // the top of each palette set
              .map(py => range(width) // each palette in the set
                .filter(px => (pixel(px, py)[3] > 0)) // non-transparent pixels
                .map(px => range(ph).map(x => pixel(px + x, py)))); // each of 8 pixels down
          })));
  },

  // Get a list of palettes and material names from a CSV file and add their colours.
  getPaletteSets(colourSets) {
    return util.promisify(fs.readFile)(paletteNamesFile)
      .then(data => util.promisify(csvParse)(data))
      .then((rows) => {
        const paletteSets = [];
        let materials = [];
        let colours = [];

        rows.forEach(([setname, name, ...entries]) => {
          // If there's an entry in the first column, it's a header for a palette set.
          // Get the corresponding set of colour palettes,
          // and the names of the materials starting from the third column.
          if (setname) {
            materials = entries.filter(e => e);
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
              materials: materials
                .reduce((pms, mat, i) => Object.assign(pms, { [mat]: entries[i] }), {}),
              colours: colours[Object.keys(paletteSet.palettes).length],
            };
          }
        });

        return paletteSets;
      });
  },
};
