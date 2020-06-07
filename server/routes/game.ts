'use strict';

import { Router } from '@awaitjs/express';

import swordgen from '../lib/swordgen';
import { dataUrl } from '../lib/utils';


const router = Router();
export default router;

router.getAsync('/options', async (req, res) => {
  const optionSets = await swordgen.selectRandomPaletteOptions();
  req.session.optionSets = optionSets;
  res.json({
    optionSets: optionSets
      .map(({ palettes }) => Object.values(palettes)
        .map(({ gemImage, materials }) => ({
          gemImage,
          materials: Array
            .from(new Set(materials
              .map(({ name }) => name.replace('*', ''))))
            .join(' and '),
        }))),
  });
});

router.postAsync('/forge', async (req, res) => {
  const { optionSets } = req.session;
  if (!optionSets) {
    throw new Error('Session not found.');
  }
  delete req.session.optionSets;

  const { choices } = req.body;
  if (!choices) {
    throw new Error('Choices not found.');
  }

  const { image, descs } = await swordgen.createSwordFromChoices(optionSets, choices);
  const imageUrl = await dataUrl(image);
  res.json({
    image: imageUrl,
    descs,
  });
});
