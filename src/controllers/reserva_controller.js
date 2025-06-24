import Reserva from '../models/Reserva.js';
import mongoose from "mongoose";
import moment from 'moment-timezone';
import Admin from '../models/Admin.js';
import Docente from '../models/Docente.js';
import Estudiante from '../models/Estudiante.js';
import Aula from '../models/Aula.js';
import Laboratorio from '../models/laboratorio.js';

// Método para crear una nueva reserva	
const createReserva = async (req, reply) => {
    try {

        const userLogged = req.adminBDD || req.docenteBDD || req.estudianteBDD;

        if (!userLogged) {
            return reply.code(403).send({ message: 'No tienes permiso para crear reservas' });
        }

        const { reservationDate, startTime, endTime, placeID, purpose, description } = req.body;

        const userID = userLogged._id;
        const userRol = userLogged.rol
        
        const parsedReservationDate = moment(reservationDate).tz('America/Guayaquil').startOf('day').toDate();


        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return reply.code(400).send({ message: 'El ID de usuario no es válido' });
        }
        if (!mongoose.Types.ObjectId.isValid(placeID)) {
            return reply.code(400).send({ message: 'El ID de lugar no es válido' });
        }

        // Verificar si la fecha y hora de reserva ya existe
        const isReserved = await Reserva.isDateTimeReserved(parsedReservationDate, startTime, endTime, placeID);
        if (isReserved) {
            return reply.code(409).send({ message: 'La fecha y hora de reserva ya existe' });
        }

        // Verificar si las fecha y hora de reserva son válidas
        if (!Reserva.isValidTimeRange(startTime, endTime)) {
            return reply.code(400).send({ message: 'Las horas de inicio y fin deben ser válidas y estar entre las 07:00 y las 20:00' });
        }

        // Verificar si la reserva es futura
        if (!Reserva.isFutureTime(reservationDate, startTime, endTime)) {
            return reply.code(400).send({ message: 'La reserva debe ser para una fecha y hora futura' });
        }


        const place = await Aula.findById(placeID) || await Laboratorio.findById(placeID)

        if (!place) {
            return reply.code(404).send({ message: 'El lugar no existe' });
        }

        const placeType = place instanceof Aula ? 'Aula' : 'Laboratorio';


        // Crear la nueva reserva
        const newReserva = new Reserva({
            userID,
            userRol,
            placeID,
            placeType,
            reservationDate: parsedReservationDate,
            startTime,
            endTime,
            purpose,
            description
        });

        // Guardar la reserva en la base de datos
        await newReserva.save();

        return reply.code(201).send({ message: 'Reserva creada exitosamente', reserva: newReserva });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });
    }

}

// Método para generar la reserva
const generateReserva = async (req, reply) => {
    try {
        const adminBDDLogged = req.adminBDD;

        if (!adminBDDLogged) {
            return reply.code(403).send({ message: 'No tienes permiso para generar reservas' });
        }
        const { userID, reservationDate, startTime, endTime, placeID, purpose, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return reply.code(400).send({ message: 'El ID de usuario no es válido' });
        }

        if (!mongoose.Types.ObjectId.isValid(placeID)) {
            return reply.code(400).send({ message: 'El ID de lugar no es válido' });
        }

        // Verificar si la fecha y hora de reserva ya existe
        const isReserved = await Reserva.isDateTimeReserved(reservationDate, startTime, endTime, placeID);
        if (isReserved) {
            return reply.code(409).send({ message: 'La fecha y hora de reserva ya existe' });
        }

        // Verificar si el usuario existe
        const userBDD = await Docente.findById(userID) || await Estudiante.findById(userID);

        if (!userBDD) {
            return reply.code(404).send({ message: 'El usuario no existe' });
        }

        // Verificar si el lugar existe
        const placeBDD = await Aula.findById(placeID) || await Laboratorio.findById(placeID);

        if (!placeBDD) {
            return reply.code(404).send({ message: 'El lugar no existe' });
        }

        // Crear la nueva reserva
        const newReserva = new Reserva({
            userID,
            userRol: userBDD instanceof Docente ? 'Docente' : 'Estudiante',
            userAuthorizationID: adminBDDLogged._id,
            placeID,
            placeType: placeBDD instanceof Aula ? 'Aula' : 'Laboratorio',
            reservationDate,
            startTime,
            endTime,
            purpose,
            description
        });

        // Guardar la reserva en la base de datos
        await newReserva.save();

        return reply.code(201).send({ message: 'Reserva generada exitosamente', reserva: newReserva });

    } catch (error) {
        console.error('Error al generar la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });

    }
}

const approveReserva = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'El ID de reserva no es válido' });
        }

        // Verificar si la reserva existe
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return reply.code(404).send({ message: 'La reserva no existe' });
        }

        // Actualizar el estado de la reserva a "aprobada"
        reserva.status = 'Aprobada';
        reserva.userAuthorizationID = adminLogged._id; // Asignar el ID del administrador que aprueba la reserva
        reserva.authorizationDate = Date.now(); // Asignar la fecha de autorización
        await reserva.save();

        return reply.code(200).send({ message: 'Reserva aprobada exitosamente', reserva });

    } catch (error) {
        console.error('Error al aprobar la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });

    }
}

