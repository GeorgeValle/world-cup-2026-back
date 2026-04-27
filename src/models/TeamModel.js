import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    shieldUrl: {
        type: String,
        default: 'default-shield.png'
    },
    group: {
        type: String,
        required: true,
        uppercase: true, // Fuerza a que siempre sea mayúscula (ej: 'A', 'B')
        trim: true,
        maxLength: 1     // Como son letras de la A a la L, con 1 caracter alcanza
    },
    confederation: {
        type: String,
        required: true,
        uppercase: true, // Ej: 'CONMEBOL', 'UEFA', 'CONCACAF'
        trim: true
    },
    position: {
        type: Number,
        default: null, // Por defecto no tiene posición hasta que termine el grupo
        min: 1,
        max: 4
    },
    qualifiedTo: {
        type: String,
        default: null, // Ejemplo: 'ROUND_OF_32', 'ELIMINATED'
        enum: ['16AVOS','OCTAVOS','CUARTOS','SEMIFINAL','3RO','FINAL','ELIMINADO'],
        uppercase: true
    }
}, {
    timestamps: true
});

export default model('Team', teamSchema);