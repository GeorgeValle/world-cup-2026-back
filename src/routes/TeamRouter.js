import { Router } from 'express';
import { getAllTeams, createTeam, getTeamById, getTeamByName, updateTeam } from '../controllers/TeamController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js'; // <-- IMPORTAMOS EL MIDDLEWARE

const router = Router();

// --- RUTAS PÚBLICAS (Cualquiera consume) ---
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/name/:name', getTeamByName);

// --- RUTAS PRIVADAS (Solo el Admin usa) ---
router.post('/', verifyAdmin, createTeam);
router.put('/:id', verifyAdmin, updateTeam); // <-- 2. Conectas la ruta PUT

export default router;