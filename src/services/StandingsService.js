import { MatchDAO, TeamDAO } from '../daos/Factory.js';

export default class StandingsService {
    static async generateStandingsByGroup(group) {
        try {
            console.log(`Iniciando generación de posiciones para el Grupo ${group}`);

            // Obtener todos los partidos finalizados del grupo
            const matches = await MatchDAO.getByGroupAndStatus(group, 'FINISHED');
            console.log(`Se encontraron ${matches.length} partidos finalizados para el Grupo ${group}`);

            // Verificar si el grupo ya terminó (6 partidos jugados)
            const isGroupClosed = matches.length === 6;

            // Obtener los equipos del grupo
            const teams = await TeamDAO.getByGroup(group);
            console.log(`Equipos en el Grupo ${group}:`, teams.map(t => t.name).join(', '));

            // ... (Toda la lógica de inicialización y cálculo de estadísticas que ya tenés se mantiene igual)
            const stats = {};
            teams.forEach(team => { /* ... */ });
            matches.forEach(match => { /* ... */ });

            const standings = Object.values(stats);

            standings.sort((a, b) => {
                if (b.pts !== a.pts) return b.pts - a.pts;
                if (b.dif !== a.dif) return b.dif - a.dif;
                return b.gf - a.gf;
            });

            // Actualizar posiciones y estado de clasificación en la BD
            console.log("Actualizando posiciones en la base de datos...");
            for (let i = 0; i < standings.length; i++) {
                const teamStats = standings[i];
                const teamId = teamStats.team._id;
                
                let newQualifiedTo = null;

                if (isGroupClosed) {
                    if (i === 0 || i === 1) { // Posiciones 1 y 2
                        newQualifiedTo = 'ROUND_OF_32';
                    } else if (i === 2) { // Posición 3 (Queda en stand-by)
                        newQualifiedTo = null; 
                    } else { // Posición 4
                        newQualifiedTo = 'ELIMINATED';
                    }
                }

                // Respetamos si el admin forzó un valor manualmente
                const currentTeam = await TeamDAO.getById(teamId);
                const finalQualifiedTo = currentTeam.qualifiedTo !== null && !isGroupClosed 
                    ? currentTeam.qualifiedTo 
                    : newQualifiedTo;

                await TeamDAO.updateTeam(teamId, {
                    position: i + 1,
                    qualifiedTo: finalQualifiedTo
                });
            }

            console.log(`Generación de posiciones para el Grupo ${group} completada con éxito.`);
            return standings;

        } catch (error) {
            console.error(`Error en StandingsService.generateStandingsByGroup para el grupo ${group}:`, error);
            throw new Error(`Error calculando posiciones: ${error.message}`);
        }
    }
}