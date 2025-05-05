import mongoose from "mongoose";
import moment from "moment-timezone";

// Esquema de Reserva
const reservaSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "El ID del usuario es requerido"],
        refPath: "userType",
    },
    userRol: {
        type: String,
        required: [true, "El rol del usuario es requerido"],
        enum: ["Estudiante", "Docente", "Admin"],
    },
    userAuthorizationID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "El ID de autorización es requerido"],
    },
    placeID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "El ID del lugar es requerido"],
        ref: "placeType"
    },
    placeType: {
        type: String,
        required: [true, "El tipo de lugar es requerido"],
        enum: ["Aula", "Laboratorio"],
    },
    purpose: {
        type: String,
        required: [true, "El propósito es requerido"],
        enum: [
            "Clase",
            "Prueba/Examen",
            "Proyecto",
            "Evento/Capacitación",
            "Otro",
        ],
    },
    description: {
        type: String,
        required: [true, "La descripción es requerida"],
        maxlength: [200, "La descripción no puede tener más de 200 caracteres"],
    },
    status: {
        type: String,
        required: [true, "El estado es requerido"],
        enum: ["Pendiente", "Aprobada", "Rechazada", "Cancelada"],
        default: "Pendiente",
    },
    rejectReason: {
        type: String,
        default: null,
        maxlength: [200, "El motivo de rechazo no puede tener más de 200 caracteres"],
    },
    reservationDate: {
        type: Date,
        required: [true, "La fecha de reserva es requerida"],
        validate: {
            validator: function (value) {
                return moment(value).isAfter(moment());
            },
            message: "La fecha de reserva debe ser futura",
        },
    },
    startTime: {
        type: String,
        required: [true, "La hora de inicio es requerida"],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "La hora de inicio debe tener el formato HH:mm"],
        validate: {
            validator: function (time) {
                const [hours] = time.split(':').map(Number);
                return hours >= 7 && hours < 20;
            },
            message: "La hora de inicio debe estar entre las 07:00 y las 20:00",
        },
    },
    endTime: {
        type: String,
        required: [true, "La hora de fin es requerida"],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "La hora de inicio debe tener el formato HH:mm"],
        validate: {
            validator: function (time) {
                const [hours] = time.split(':').map(Number);
                const start = parseInt(this.startTime.split(':')[0]);
                return hours > start && hours <= 20;
            },
            message: "La hora de fin debe ser mayor a la hora de inicio y menor o igual a las 20:00",
        },
    },
    authorizationDate: {
        type: Date,
        default: null,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
    cancellationDate: {
        type: Date,
        default: null,
    }
})

// Método para verificar si la fecha y hora de reserva ya existe
reservaSchema.statics.isDateTimeReserved = async function (reservationDate, startTime, endTime, placeID) {
    const overlappingReservations = await this.find({
        reservationDate,
        placeID,
        status: { $in: ["Aprobada", "Pendiente"] },
        $or: [
            {
                startTime: { $gte: startTime, $lt: endTime },
            },
            {
                endTime: { $gt: startTime, $lte: endTime },
            },
            {
                startTime: { $lt: startTime },
                endTime: { $gt: endTime },
            },
        ],
    });

    return overlappingReservations.length > 0;
};

export default mongoose.model("Reserva", reservaSchema);