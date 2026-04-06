import { Router } from 'express';
import { getAllTeams, createTeam, getTeamById, getTeamByName } from '../controllers/TeamController.js';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/name/:name', getTeamByName);
router.post('/', createTeam);

export default router;