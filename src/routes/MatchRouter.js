import { Router } from 'express';
import { getAllMatches, getMatchById, createMatch } from '../controllers/MatchController.js';

const router = Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);

export default router;