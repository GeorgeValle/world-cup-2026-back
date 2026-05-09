// src/routes/AdminRoute.js
import { Router } from 'express';
import * as AdminController from '../controllers/AdminController.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js'; 

const router = Router();

// Aplicamos el escudo a todas las rutas de este archivo
router.use(verifyAdmin);

// Esta ruta será la que use tu selector en el frontend
router.post('/classify-group', AdminController.processGroupClassification);

export default router;