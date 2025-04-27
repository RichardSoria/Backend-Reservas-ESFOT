import Docente from "../models/Docente.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendMailNewUser, sendMailRecoverPassword, sendMailNewPassword, sendMailUpdateUser, sendMailEnableUser, sendMailDisableUser } from "../config/nodemailer.js";

// Método para el inicio de seisión de un docente
const loginDocente = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos
        const docenteBDD = await Docente.findOne({ email }).select('-lastLogin -resetToken -resetTokenExpire -__v -updatedAt -createdAt');

        // Validar si el usuario existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Credenciales Incorrectas' });
        }

        // Si el usuario está bloqueado y ya pasó el tiempo, desbloquear
        if (docenteBDD.lockUntil && docenteBDD.lockUntil < new Date()) {
            docenteBDD.loginAttempts = 0;
            docenteBDD.lockUntil = null;
            await docenteBDD.save();
        }

        // Validar la contraseña
        const verifyPassword = await docenteBDD.matchPassword(password);

        // Si la cuenta sigue bloqueada
        if (docenteBDD.lockUntil && docenteBDD.lockUntil > new Date()) {
            return reply.code(401).send({
                message: `El usuario está bloqueado. Intente nuevamente en ${moment(docenteBDD.lockUntil).tz("America/Guayaquil").format("HH:mm:ss")}`
            });
        }

        // Si la contraseña es incorrecta
        if (!verifyPassword) {
            docenteBDD.loginAttempts += 1;

            // Si llegó al límite, bloquear
            if (docenteBDD.loginAttempts >= 5) {
                docenteBDD.lockUntil = moment().add(30, 'minutes').toDate();
            }

            await docenteBDD.save();
            return reply.code(400).send({ message: 'Credenciales Incorrectas' });
        }

        // Si la contraseña es correcta
        if (verifyPassword && docenteBDD.status) {
            await docenteBDD.resetLoginAttempts();
            await docenteBDD.updateLastLogin();

            const lastLoginLocal = docenteBDD.lastLogin
                ? moment.utc(docenteBDD.lastLogin).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
                : null;

            const tokenJWT = generateToken(docenteBDD._id, docenteBDD.rol, req.server);

            return reply.status(200).send({
                tokenJWT,
                lastLoginLocal
            });
        } else {
            return reply.code(400).send({ message: 'La cuenta está deshabilitada' });
        }


    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

// Método para registrar un nuevo docente
const registerDocente = async (req, reply) => {
    try {

        const adminLogged = req.adminBDD;

        const { cedula, name, lastName, email, phone, career, otherFaculty } = req.body;

        // Verificar si la cédula ya está registrada
        const existingDocente = await Docente.findOne({ cedula });
        if (existingDocente) {
            return reply.code(400).send({ message: 'La cédula ya está registrada' });
        }

        // Validar si la cédula es ecuatoriana
        const isEcuadorianDNI = await Docente.verifyEcuadorianDNI(cedula);
        if (!isEcuadorianDNI) {
            return reply.code(400).send({ message: 'La cédula no es ecuatoriana' });
        }

        // Verificar si el correo ya está registrado
        const existingEmail = await Docente.findOne({ email });
        if (existingEmail) {
            return reply.code(400).send({ message: 'El correo ya está registrado' });
        }
        // Verificar si el teléfono ya está registrado
        const existingPhone = await Docente.findOne({ phone });
        if (existingPhone) {
            return reply.code(400).send({ message: 'El teléfono ya está registrado' });
        }

        // Crear contraseña aleatoria
        const password = Math.random().toString(36).substring(2);

        // Crear el nuevo docente
        const newDocente = new Docente({
            cedula,
            name,
            lastName,
            email,
            phone,
            career,
            otherFaculty,
            createFor: adminLogged._id,
            enableFor: adminLogged._id
        });

        // Encriptar la contraseña
        newDocente.password = await newDocente.encryptPassword("Esfot@" + password + "-1990");

        // Enviar correo de bienvenida
        await sendMailNewUser(email, password, name, lastName);

        // Guardar el nuevo docente en la base de datos
        await newDocente.save();

        return reply.code(201).send({ message: "Docente registrado con éxito" });

    } catch (error) {
        console.error("Error al registrar docente:", error);

        // Manejar error de clave duplicada en MongoDB
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return reply.code(400).send({ message: `El ${field} ya está registrado` });
        }

        return reply.code(500).send({ message: "Error al registrar docente" });
    }
};

const updateDocente = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        // Validar el ID si es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'ID inválido' });
        };

        // Buscar el docente en la base de datos
        const docenteBDD = await Docente.findById(id).select('cedula name lastName email phone career otherFaculty updatedDate updateFor');

        // Validar si el docente existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Docente no encontrado' });
        };

        // Validar si la cédula ya está registrada
        if (docenteBDD.cedula !== req.body.cedula) {
            const existingCedula = await Docente.findOne({ cedula: req.body.cedula });
            if (existingCedula) {
                return reply.code(400).send({ message: 'La cédula ya está registrada' });
            }
        };

        // Validar si el correo ya está registrado
        if (docenteBDD.email !== req.body.email) {
            const existingEmail = await Docente.findOne({ email: req.body.email });
            if (existingEmail) {
                return reply.code(400).send({ message: 'El correo ya está registrado' });
            }
        };

        // Validar si el teléfono ya está registrado
        if (docenteBDD.phone !== req.body.phone) {
            const existingPhone = await Docente.findOne({ phone: req.body.phone });
            if (existingPhone) {
                return reply.code(400).send({ message: 'El teléfono ya está registrado' });
            }
        };

        // Si no se está modificando la carrera, no validar "otherFaculty"
        if (req.body.career && req.body.career === 'No pertenece a ninguna carrera dentro de la facultad' && !req.body.otherFaculty) {
            return reply.code(400).send({ message: 'El campo "otra facultad" es obligatorio cuando la carrera es "No pertenece a ninguna carrera dentro de la facultad"' });
        }

        // Si se está modificando la carrera y no es "No pertenece a ninguna carrera dentro de la facultad", limpiar "otherFaculty"
        if (req.body.career && req.body.career !== 'No pertenece a ninguna carrera dentro de la facultad') {
            docenteBDD.otherFaculty = null;
        }

        // Actualizar los datos del docente
        docenteBDD.cedula = req.body.cedula || docenteBDD?.cedula;
        docenteBDD.name = req.body.name || docenteBDD?.name;
        docenteBDD.lastName = req.body.lastName || docenteBDD?.lastName;
        docenteBDD.email = req.body.email || docenteBDD?.email;
        docenteBDD.phone = req.body.phone || docenteBDD?.phone;
        docenteBDD.career = req.body.career || docenteBDD?.career;
        docenteBDD.otherFaculty = req.body.otherFaculty || docenteBDD?.otherFaculty;
        docenteBDD.updateFor = adminLogged._id;
        docenteBDD.updatedDate = Date.now();

        // Enviar correo de actualización
        await sendMailUpdateUser(docenteBDD.email, docenteBDD.name, docenteBDD.lastName);
        // Guardar los cambios en la base de datos
        await docenteBDD.save();
        return reply.code(200).send({ message: 'Docente actualizado con éxito' });
        
    } catch (error) {
        console.error("Error al actualizar docente:", error);
        return reply.code(500).send({ message: 'Error al actualizar docente' });
    }
};

export { loginDocente, registerDocente, updateDocente };