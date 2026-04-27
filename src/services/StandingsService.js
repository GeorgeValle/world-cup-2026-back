import { MatchDAO, TeamDAO } from '../daos/Factory.js';

/**
 * Lógica compartida para calcular estadísticas de un conjunto de equipos y partidos
 */
const calculateStats = (teams, matches) => {
    const statsMap = {};
    
    // Inicializar mapa de estadísticas
    teams.forEach(team => {
        statsMap[team._id.toString()] = {
            team: team,
            pj: 0, pg: 0, pe: 0, pp: 0,
            gf: 0, gc: 0, dif: 0, pts: 0
        };
    });

    // Procesar resultados
    matches.forEach(match => {
        const homeId = match.homeTeam._id?.toString() || match.homeTeam.toString();
        const awayId = match.awayTeam._id?.toString() || match.awayTeam.toString();
        
        if (statsMap[homeId] && statsMap[awayId]) {
            statsMap[homeId].pj += 1;
            statsMap[awayId].pj += 1;
            statsMap[homeId].gf += match.homeScore;
            statsMap[homeId].gc += match.awayScore;
            statsMap[awayId].gf += match.awayScore;
            statsMap[awayId].gc += match.homeScore;

            if (match.homeScore > match.awayScore) {
                statsMap[homeId].pts += 3; statsMap[homeId].pg += 1;
                statsMap[awayId].pp += 1;
            } else if (match.homeScore < match.awayScore) {
                statsMap[awayId].pts += 3; statsMap[awayId].pg += 1;
                statsMap[homeId].pp += 1;
            } else {
                statsMap[homeId].pts += 1; statsMap[homeId].pe += 1;
                statsMap[awayId].pts += 1; statsMap[awayId].pe += 1;
            }
        }
    });

    // Calcular diferencia y convertir a array
    return Object.values(statsMap).map(s => ({
        ...s,
        dif: s.gf - s.gc
    }));
};

/**
 * Función 1: Procesa un solo grupo, lo ordena y ACTUALIZA la base de datos (position/qualifiedTo)
 */
export const updateGroupStandings = async (groupLetter) => {
    const allTeams = await TeamDAO.getAll();
    const groupTeams = allTeams.filter(t => t.group === groupLetter.toUpperCase());
    
    const allMatches = await MatchDAO.getAll();
    const groupMatches = allMatches.filter(m => 
        m.stage === `GRUPO ${groupLetter.toUpperCase()}` && m.status === 'FINISHED'
    );

    const standings = calculateStats(groupTeams, groupMatches);

    // Ordenar: Puntos -> Dif Goles -> Goles Favor
    standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dif !== a.dif) return b.dif - a.dif;
        return b.gf - a.gf;
    });

    // Persistir en Base de Datos
    const updatePromises = standings.map((stats, index) => {
        const position = index + 1;
        const qualifiedTo = position <= 2 ? 'ROUND_OF_32' : 'ELIMINATED';
        return TeamDAO.update(stats.teamId || stats.team._id, { position, qualifiedTo });
    });

    await Promise.all(updatePromises);
    return standings;
};

/**
 * Función 2: Calcula y devuelve TODOS los grupos en un solo objeto para el Dashboard del Front
 */
export const getAllGroupsStandings = async () => {
    const allTeams = await TeamDAO.getAll();
    const allMatches = await MatchDAO.getAll();
    const finishedGroupMatches = allMatches.filter(m => 
        m.stage.startsWith('GRUPO') && m.status === 'FINISHED'
    );

    const allStats = calculateStats(allTeams, finishedGroupMatches);

    // Agrupar por letra
    const grouped = {};
    allStats.forEach(stat => {
        const letter = stat.team.group;
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(stat);
    });

    // Ordenar equipos dentro de cada grupo y devolver array final
    return Object.keys(grouped).sort().map(letter => {
        const sorted = grouped[letter].sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.dif !== a.dif) return b.dif - a.dif;
            return b.gf - a.gf;
        });
        return { group: letter, teams: sorted };
    });
};