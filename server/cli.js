'use strict';

const swordgen = require('./lib/swordgen');


async function main() {
  const { image, descs } = await swordgen.createRandomSword();
  image.toFile('sword.png');
  console.log({ descs });
}

main();
