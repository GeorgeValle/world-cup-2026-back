import { Router } from 'express';
import { getAllTeams, createTeam, getTeamById, getTeamByName, updateTeam } from '../controllers/TeamController.js';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/name/:name', getTeamByName);
router.post('/', createTeam);
router.put('/:id', updateTeam); // <-- 2. Conectas la ruta PUT

export default router;