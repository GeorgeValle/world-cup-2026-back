import * as AuthService from '../services/AuthService.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Obtenemos el token y los datos del usuario desde el Service
        const { token, role, email: userEmail } = await AuthService.login(email, password);
        
        // Creamos la Cookie HttpOnly
        res.cookie('adminToken', token, {
            httpOnly: true, // INVISIBLE PARA JAVASCRIPT (Anti-XSS)
            secure: process.env.NODE_ENV === 'production', // Solo viaja por HTTPS en producción
            sameSite: 'strict', // Protege contra ataques CSRF
            maxAge: 24 * 60 * 60 * 1000 // Expira en 24 horas (en milisegundos)
        });

        // Devolvemos el JSON SIN el token
        res.status(200).json({ 
            status: 'success', 
            data: { email: userEmail, role } 
        });
    } catch (error) {
        res.status(401).json({ status: 'error', message: error.message });
    }
};

// En tu AuthController del backend:
export const logout = (req, res) => {
    // Borramos la cookie usando la misma configuración con la que fue creada
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/' // Importante: asegura que se borre para toda la aplicación
    });

    return res.status(200).json({
        status: 'success',
        message: 'Sesión cerrada correctamente'
    });
};

export const getMe = async (req, res) => {
    try {
        // El middleware verifyToken ya dejó los datos del usuario en req.user
        // Solo devolvemos lo necesario para que Redux se reconstruya
        return res.status(200).json({
            status: 'success',
            data: {
                user: {
                    email: req.user.email,
                    role: req.user.role
                }
            }
        });
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Sesión no válida o expirada'
        });
    }
};

// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const result = await AuthService.login(email, password);
        
//         res.status(200).json({ status: 'success', data: result });
//     } catch (error) {
//         res.status(401).json({ status: 'error', message: error.message });
//     }
// };