import { Router } from 'express';
import { getAllStandings, updateGroup } from '../controllers/StandingsController.js';

const router = Router();

router.get('/', getAllStandings);      // Para la vista general
router.post('/:group', updateGroup);   // Para el proceso de cierre de grupo

export default router;