const rejectReserva = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;
        const { id } = req.params;
        const { rejectReason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'El ID de reserva no es válido' });
        }

        // Verificar si la reserva existe
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return reply.code(404).send({ message: 'La reserva no existe' });
        }

        // Actualizar el estado de la reserva a "rechazada"
        reserva.status = 'Rechazada';
        reserva.rejectReason = rejectReason || 'No se proporcionó motivo de rechazo';
        reserva.userAuthorizationID = adminLogged._id; // Asignar el ID del administrador que rechaza la reserva
        reserva.authorizationDate = Date.now(); // Asignar la fecha de autorización
        await reserva.save();

        return reply.code(200).send({ message: 'Reserva rechazada exitosamente', reserva });

    } catch (error) {
        console.error('Error al rechazar la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });

    }
}

const cancelReserva = async (req, reply) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'El ID de reserva no es válido' });
        }

        // Verificar si la reserva existe
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return reply.code(404).send({ message: 'La reserva no existe' });
        }

        // Actualizar el estado de la reserva a "cancelada"
        reserva.status = 'Cancelada';
        reserva.cancellationDate = Date.now(); // Asignar la fecha de cancelación
        await reserva.save();

        return reply.code(200).send({ message: 'Reserva cancelada exitosamente', reserva });

    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });

    }
}

// Métpdpdo para obtener todas las reservas

const getAllReservas = async (req, reply) => {
    try {
        const reservas = await Reserva.find().lean();

        const eventos = await Promise.all(
            reservas.map(async (reserva) => {
                const fecha = moment(reserva.reservationDate).format("YYYY-MM-DD");
                const start = new Date(`${fecha}T${reserva.startTime}`);
                const end = new Date(`${fecha}T${reserva.endTime}`);

                // Buscar el lugar
                let lugarNombre = "Lugar desconocido";
                if (reserva.placeType === "Aula") {
                    const aula = await Aula.findById(reserva.placeID).select("name").lean();
                    if (aula) lugarNombre = aula.name;
                } else if (reserva.placeType === "Laboratorio") {
                    const lab = await Laboratorio.findById(reserva.placeID).select("name").lean();
                    if (lab) lugarNombre = lab.name;
                }

                // Buscar el usuario según su rol
                let usuario = null;
                if (reserva.userRol === "Admin") {
                    usuario = await Admin.findById(reserva.userID).select("name lastName").lean();
                } else if (reserva.userRol === "Docente") {
                    usuario = await Docente.findById(reserva.userID).select("name lastName").lean();
                } else if (reserva.userRol === "Estudiante") {
                    usuario = await Estudiante.findById(reserva.userID).select("name lastName").lean();
                }

                const nombreCompleto = usuario ? `${usuario.name} ${usuario.lastName}` : "Usuario desconocido";

                return {
                    id: reserva._id,
                    title: `${reserva.description} - ${nombreCompleto}`,
                    start,
                    end,
                    reserva,
                    status: reserva.status,
                };
            })
        );

        return reply.code(200).send(eventos);
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        return reply.code(500).send({ message: "Error interno del servidor" });
    }
};

// Método para obtener una reserva por ID
const getReservaById = async (req, reply) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'El ID de reserva no es válido' });
        }

        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return reply.code(404).send({ message: 'La reserva no existe' });
        }

        return reply.code(200).send(reserva);

    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        return reply.code(500).send({ message: 'Error interno del servidor' });

    }
}

export {
    createReserva,
    generateReserva,
    approveReserva,
    rejectReserva,
    cancelReserva,
    getAllReservas,
    getReservaById
}