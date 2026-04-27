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

export const updateMatch = async (id, updateData) => {
    // 1. Verificamos que el partido exista
    const match = await MatchDAO.getById(id);
    if (!match) throw new Error('Partido no encontrado para actualizar');

    // 2. Lo actualizamos en la DB
    return await MatchDAO.update(id, updateData);
};

export const getDailySchedule = async (clientDateStr) => {
    const targetDate = clientDateStr ? new Date(clientDateStr) : new Date();

    // Lógica de cálculo de tiempos (Negocio)
    const startOfToday = new Date(targetDate);
    startOfToday.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date(targetDate);
    endOfToday.setUTCHours(23, 59, 59, 999);

    // 1. Pedimos al DAO los partidos de hoy (Pasa-manos)
    const todayMatches = await MatchDAO.getByDateRange(startOfToday, endOfToday);

    // 2. Buscamos el próximo día con actividad
    // Primero el DAO nos dice cuál es el siguiente partido
    const nextMatch = await MatchDAO.getFirstAfter(endOfToday);

    let nextMatches = [];
    let nextDateLabel = null;

    if (nextMatch) {
        const startOfNextDay = new Date(nextMatch.date);
        startOfNextDay.setUTCHours(0, 0, 0, 0);

        const endOfNextDay = new Date(nextMatch.date);
        endOfNextDay.setUTCHours(23, 59, 59, 999);

        // Volvemos a usar el método genérico del DAO para traer el bloque de ese día
        nextMatches = await MatchDAO.getByDateRange(startOfNextDay, endOfNextDay);
        nextDateLabel = startOfNextDay.toISOString();
    }

    return {
        today: todayMatches,
        next: nextMatches,
        nextDate: nextDateLabel
    };
};