import { Router } from 'express';
import { getAllStadiums, createStadium, getStadiumById, getStadiumByName } from '../controllers/StadiumController.js';

const router = Router();

router.get('/', getAllStadiums);
router.post('/', createStadium);
router.get('/:id', getStadiumById);
router.get('/:name', getStadiumByName);

export default router;