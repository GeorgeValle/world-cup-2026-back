import UserModel from '../../models/UserModel.js';

export default class UserMongo {
    async getByEmail(email) {
        return await UserModel.findOne({ email });
    }
    async create(userData) {
        return await UserModel.create(userData);
    }
}