'use strict';

import sharp from 'sharp';

import { pixelGetter, pixelSetter, range } from './utils';


const options = {
  width: 360,
  height: 120,
  channels: 4,
  background: { r: 0, g: 0, b: 0, alpha: 0 },
};

export default {
  async imageFromBuffer(buffer, width) {
    return sharp(buffer, {
      raw: {
        ...options,
        width,
        height: buffer.length / width / options.channels,
      },
    } as sharp.SharpOptions);
  },

  // Recolour a sword part with custom palettes.
  async colourPart(partPath, colourSubs) {
    const image = sharp(partPath);

    const [{ width, height, channels }, buffer] = await Promise.all([
      image.metadata(),
      image.raw().toBuffer(),
    ]);

    const getPixel = pixelGetter(buffer, width, channels);
    const setPixel = pixelSetter(buffer, width, channels);

    const colourEntries = [...colourSubs.entries()];

    range(width).forEach((x) => {
      range(height).forEach((y) => {
        const srcColour = getPixel(x, y);
        colourEntries.some(([src, dest]) => {
          if (src.every((c, i) => (c === srcColour[i]))) {
            setPixel(x, y, dest);
            return true;
          }
          return false;
        });
      });
    });

    return buffer;
  },

  // Generate a composite image of a sword from of a set of parts and colour palettes.
  async drawSword(layerParts, colourSubs) {
    const layerImgs: Buffer[] = await Promise.all(
      layerParts.map(({ path }) => this.colourPart(path, colourSubs)));

    const buffer = await layerImgs.reduce(
      async (buf, layerImg) => sharp(await buf, { raw: options } as sharp.SharpOptions)
        .composite([{ input: layerImg, raw: options } as sharp.SharpOptions])
        .toBuffer(),
      sharp({ create: options } as sharp.SharpOptions).toBuffer());

    return sharp(buffer, { raw: options } as sharp.SharpOptions);
  },
};
