import csvParse from 'csv-parse';
import { promises as fs } from 'fs';
import { Sharp } from 'sharp';
import util from 'util';

import { Colour } from './types';


const parseCsv: (input: Buffer) => Promise<string[][]> = util.promisify(csvParse);

// Change 'a' to 'an' before asterisked words, and remove the asterisks.
export const aToAn = (text: string) => text.replace(/(\ba )?\*/g, (m, m1) => (m1 ? 'an ' : ''));

// Replace a $token with a string, preserving the case of the token's first letter.
export const caseSub = (text: string, token: string, replace: string) => (
  text.replace(new RegExp(token.replace('$', '\\$'), 'gi'),
    match => (/^\$[a-z]/.test(match) ? replace :
      (replace.charAt(0).toUpperCase() + replace.slice(1)))));

// Look for verbs in plural|singular format, and use the conjugation matching the pronoun.
export const conjugate = (text: string, usePlural: boolean) => text.replace(/(\w+)\|(\w+)/g,
  (match, plural, singular) => (usePlural ? plural : singular));

export const dataUrl = async (image: Sharp) => (
  `data:image/png;base64,${(await image.png().toBuffer()).toString('base64')}`);

export const pixelGetter = (buffer: Buffer, width: number, channels: number) => (
  (x: number, y: number) => {
    const offset = (y * width + x) * channels;
    return Array.from(buffer.slice(offset, offset + channels));
  });

export const pixelSetter = (buffer: Buffer, width: number, channels: number) => (
  (x: number, y: number, pix: Colour) => {
    const offset = (y * width + x) * channels;
    pix.forEach((c, i) => buffer.writeUInt8(c, offset + i));
  });

export const random = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];

export const range = (length: number) => [...Array(length).keys()];

export const readCsv = async (filename: string) => parseCsv(await fs.readFile(filename));
