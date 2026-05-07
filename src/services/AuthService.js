import { UserDAO } from '../daos/Factory.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (email, password) => {
    // 1. Verificar si el usuario existe
    const user = await UserDAO.getByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');

    // 2. Comparar la contraseña ingresada con el hash de la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Credenciales inválidas');

    // 3. Generar el Token (El pasaporte)
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Expira en 1 día
    );

    return { token, email: user.email, role: user.role };
};