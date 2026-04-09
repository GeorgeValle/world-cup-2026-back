import { Router } from 'express';
import { getAllMatches, getMatchById, createMatch, updateMatch } from '../controllers/MatchController.js';

const router = Router();

router.get('/', getAllMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.put('/:id', updateMatch);

export default router;