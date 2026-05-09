// src/controllers/AdminController.js
import TransitionService from '../services/TransitionService.js';

/**
 * Controlador para la transición manual de grupos a eliminatorias.
 * Se dispara desde el selector del panel administrativo.
 */
export const processGroupClassification = async (req, res) => {
    try {
        const { group } = req.body; 

        if (!group) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Es necesario especificar el grupo para procesar la transición.' 
            });
        }

        // Ejecutamos el motor de transición (Tercer Motor)
        await TransitionService.allocateGroupQualifiers(group);

        res.status(200).json({ 
            status: 'success', 
            message: `Los clasificados del Grupo ${group} han sido inyectados en el cuadro de dieciseisavos.` 
        });
    } catch (error) {
        console.error(`[AdminController - Transition Error]: ${error.message}`);
        res.status(500).json({ status: 'error', message: error.message });
    }
};