import * as StandingsService from '../services/StandingsService.js';

// GET /api/standings -> Trae todo el mundial
export const getAllStandings = async (req, res) => {
    try {
        const data = await StandingsService.getAllGroupsStandings();
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// POST /api/standings/:group -> Calcula y actualiza un grupo (ej: después de un partido)
export const updateGroup = async (req, res) => {
    try {
        const { group } = req.params;
        const data = await StandingsService.updateGroupStandings(group);
        res.status(200).json({ 
            status: 'success', 
            message: `Grupo ${group.toUpperCase()} actualizado en DB`, 
            data 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};