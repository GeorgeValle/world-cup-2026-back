import MongoDAO from '../MongoDAO.js';
import TeamModel from '../../models/TeamModel.js';

class TeamDAO extends MongoDAO {
    constructor() {
        super(TeamModel);
    }

    // Ejemplo de método específico que solo aplica a Teams
    async getByName(name) {
        // Usamos una expresión regular para que no sea sensible a mayúsculas/minúsculas
        return await this.model.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }

    
}

export default TeamDAO;