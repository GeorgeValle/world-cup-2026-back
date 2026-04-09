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
    status: z.enum(['PENDING', 'PLAYING', 'FINISHED'], { error: "Estado inválido" }).optional(),
    homeScore: z.number().int().min(0, { error: "Los goles no pueden ser negativos" }).optional(),
    awayScore: z.number().int().min(0, { error: "Los goles no pueden ser negativos" }).optional(),
    date: z.iso.datetime({ error: "La fecha debe ser ISO 8601" }).optional(),
    stadium: objectIdSchema.optional()
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
        
        const updatedMatch = await MatchService.updateMatch(id, validatedData);
        res.status(200).json({ status: 'success', data: updatedMatch });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};