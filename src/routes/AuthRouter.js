import { Router } from 'express';
//import * as AuthController from '../controllers/AuthController.js';
import { login, logout, getMe } from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout); // <-- Nueva ruta de logout
// Esta ruta es la que consultará el Front en cada carga inicial (App.js o un useEffect)
router.get('/me', verifyToken, getMe);

export default router;