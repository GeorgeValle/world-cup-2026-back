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
    res.clearCookie('adminToken');
    res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
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