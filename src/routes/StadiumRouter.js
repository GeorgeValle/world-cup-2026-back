import { Router } from 'express';
import { getAllStadiums, createStadium, getStadiumById, getStadiumByName } from '../controllers/StadiumController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js'; // <-- IMPORTAMOS EL MIDDLEWARE

const router = Router();

// --- RUTAS PÚBLICAS (Cualquiera consume) ---
router.get('/', getAllStadiums);
router.get('/:id', getStadiumById);
router.get('/:name', getStadiumByName);

// --- RUTAS PRIVADAS (Solo el Admin usa) ---
router.post('/',verifyAdmin, createStadium);

export default router;