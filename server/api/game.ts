import { Request } from 'express';
import Router from 'express-promise-router';
import { Session } from 'express-session';

import swordgen from '../lib/swordgen';
import { Palette } from '../lib/types';
import { dataUrl } from '../lib/utils';


interface GameSession extends Session {
  optionSets?: Palette[],
}

interface GameRequest extends Request {
  session: GameSession,
}

const router = Router();
export default router;

router.get('/options', async (req: GameRequest, res) => {
  if (!req.session) {
    throw new Error('Session not found.');
  }
  const optionSets = await swordgen.selectRandomPaletteOptions();
  req.session.optionSets = optionSets;
  res.json({
    optionSets: optionSets
      .map(({ materials }) => Object.values(materials)
        .map(({ gemImage, materialNames }) => ({
          gemImage,
          materialList: Array
            .from(new Set(Object.values(materialNames).map((name: string) => name.replace('*', ''))))
            .join(' and '),
        }))),
  });
});

router.post('/forge', async (req: GameRequest, res) => {
  if (!(req.session && req.session.optionSets)) {
    throw new Error('Session not found.');
  }
  const { optionSets } = req.session;
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
