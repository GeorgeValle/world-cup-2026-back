import { StadiumDAO } from '../daos/Factory.js';

export const getStadiums = async () => {
    return await StadiumDAO.getAll();
};

export const createStadium = async (stadiumData) => {
    const existingStadium = await StadiumDAO.getByName(stadiumData.name);
    if (existingStadium) {
        throw new Error(`El estadio ${stadiumData.name} ya está registrado.`);
    }
    
    return await StadiumDAO.create(stadiumData);
};

export const getStadiumById = async (id) => {
    const stadium = await StadiumDAO.getById(id);
    if (!stadium) throw new Error('Estadio no encontrado por ID');
    return stadium;
};

export const getStadiumByName = async (name) => {
    const stadium = await StadiumDAO.getByName(name);
    if (!stadium) throw new Error(`El estadio "${name}" no existe`);
    return stadium;
};