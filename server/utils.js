'use strict';


module.exports = {
  dataUrl: async image => (
    `data:image/png;base64,${(await image.png().toBuffer()).toString('base64')}`),

  random: array => array[Math.floor(Math.random() * array.length)],

  range: length => [...Array(length).keys()],

  pixelGetter: (buffer, width, channels) => (x, y) => {
    const offset = (y * width + x) * channels;
    return Array.from(buffer.slice(offset, offset + channels));
  },

  pixelSetter: (buffer, width, channels) => (x, y, pix) => {
    const offset = (y * width + x) * channels;
    pix.forEach((c, i) => buffer.writeUInt8(c, offset + i));
  },
};
