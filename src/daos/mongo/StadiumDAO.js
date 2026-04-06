import MongoDAO from '../MongoDAO.js';
import StadiumModel from '../../models/StadiumModel.js';

class StadiumDAO extends MongoDAO {
    constructor() {
        super(StadiumModel);
    }
    
    async getByName(name) {
        return await this.model.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    }
}

export default StadiumDAO;