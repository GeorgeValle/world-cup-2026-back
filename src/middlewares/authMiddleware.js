import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        // 1. Extraemos el token de la cookie HttpOnly
        const token = req.cookies?.adminToken;
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No se encontró una sesión activa'
            });
        }

        // 2. Verificamos el JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Inyectamos los datos del usuario en el objeto Request
        // Así, cualquier controlador que venga después ya tiene el usuario a mano
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        console.error("[AuthMiddleware Error]:", error.message);
        return res.status(401).json({
            status: 'error',
            message: 'Sesión expirada o token inválido'
        });
    }
};

export const verifyAdmin = (req, res, next) => {
    try {
        // Sacamos el token directo de las cookies leídas por cookie-parser
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'No autenticado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({ status: 'error', message: 'Acceso denegado' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
    }
};

// export const verifyAdmin = (req, res, next) => {
//     try {
//         // 1. Sacar el token del header (formato "Bearer <token>")
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(401).json({ status: 'error', message: 'No enviaste el token de autenticación' });
//         }

//         const token = authHeader.split(' ')[1];

//         // 2. Verificar que el token sea válido y no haya sido alterado
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 3. Verificar que sea ADMIN
//         if (decoded.role !== 'ADMIN') {
//             return res.status(403).json({ status: 'error', message: 'Acceso denegado: No sos Administrador' });
//         }

//         // 4. Todo OK, lo dejamos pasar a la ruta
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
//     }
// };