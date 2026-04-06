import * as StadiumService from '../services/StadiumService.js';
import { z } from 'zod';

const createStadiumSchema = z.object({
    name: z.string().min(3, { error: "El nombre debe tener al menos 3 caracteres" }),
    country: z.string().min(3, { error: "El país es obligatorio" }),
    city: z.string().min(2, { error: "La ciudad es obligatoria" }),
    address: z.string().optional(),
    capacity: z.number().int().positive({ error: "La capacidad debe ser un número positivo" })
});

export const getAllStadiums = async (req, res) => {
    try {
        const stadiums = await StadiumService.getStadiums();
        res.status(200).json({ status: 'success', data: stadiums });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const createStadium = async (req, res) => {
    try {
        const validatedData = createStadiumSchema.parse(req.body);
        const newStadium = await StadiumService.createStadium(validatedData);
        res.status(201).json({ status: 'success', data: newStadium });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', errors: error.errors });
        }
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const getStadiumById = async (req, res) => {
    try {
        const { id } = req.params;
        const stadium = await StadiumService.getStadiumById(id);
        res.status(200).json({ status: 'success', data: stadium });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

export const getStadiumByName = async (req, res) => {
    try {
        const { name } = req.params;
        const stadium = await StadiumService.getStadiumByName(name);
        res.status(200).json({ status: 'success', data: stadium });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};