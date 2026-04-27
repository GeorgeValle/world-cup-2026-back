import { Router } from 'express';
import { getAllMatches, getMatchById, createMatch, updateMatch, getDailySchedule } from '../controllers/MatchController.js';

const router = Router();

router.get('/', getAllMatches);
router.get('/schedule/daily', getDailySchedule);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.put('/:id', updateMatch);

export default router;