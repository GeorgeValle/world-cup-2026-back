import { Schema, model } from 'mongoose';

const stadiumSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'stadiums'

});

export default model('Stadium', stadiumSchema);