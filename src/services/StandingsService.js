import { MatchDAO, TeamDAO } from '../daos/Factory.js';

// ==========================================
// Función Auxiliar para calcular estadísticas
// ==========================================
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

    const standings = Object.values(statsMap);

    standings.forEach((stat) => {
        stat.dif = stat.gf - stat.gc;
    });

    return standings;
    //return Object.values(statsMap);
};

// ==========================================
// POST: Actualizar un grupo específico
// ==========================================
export const updateGroupStandings = async (group) => {
    console.log(`[StandingsEngine] Iniciando recálculo para el Grupo ${group}`);

    // Obtener todos los partidos finalizados del grupo
    const matches = await MatchDAO.getByGroupAndStatus(group, 'FINISHED');
    const isGroupClosed = matches.length === 6;

    // Obtener los equipos del grupo
    const teams = await TeamDAO.getByGroup(group);

    // Calcular tabla
    const standings = calculateStats(teams, matches);

    // Ordenar tabla
    standings.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.dif !== a.dif) return b.dif - a.dif;
        return b.gf - a.gf;
    });

    // Actualizar Base de Datos
    for (let i = 0; i < standings.length; i++) {
        const teamStats = standings[i];
        const teamId = teamStats.team._id;
        
        let newQualifiedTo = null;

        if (isGroupClosed) {
            if (i === 0 || i === 1) newQualifiedTo = 'ROUND_OF_32'; // 1ro y 2do
            else if (i === 2) newQualifiedTo = null;                // 3ro en espera
            else newQualifiedTo = 'ELIMINATED';                     // 4to
        }

        const currentTeam = await TeamDAO.getById(teamId);
        const finalQualifiedTo = currentTeam.qualifiedTo !== null && !isGroupClosed 
            ? currentTeam.qualifiedTo 
            : newQualifiedTo;

        // ACÁ ESTÁ EL ARREGLO DE updateTeam a update
        await TeamDAO.update(teamId, {
            position: i + 1,
            qualifiedTo: finalQualifiedTo
        });
    }

    return standings;
};

// ==========================================
// GET: Obtener todos los grupos para el Dashboard
// ==========================================
export const getAllGroupsStandings = async () => {
    const allTeams = await TeamDAO.getAll();
    const allMatches = await MatchDAO.getAll();
    const finishedGroupMatches = allMatches.filter(m => 
        m.stage && m.stage.startsWith('GRUPO') && m.status === 'FINISHED'
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

        return {
            group: letter,
            teams: sorted
        };
    });
};