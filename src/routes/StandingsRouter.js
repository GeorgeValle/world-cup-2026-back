import { Router } from 'express';
import { getAllStandings, updateGroup } from '../controllers/StandingsController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js'; // <-- IMPORTAMOS EL MIDDLEWARE

const router = Router();

// --- RUTAS PÚBLICAS (Cualquiera consume) ---
router.get('/', getAllStandings);      // Para la vista general
// --- RUTAS PRIVADAS (Solo el Admin usa) ---
router.post('/:group', verifyAdmin, updateGroup);   // Para el proceso de cierre de grupo

export default router;