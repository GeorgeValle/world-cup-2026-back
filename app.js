import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import teamRouter from './src/routes/TeamRouter.js';
import stadiumRouter from './src/routes/StadiumRouter.js';

// 1. Cargar variables de entorno SIEMPRE al principio
dotenv.config();

// 2. Ejecutar la conexión a la base de datos
connectDB();

// 3. Inicializar Express
const app = express();

// 4. Middlewares globales
app.use(cors()); // Permite que tu frontend de Vite se conecte sin errores de CORS
app.use(express.json()); // Permite recibir JSON en el req.body
app.use(express.urlencoded({ extended: true })); 

// 5. Rutas (Acá vamos a ir montando los routers después)
app.use('/api/teams', teamRouter);
app.use('/api/stadiums', stadiumRouter);
app.get('/', (req, res) => {
    res.json({ message: 'API Fixture Mundial 2026 funcionando 🏆' });
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// 6. Levantar el servidor
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});