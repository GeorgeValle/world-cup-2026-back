import { Schema, model } from 'mongoose';

const matchSchema = new Schema({
    homeTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team', // Referencia exacta al nombre del modelo Team
        required: true
    },
    awayTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    stadium: {
        type: Schema.Types.ObjectId,
        ref: 'Stadium', // Referencia exacta al nombre del modelo Stadium
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stage: {
        type: String,
        required: true,
        uppercase: true, // Ej: 'GRUPO A', 'OCTAVOS'
        trim: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PLAYING', 'FINISHED'],
        default: 'PENDING'
    },
    homeScore: {
        type: Number,
        default: null
    },
    awayScore: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

export default model('Match', matchSchema);