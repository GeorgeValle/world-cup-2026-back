import { MatchDAO } from '../daos/Factory.js';

export const getMatches = async () => {
    return await MatchDAO.getAll();
};

export const getMatchById = async (id) => {
    const match = await MatchDAO.getById(id);
    if (!match) throw new Error('Partido no encontrado');
    return match;
};

export const createMatch = async (matchData) => {
    if (matchData.homeTeam === matchData.awayTeam) {
        throw new Error('Un equipo no puede jugar contra sí mismo');
    }
    return await MatchDAO.create(matchData);
};