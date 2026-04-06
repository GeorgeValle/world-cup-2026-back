import { TeamDAO } from '../daos/Factory.js';
// Opcional: import logger from '../utils/logger.js';

export const getTeams = async () => {
    return await TeamDAO.getAll();
};

export const getTeamById = async (id) => {
    const team = await TeamDAO.getById(id);
    if (!team) throw new Error('Equipo no encontrado por ID');
    return team;
};

export const getTeamByName = async (name) => {
    const team = await TeamDAO.getByName(name);
    if (!team) throw new Error(`El equipo "${name}" no existe`);
    return team;
};

export const createTeam = async (teamData) => {
    // Regla de negocio: verificar si el equipo ya existe
    const existingTeam = await TeamDAO.getByName(teamData.name);
    if (existingTeam) {
        throw new Error(`El equipo ${teamData.name} ya existe en el fixture.`);
    }

    return await TeamDAO.create(teamData);
};