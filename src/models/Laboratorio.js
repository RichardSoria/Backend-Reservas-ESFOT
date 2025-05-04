import mongoose from "mongoose";

// Esquema del modelo de Laboratorio
const laboratorioSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código del laboratorio es requerido'],
        unique: true,
        match: [/^E\d{2}\/PB\d\/E\d{3}$/, 'Formato inválido (ej: E21/PB2/E035)'],
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
    specialty: {
        type: String,
        required: [true, 'La especialidad es requerida'],
        enum: [
            'TICs',
            'Desarrollo de Software',
            'Redes y Telecomunicaciones',
            'Electomecánica',
            'Agua y Saneamiento Ambiental',
            'Procesamiento de Alimentos',
            'Procesamiento Industrial de la Madera',
        ]},
    equipmentPC: {
        type: Boolean,
        default: false
    },
    equipmentProyector: {
        type: Boolean,
        default: false
    },
    equipmentInteractiveScreen: {
        type: Boolean,
        default: false
    },
    equipamentNetwork: {
        type: Boolean,
        default: false
    },
    equipamentElectromechanical: {
        type: Boolean,
        default: false
    },
    equipamentWater: {
        type: Boolean,
        default: false
    },
    equipamentFood: {
        type: Boolean,
        default: false
    },
    equipamentWood: {
        type: Boolean,
        default: false
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es requerida'],
        min: [1, 'La capacidad debe ser al menos 1']
    },
    size: {
        type: String,
        required: [true, 'El tamaño es requerido'],
        enum: {
            values: ['pequeño', 'mediano', 'grande'],
            message: 'El tamaño debe ser pequeño, mediano o grande'
        }
    },
    numberReservations: {
        type: Number,
        default: 0
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

// Exportar el modelo
export default mongoose.model('Laboratorio', laboratorioSchema);