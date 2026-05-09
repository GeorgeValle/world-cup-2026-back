import { Schema, model } from 'mongoose';

const matchSchema = new Schema({
    homeTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team', // Referencia exacta al nombre del modelo Team
        default: null
    },
    awayTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    stadium: {
        type: Schema.Types.ObjectId,
        ref: 'Stadium', // Referencia exacta al nombre del modelo Stadium
        default: null
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
    },
    // NUEVOS CAMPOS PARA ELIMINATORIAS
    homePenaltyScore: {
        type: Number,
        default: null
    },
    awayPenaltyScore: {
        type: Number,
        default: null
    },
    // NUEVOS CAMPOS PARA EL BRACKET ENGINE
    matchNumber: { 
        type: Number, 
        unique: true, 
        sparse: true // Permite que los partidos de grupo no tengan este campo sin causar error de unicidad
    },
    placeholderHome: { type: String, default: null }, // Ej: "1st Group A"
    placeholderAway: { type: String, default: null }, // Ej: "2nd Group B"
    nextMatchWinner: { type: Number, default: null }, // ID del partido al que va el ganador
    nextMatchLoser: { type: Number, default: null },  // Solo para semis (partido 103)
}, 
    {
    timestamps: true
    });

export default model('Match', matchSchema);