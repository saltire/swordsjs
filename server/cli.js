'use strict';

const data = require('./data');
const swordgen = require('./swordgen');


async function main() {
  const { paletteSets, parts } = await data.getData();
  const { image, text } = await swordgen.createRandomSword(paletteSets, parts);
  image.toFile('sword.png');
  console.log({ text });
}

main();
