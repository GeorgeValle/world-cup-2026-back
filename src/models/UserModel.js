import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['ADMIN'], default: 'ADMIN' }
}, { timestamps: true });

export default model('User', userSchema);