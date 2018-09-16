'use strict';

const csvParse = require('csv-parse');
const fs = require('fs');
const util = require('util');

const parseCsv = util.promisify(csvParse);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);


module.exports = {
  // Change 'a' to 'an' before asterisked words, and remove the asterisks.
  aToAn: text => text.replace(/(\ba )?\*/g, (m, m1) => (m1 ? 'an ' : '')),

  // Replace a $token with a string, preserving the case of the token's first letter.
  caseSub: (text, token, replace) => text.replace(new RegExp(token.replace('$', '\\$'), 'gi'),
    match => (/^\$[a-z]/.test(match) ? replace :
      (replace.charAt(0).toUpperCase() + replace.slice(1)))),

  dataUrl: async image => (
    `data:image/png;base64,${(await image.png().toBuffer()).toString('base64')}`),

  pixelGetter: (buffer, width, channels) => (x, y) => {
    const offset = (y * width + x) * channels;
    return Array.from(buffer.slice(offset, offset + channels));
  },

  pixelSetter: (buffer, width, channels) => (x, y, pix) => {
    const offset = (y * width + x) * channels;
    pix.forEach((c, i) => buffer.writeUInt8(c, offset + i));
  },

  random: array => array[Math.floor(Math.random() * array.length)],

  range: length => [...Array(length).keys()],

  readCsv: async filename => parseCsv(await readFile(filename)),

  readDir,

  readFile,
};
