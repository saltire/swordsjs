'use strict';

const swordgen = require('./lib/swordgen');


async function main() {
  const { image, text } = await swordgen.createRandomSword();
  image.toFile('sword.png');
  console.log({ text });
}

main();
