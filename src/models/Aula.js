import mongoose from "mongoose";
import moment from "moment-timezone";

// Esquema del aula
const aulaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código del aula es requerido'],
        unique: true,
        match: [/^[A-Z]\d{2}\/[A-Z]{2}\d\/[A-Z]\d{3}$/, 'Formato inválido (ej: E21/PB2/E035)'],
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [20, 'El nombre no puede tener más de 20 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        maxlength: [100, 'La descripción no puede tener más de 100 caracteres']
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es requerida'],
        min: [1, 'La capacidad debe ser al menos 1']
    },
    size : {
        type: String,
        required: [true, 'El tamaño es requerido'],
        enum: {
            values: ['pequeño', 'mediano', 'grande'],
            message: 'El tamaño debe ser pequeño, mediano o grande'
        }
    },
    image: {
        type: String,
        required: [true, 'La imagen es requerida'],
    },
    status: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: null
    },
    enableDate: {
        type: Date,
        default: Date.now()
    },
    disableDate: {
        type: Date,
        default: null
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    enableBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    disableBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
});