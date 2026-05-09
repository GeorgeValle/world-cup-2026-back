import MongoDAO from '../MongoDAO.js';
import MatchModel from '../../models/MatchModel.js';

class MatchDAO extends MongoDAO {
    constructor() {
        super(MatchModel);
    }

    async getAll() {
        // Poblamos las tres relaciones
        return await this.model.find()
            .populate('homeTeam')
            .populate('awayTeam')
            .populate('stadium');
    }

    async getById(id) {
        return await this.model.findById(id)
            .populate('homeTeam')
            .populate('awayTeam')
            .populate('stadium');
    }

    async create(data) {
        // Creamos el partido en la DB
        const newMatch = await this.model.create(data);
        // Devolvemos el documento RECIÉN creado, pero poblado
        return await newMatch.populate(['homeTeam', 'awayTeam', 'stadium']);
    }

    async update(id, updateData) {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true })
            .populate(['homeTeam', 'awayTeam', 'stadium']);
    }

    /**
     * Busca todos los partidos en un rango de tiempo, poblados y ordenados.
     */
    async getByDateRange(start, end) {
        return await MatchModel.find({
            date: { $gte: start, $lte: end }
        })
        .populate(['homeTeam', 'awayTeam', 'stadium'])
        .sort({ date: 1 });
    }

    /**
     * Busca el primer partido que ocurra después de una fecha específica.
     */
    async getFirstAfter(date) {
        return await MatchModel.findOne({
            date: { $gt: date }
        })
        .populate(['homeTeam', 'awayTeam', 'stadium'])
        .sort({ date: 1 });
    }

    /**
     * Busca un partido específico por su número de eliminatoria (Ej: 89)
     */
    async getByMatchNumber(matchNumber) {
        return await MatchModel.findOne({ matchNumber });
    }

    async getByPlaceholderHome(placeholder) {
        return await MatchModel.findOne({ placeholderHome: placeholder });
    }

    async getByPlaceholderAway(placeholder) {
        return await MatchModel.findOne({ placeholderAway: placeholder });
    }
}

export default MatchDAO;