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
}

export default MatchDAO;