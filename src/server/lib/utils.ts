'use strict';

import csvParse from 'csv-parse';
import { promises as fs } from 'fs';
import util from 'util';

const parseCsv: (input: any) => any = util.promisify(csvParse);


  // Change 'a' to 'an' before asterisked words, and remove the asterisks.
export const aToAn = text => text.replace(/(\ba )?\*/g, (m, m1) => (m1 ? 'an ' : ''));

// Replace a $token with a string, preserving the case of the token's first letter.
export const caseSub = (text, token, replace) => text.replace(new RegExp(token.replace('$', '\\$'), 'gi'),
  match => (/^\$[a-z]/.test(match) ? replace :
    (replace.charAt(0).toUpperCase() + replace.slice(1))));

// Look for verbs in plural|singular format, and use the conjugation matching the pronoun.
export const conjugate = (text, usePlural) => text.replace(/(\w+)\|(\w+)/g,
  (match, plural, singular) => (usePlural ? plural : singular));

export const dataUrl = async image => (
  `data:image/png;base64,${(await image.png().toBuffer()).toString('base64')}`);

export const pixelGetter = (buffer: Buffer, width, channels) => (x, y) => {
  const offset = (y * width + x) * channels;
  return Array.from(buffer.slice(offset, offset + channels));
};

export const pixelSetter = (buffer, width, channels) => (x, y, pix) => {
  const offset = (y * width + x) * channels;
  pix.forEach((c, i) => buffer.writeUInt8(c, offset + i));
};

export const random = array => array[Math.floor(Math.random() * array.length)];

export const range = length => [...Array(length).keys()];

export const readCsv = async filename => parseCsv(await fs.readFile(filename));
