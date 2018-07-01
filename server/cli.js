'use strict';

const data = require('./data');
const swordgen = require('./swordgen');


async function main() {
  const paletteSets = await data.getPaletteSets(await data.getColourSets());
  const parts = await data.getParts(await data.getPartDescriptions());

  const image = await swordgen.createRandomSword(paletteSets, parts);
  image.toFile('sword.png');
}

main();
