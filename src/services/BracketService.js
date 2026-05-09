import { MatchDAO, TeamDAO } from '../daos/Factory.js'; // Ahora sí vamos a usar TeamDAO

export default class BracketService {
    // =========================================================
    // AVANCE DE ELIMINATORIAS (De Partido a Partido)
    // =========================================================
    static async progressKnockoutWinner(finishedMatch) {
        // 1. Si no hay un próximo partido configurado (ej: es la Final), detenemos el avance de partidos
        // PERO debemos seguir ejecutando para actualizar el "qualifiedTo" del ganador de la Final
        
        // 2. Determinamos quién ganó
        let winnerId = null;
        let loserId = null;

        if (finishedMatch.homeScore > finishedMatch.awayScore) {
            winnerId = finishedMatch.homeTeam;
            loserId = finishedMatch.awayTeam;
        } else if (finishedMatch.awayScore > finishedMatch.homeScore) {
            winnerId = finishedMatch.awayTeam;
            loserId = finishedMatch.homeTeam;
        } else {
            // Empate: definen los penales
            if (finishedMatch.homePenaltyScore > finishedMatch.awayPenaltyScore) {
                winnerId = finishedMatch.homeTeam;
                loserId = finishedMatch.awayTeam;
            } else if (finishedMatch.awayPenaltyScore > finishedMatch.homePenaltyScore) {
                winnerId = finishedMatch.awayTeam;
                loserId = finishedMatch.homeTeam;
            } else {
                // Si también hay empate en penales (o son null), es inválido avanzar
                console.log(`[BracketEngine] Partido ${finishedMatch.matchNumber} sin ganador claro.`);
                return;
            }
        }

        // =========================================================
        // NUEVO BLOQUE: ACTUALIZACIÓN DEL ESTADO DE LOS EQUIPOS (qualifiedTo)
        // =========================================================
        // Mapa de progresión para saber a qué instancia avanza el ganador
        const nextRoundMap = {
            "16AVOS": "ROUND_OF_16",
            "OCTAVOS": "QUARTER_FINALS",
            "CUARTOS": "SEMI_FINALS",
            "SEMIFINAL": "FINAL",
            "3RO": null, // No avanza a ningún lado
            "FINAL": null // ¡Es el campeón!
        };

        if (winnerId) {
            const nextRoundValue = nextRoundMap[finishedMatch.stage];
            // Si el partido era la final, el ganador sigue en estado "FINAL" (o podés crear un estado "CHAMPION" en tu modelo)
            // Si no es la final, actualizamos a la siguiente ronda
            if (nextRoundValue) {
                await TeamDAO.updateTeam(winnerId, { qualifiedTo: nextRoundValue });
                console.log(`[BracketEngine] Equipo ${winnerId} clasificado a ${nextRoundValue}`);
            }
        }

        if (loserId) {
            // Si pierden en semis, van por el 3er puesto. Si no, quedan eliminados.
            const loserStatus = finishedMatch.stage === "SEMIFINAL" ? "THIRD_PLACE_MATCH" : "ELIMINATED";
            await TeamDAO.updateTeam(loserId, { qualifiedTo: loserStatus });
            console.log(`[BracketEngine] Equipo ${loserId} ahora está ${loserStatus}`);
        }
        // =========================================================


        // 3. Avanzamos al GANADOR al siguiente partido (Si existe)
        if (finishedMatch.nextMatchWinner && winnerId) {
            const nextMatch = await MatchDAO.getByMatchNumber(finishedMatch.nextMatchWinner);
            if (nextMatch) {
                const expectedPlaceholder = `Winner Match ${finishedMatch.matchNumber}`;
                const updateData = {};

                if (nextMatch.placeholderHome === expectedPlaceholder) updateData.homeTeam = winnerId;
                else if (nextMatch.placeholderAway === expectedPlaceholder) updateData.awayTeam = winnerId;

                if (Object.keys(updateData).length > 0) {
                    await MatchDAO.updateMatch(nextMatch._id, updateData);
                    console.log(`[BracketEngine] Ganador del partido ${finishedMatch.matchNumber} movido al partido ${nextMatch.matchNumber}`);
                }
            }
        }

        // 4. Avanzamos al PERDEDOR al siguiente partido (Solo para las Semis -> Tercer Puesto)
        if (finishedMatch.nextMatchLoser && loserId) {
            const loserMatch = await MatchDAO.getByMatchNumber(finishedMatch.nextMatchLoser);
            if (loserMatch) {
                const expectedLoserPlaceholder = `Loser Match ${finishedMatch.matchNumber}`;
                const updateLoserData = {};

                if (loserMatch.placeholderHome === expectedLoserPlaceholder) updateLoserData.homeTeam = loserId;
                else if (loserMatch.placeholderAway === expectedLoserPlaceholder) updateLoserData.awayTeam = loserId;

                if (Object.keys(updateLoserData).length > 0) {
                    await MatchDAO.updateMatch(loserMatch._id, updateLoserData);
                    console.log(`[BracketEngine] Perdedor del partido ${finishedMatch.matchNumber} movido al partido ${loserMatch.matchNumber}`);
                }
            }
        }
    }
}