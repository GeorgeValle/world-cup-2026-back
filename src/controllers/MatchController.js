import BracketService from '../services/BracketService.js';
import * as MatchService from '../services/MatchService.js';
import { z } from 'zod';

// Un validador reutilizable para ObjectIds de MongoDB (24 caracteres hex)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Debe ser un ID de MongoDB válido" });

const createMatchSchema = z.object({
    homeTeam: objectIdSchema,
    awayTeam: objectIdSchema,
    stadium: objectIdSchema,
    // Zod v4 usa z.iso.datetime() en lugar de z.string().datetime()
    date: z.iso.datetime({ error: "La fecha debe ser un formato ISO 8601 válido" }),
    stage: z.string().min(3, { error: "La fase es obligatoria" })
});

const updateMatchSchema = z.object({
    // Estados y Resultados
    status: z.enum(['PENDING', 'PLAYING', 'FINISHED'], { error: "Estado inválido" }).optional(),
    homeScore: z.number().int().min(0, { error: "Los goles no pueden ser negativos" }).optional(),
    awayScore: z.number().int().min(0, { error: "Los goles no pueden ser negativos" }).optional(),
    homePenaltyScore: z.number().int().min(0).optional(),
    awayPenaltyScore: z.number().int().min(0).optional(),
    
    // Datos del Encuentro
    date: z.iso.datetime({ error: "La fecha debe ser ISO 8601" }).optional(),
    stadium: objectIdSchema.optional(),
    
    // Equipos (Vital para poder asignarlos manualmente si hace falta)
    homeTeam: objectIdSchema.optional(),
    awayTeam: objectIdSchema.optional(),

    // --- NUEVOS CAMPOS DEL BRACKET ENGINE ---
    matchNumber: z.number().int().positive().optional(),
    placeholderHome: z.string().optional(),
    placeholderAway: z.string().optional(),
    nextMatchWinner: z.number().int().positive().optional(),
    nextMatchLoser: z.number().int().positive().optional()
});

export const getAllMatches = async (req, res) => {
    try {
        const matches = await MatchService.getMatches();
        res.status(200).json({ status: 'success', data: matches });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await MatchService.getMatchById(id);
        res.status(200).json({ status: 'success', data: match });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

export const createMatch = async (req, res) => {
    try {
        const validatedData = createMatchSchema.parse(req.body);
        const newMatch = await MatchService.createMatch(validatedData);
        res.status(201).json({ status: 'success', data: newMatch });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const updateMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = updateMatchSchema.parse(req.body);
        
        // 1. Guardamos los cambios en la BD
        const updatedMatch = await MatchService.updateMatch(id, validatedData);
        
        // 2. ⚡ DISPARADOR DEL BRACKET ENGINE ⚡
        // Verificamos si el admin envió el estado FINISHED y si es un partido de eliminatorias (del 73 al 104)
        if (validatedData.status === 'FINISHED' && updatedMatch.matchNumber >= 73) {
            // Ejecutamos el motor para que avance al ganador.
            // El .catch evita que si falla algo acá, se rompa la respuesta al frontend.
            BracketService.progressKnockoutWinner(updatedMatch).catch(err => {
                console.error("[BracketEngine Error]: Hubo un problema al avanzar al equipo:", err);
            });
        }

        // 3. Respondemos al frontend con éxito
        res.status(200).json({ status: 'success', data: updatedMatch });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const getDailySchedule = async (req, res) => {
    try {
        // Capturamos el query param opcional (ej: /api/matches/schedule/daily?date=2026-06-11)
        const { date } = req.query; 
        
        const schedule = await MatchService.getDailySchedule(date);
        
        res.status(200).json({ status: 'success', data: schedule });
    } catch (error) {
        console.error("❌ Error en el catch:", error); //
        res.status(500).json({ status: 'error', message: error.message });
    }
};