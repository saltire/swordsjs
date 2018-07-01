'use strict';

const sharp = require('sharp');

const { layers } = require('./data');
const { pixelGetter, pixelSetter, range } = require('./utils');


const options = {
  width: 360,
  height: 120,
  channels: 4,
  background: { r: 0, g: 0, b: 0, alpha: 0 },
};

module.exports = {
  // Recolour a sword part with custom palettes.
  colourPart(partPath, colourSubs) {
    const image = sharp(partPath);

    return Promise.all([image.metadata(), image.raw().toBuffer()])
      .then(([{ width, height, channels }, buffer]) => {
        const getPixel = pixelGetter(buffer, width, channels);
        const setPixel = pixelSetter(buffer, width, channels);

        range(width).forEach((x) => {
          range(height).forEach((y) => {
            colourSubs.some(({ src, dest }) => {
              const srcColour = getPixel(x, y);
              const index = src.findIndex(s => s.every((c, i) => (c === srcColour[i])));
              if (index > -1) {
                setPixel(x, y, dest[index]);
                return true;
              }
              return false;
            });
          });
        });

        return buffer;
      });
  },

  // Generate a composite image of a sword from of a set of parts and colour palettes.
  drawSword(layerParts, colourSubs) {
    let promise = sharp({ create: options }).toBuffer();

    return Promise.all(layers.map(layer => this.colourPart(layerParts[layer].path, colourSubs)))
      .then((layerImgs) => {
        layerImgs.forEach((layerImg) => {
          // Chain promises in series.
          promise = promise.then(buffer => sharp(buffer, { raw: options })
            .overlayWith(layerImg, { raw: options })
            .toBuffer());
        });
        return promise;
      })
      .then(buffer => sharp(buffer, { raw: options }));
  },
};
