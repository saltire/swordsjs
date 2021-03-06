import Router from 'express-promise-router';

import game from './game';
import story from './story';
import swordgen from '../lib/swordgen';
import { dataUrl } from '../lib/utils';


const router = Router();
export default router;

router.get('/sword.png', async (req, res) => {
  const { image } = await swordgen.createRandomSword();
  const buffer = await image.png().toBuffer();
  res.set('Content-type', 'image/png');
  res.send(buffer);
});

router.get('/sword/data', async (req, res) => {
  const { image, descs } = await swordgen.createRandomSword();
  const imageUrl = await dataUrl(image);
  res.json({
    image: imageUrl,
    descs,
  });
});

router.use('/game', game);
router.use('/story', story);
