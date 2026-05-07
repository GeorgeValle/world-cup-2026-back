import { Router } from 'express';
import { verifyAdmin } from '../middlewares/authMiddleware.js'; // <-- IMPORTAMOS EL MIDDLEWARE
import { getAllMatches, getMatchById, createMatch, updateMatch, getDailySchedule } from '../controllers/MatchController.js';

const router = Router();

// --- RUTAS PÚBLICAS (Cualquiera consume) ---
router.get('/', getAllMatches);
router.get('/schedule/daily', getDailySchedule);
router.get('/:id', getMatchById);

// --- RUTAS PRIVADAS (Solo el Admin usa) ---
router.post('/', verifyAdmin, createMatch);
router.put('/:id', verifyAdmin, updateMatch);

export default router;