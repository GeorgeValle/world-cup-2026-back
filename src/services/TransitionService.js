import { MatchDAO, TeamDAO } from '../daos/Factory.js';

export default class TransitionService {
    
    /**
     * Toma los clasificados de un grupo específico y los inyecta en los placeholders 
     * correspondientes de la primera ronda de eliminatorias (ROUND_OF_32).
     */
    static async allocateGroupQualifiers(group) {
        console.log(`[TransitionEngine] Asignando clasificados del Grupo ${group} a eliminatorias...`);

        // 1. Buscamos los equipos de ESTE grupo que tengan el ticket a ROUND_OF_32
        const qualifiedTeams = await TeamDAO.getQualifiedByGroup(group, 'ROUND_OF_32');

        for (const team of qualifiedTeams) {
            // Generamos el string mágico que coincida con tu MD (Ej: "1st Group A" o "2nd Group C")
            const positionString = team.position === 1 ? '1st' : '2nd';
            const placeholder = `${positionString} Group ${team.group}`;

            // 2. Buscamos el partido de eliminatorias que espera a este equipo como LOCAL
            const matchAsHome = await MatchDAO.getByPlaceholderHome(placeholder);
            if (matchAsHome) {
                // Usamos updateMatch del DAO para reescribir el equipo
                await MatchDAO.updateMatch(matchAsHome._id, { homeTeam: team._id });
                console.log(`[TransitionEngine] ${team.name} asignado como Local al partido ${matchAsHome.matchNumber}`);
                continue; // Un equipo no puede ser local y visitante a la vez
            }

            // 3. Si no era local, buscamos el partido que lo espera como VISITANTE
            const matchAsAway = await MatchDAO.getByPlaceholderAway(placeholder);
            if (matchAsAway) {
                await MatchDAO.updateMatch(matchAsAway._id, { awayTeam: team._id });
                console.log(`[TransitionEngine] ${team.name} asignado como Visitante al partido ${matchAsAway.matchNumber}`);
            }
        }
        
        console.log(`[TransitionEngine] Asignación del Grupo ${group} completada.`);
    }
}