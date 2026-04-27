import * as TeamService from '../services/TeamService.js';
import { z } from 'zod';

// Zod Schema para validar la creación
const createTeamSchema = z.object({
    name: z.string().min(3, { error: "El nombre debe tener al menos 3 caracteres" }),
    shieldUrl: z.url({ error: "Debe ser una URL válida" }).optional(),
    group: z.string().length(1, { error: "El grupo debe ser exactamente de 1 letra" }),
    confederation: z.string().min(3, { error: "La confederación debe tener al menos 3 caracteres" })
});

const updateTeamSchema = z.object({
    name: z.string().min(2).optional(),
    shieldUrl: z.string().url().optional(),
    group: z.string().length(1).optional(),
    confederation: z.string().min(2).optional(),
    
    // NUEVOS CAMPOS
    position: z.number()
        .int()
        .min(1, { error: "La posición mínima es 1" })
        .max(4, { error: "La posición máxima es 4" })
        .nullable() // Permite que el valor sea null
        .optional(), // Permite que el campo ni siquiera se envíe en el Body
        
    qualifiedTo: z.string()
        .nullable()
        .optional()
});

export const getAllTeams = async (req, res) => {
    try {
        const teams = await TeamService.getTeams();
        res.status(200).json({ status: 'success', data: teams });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await TeamService.getTeamById(id);
        res.status(200).json({ status: 'success', data: team });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

export const getTeamByName = async (req, res) => {
    try {
        const { name } = req.params;
        const team = await TeamService.getTeamByName(name);
        res.status(200).json({ status: 'success', data: team });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

export const createTeam = async (req, res) => {
    try {
        // 1. Validar el body de la request con Zod
        const validatedData = createTeamSchema.parse(req.body);

        // 2. Llamar al servicio si la validación es exitosa
        const newTeam = await TeamService.createTeam(validatedData);
        
        res.status(201).json({ status: 'success', data: newTeam });
    } catch (error) {
        // Si es un error de Zod, lo manejamos distinto
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const updateTeam = async (req, res) => {
    try {
        // 1. Obtenemos el ID de la URL
        const { id } = req.params;

        // 2. Pasamos el body por nuestro nuevo esquema Zod. 
        // Si hay un error de validación, Zod cortará la ejecución aquí y saltará al catch.
        const validatedData = updateTeamSchema.parse(req.body);

        // 3. Llamamos al servicio para que actualice la base de datos
        const updatedTeam = await TeamService.updateTeam(id, validatedData);
        
        res.status(200).json({ status: 'success', data: updatedTeam });
    } catch (error) {
        // Atajamos los errores de validación de Zod
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        // Atajamos errores de base de datos (ej: equipo no encontrado)
        res.status(400).json({ status: 'error', message: error.message });
    }
};