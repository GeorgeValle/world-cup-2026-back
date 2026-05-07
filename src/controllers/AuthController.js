import * as AuthService from '../services/AuthService.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login(email, password);
        
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        res.status(401).json({ status: 'error', message: error.message });
    }
};