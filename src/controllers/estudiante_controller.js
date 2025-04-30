import Estudiante from "../models/Estudiante.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendMailNewUser, sendMailRecoverPassword, sendMailNewPassword, sendMailUpdateUser, sendMailEnableUser, sendMailDisableUser } from "../config/nodemailer.js";

//Método para iniciar sesión
const loginEstudiante = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Buscarel usuario en labase de datos
        const estudianteBDD = await Estudiante.findOne({ email });

        // Validar si el usuario existe
        if (!estudianteBDD) {
            return reply.status(404).json({ message: "Credenciales Incorrectas" });
        }

        // Si el usuario esta bloqueado y ya paso el tiempo de bloqueo
        if (estudianteBDD.lockUntil && estudianteBDD.lockUntil > Date.now()) {
            estudianteBDD.loginAttempts = 0;
            estudianteBDD.lockUntil = null;
            await estudianteBDD.save();
        }

        // Validar la contraseña
        const verifyPassword = await estudianteBDD.matchPassword(password);

        // Si la cuenta sigue bloqueada
        if (estudianteBDD.lockUntil && estudianteBDD.lockUntil > Date.now()) {
            return reply.code(401).send({
                message: `El usuario está bloqueado. Intente nuevamente en ${moment(adminBDD.lockUntil).tz("America/Guayaquil").format("HH:mm:ss")}`
            });
        }

        // Si la contraseña es incorrecta
        if (!verifyPassword) {
            // Incrementar el número de intentos de inicio de sesión
            estudianteBDD.loginAttempts += 1;

            // Si se alcanzó el número máximo de intentos, bloquear la cuenta
            if (estudianteBDD.loginAttempts >= 5) {
                estudianteBDD.lockUntil = moment().add(30, "minutes").toDate(); // Bloquear por 30 minutos
            }

            await estudianteBDD.save();
            return reply.status(401).json({ message: "Credenciales Incorrectas" });
        }

        // Si la contraseña es correcta, reiniciar los intentos de inicio de sesión
        if (verifyPassword && estudianteBDD.status) {
            await estudianteBDD.resetLoginAttempts();
            await estudianteBDD.updateLastLogin();

            const lastLoginLocal = estudianteBDD.lastLogin
                ? moment(estudianteBDD.lastLogin).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
                : null;

            const tokenJWT = generateToken(estudianteBDD._id, estudianteBDD.rol, req.server);

            return reply.status(200).send({
                tokenJWT,
                lastLoginLocal
            });
        } else {
            return reply.status(401).json({ message: "La cuenta está deshabilitada" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

// Método para registrar un nuevo estudiante
const registerEstudiante = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.status(401).send({ message: "No tienes permisos para realizar esta acción" });
        }

        const { cedula, name, lastName, email, phone, career, lastPeriod } = req.body;

        // Verificar si la cédula ya esta registrada
        const existingCedula = await Estudiante.findOne({ cedula });
        if (existingCedula) {
            return reply.status(400).send({ message: "La cédula ya está registrada" });
        }

        // Validar si la cédula es ecuatoriana
        const isValidCedula = await Estudiante.isCedulaEcuadoriana(cedula);
        if (!isValidCedula) {
            return reply.status(400).send({ message: "La cédula no es válida" });
        }

        // Verificar si el email ya está registrado
        const existingEmail = await Estudiante.findOne({ email });
        if (existingEmail) {
            return reply.status(400).send({ message: "El email ya está registrado" });
        }

        // Verificar si el teléfono ya está registrado
        const existingPhone = await Estudiante.findOne({ phone });
        if (existingPhone) {
            return reply.status(400).send({ message: "El teléfono ya está registrado" });
        }

        // Crear contraseña aleatoria
        const password = Math.random().toString(36).slice(2);

        // Crear nuevo estudiante
        const newEstudiante = new Estudiante({
            cedula,
            name,
            lastName,
            email,
            phone,
            career,
            lastPeriod,
            createFor: adminLogged._id,
            enableFor: adminLogged._id
        });

        // Encriptar la contraseña
        newEstudiante.password = await newEstudiante.encryptPassword("Esfot@" + password + "-1990");

        // Guardar el nuevo estudiante en la base de datos
        await newEstudiante.save();

        // Enviar correo al nuevo estudiante
        await sendMailNewUser(email, password, name, lastName);
        return reply.code(201).send({ message: "Estudiante registrado con éxito" });

    } catch (error) {
        console.error("Error al registrar estudiante:", error);
        return reply.code(500).send({ message: "Error al registrar estudiante" });

    }
};

// Método para actualizar un estudiante
const updateEstudiante = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }

        const estudianteBDD = await Admin.findById(id).select('cedula name lastName email phone updatedDate updateFor');

        // Validar si el estudiante existe
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }

        // Validar si la cédula ya está registrada
        if (estudianteBDD.cedula != req.body.cedula) {
            const existingCedula = await Estudiante.findOne({ cedula: req.body.cedula });
            if (existingCedula) {
                return reply.code(400).send({ message: "La cédula ya está registrada" });
            }
        }

        // Validar si el correo electrónico ya está registrado
        if (estudianteBDD.email != req.body.email) {
            const existingEmail = await Estudiante.findOne({ email: req.body.email });
            if (existingEmail) {
                return reply.code(400).send({ message: "El correo electrónico ya está registrado" });
            }
        }

        // Validar si el teléfono ya está registrado
        if (estudianteBDD.phone != req.body.phone) {
            const existingPhone = await Estudiante.findOne({ phone: req.body.phone });
            if (existingPhone) {
                return reply.code(400).send({ message: "El teléfono ya está registrado" });
            }
        }

        // Validar body vacio dado a que el schema detecto campos no válidos
        if (Object.keys(req.body).length === 0) {
            return reply.code(400).send({ message: "No se han proporcionado los campos válidos para actualizar" });
        }

        // Actualizar los campos del estudiante
        estudianteBDD.cedula = req.body.cedula || estudianteBDD.cedula;
        estudianteBDD.name = req.body.name || estudianteBDD.name;
        estudianteBDD.lastName = req.body.lastName || estudianteBDD.lastName;
        estudianteBDD.email = req.body.email || estudianteBDD.email;
        estudianteBDD.phone = req.body.phone || estudianteBDD.phone;
        estudianteBDD.career = req.body.career || estudianteBDD.career;
        estudianteBDD.lastPeriod = req.body.lastPeriod || estudianteBDD.lastPeriod;
        estudianteBDD.updateFor = adminLogged._id;
        estudianteBDD.updateDate = Date.now();
        await estudianteBDD.save();

        // Enviar correo al estudiante
        sendMailUpdateUser(estudianteBDD.email, estudianteBDD.name, estudianteBDD.lastName);
        return reply.code(200).send({ message: "Estudiante actualizado con éxito" });

    } catch (error) {
        console.error("Error al actualizar estudiante:", error);
        return reply.code(500).send({ message: "Error al actualizar estudiante" });
    }
};

// Método para habilitar un estudiante
const enableEstudiante = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }

        const estudianteBDD = await Estudiante.findById(id).select('status enableFor enableDate');

        // Validar si el estudiante existe
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }

        // Verificar si el estudiante ya está habilitado
        if (estudianteBDD.status) {
            return reply.code(400).send({ message: "El estudiante ya está habilitado" });
        }

        // Habilitar al estudiante
        estudianteBDD.status = true;
        estudianteBDD.enableFor = adminLogged._id;
        estudianteBDD.enableDate = Date.now();
        await estudianteBDD.save();

        // Enviar correo al estudiante
        sendMailEnableUser(estudianteBDD.email, estudianteBDD.name, estudianteBDD.lastName);
        return reply.code(200).send({ message: "Estudiante habilitado con éxito" });

    } catch (error) {
        console.error("Error al habilitar estudiante:", error);
        return reply.code(500).send({ message: "Error al habilitar estudiante" });
    }
};

// Método para deshabilitar un estudiante
const disableEstudiante = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }

        const estudianteBDD = await Estudiante.findById(id).select('status disableFor disableDate');

        // Validar si el estudiante existe
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }

        // Verificar si el estudiante ya está deshabilitado
        if (!estudianteBDD.status) {
            return reply.code(400).send({ message: "El estudiante ya está deshabilitado" });
        }

        // Deshabilitar al estudiante
        estudianteBDD.status = false;
        estudianteBDD.disableFor = adminLogged._id;
        estudianteBDD.disableDate = Date.now();
        await estudianteBDD.save();

        // Enviar correo al estudiante
        sendMailDisableUser(estudianteBDD.email, estudianteBDD.name, estudianteBDD.lastName);
        return reply.code(200).send({ message: "Estudiante deshabilitado con éxito" });

    } catch (error) {
        console.error("Error al deshabilitar estudiante:", error);
        return reply.code(500).send({ message: "Error al deshabilitar estudiante" });
    }
};

// Método para recuperar la contraseña de un estudiante
const recoverPassword = async (req, reply) => {
    try {
        const { email } = req.body;

        // Buscar el estudiante en la base de datos
        const estudianteBDD = await Estudiante.findOne({ email });

        // Validar si el estudiante existe
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }

        // Validar si el estudiante está habilitado
        if (!estudianteBDD.status) {
            return reply.code(400).send({ message: "El estudiante está deshabilitado" });
        }

        // Validar si el estudiante tiene un token de restablecimiento
        if (estudianteBDD.resetToken && estudianteBDD.resetTokenExpire > Date.now()) {
            return reply.code(400).send({ message: "Ya se ha enviado un correo de recuperación" });
        }

        // Verificar si el administrador tiene un token de restablecimiento expirado
        if (estudianteBDD.resetTokenExpire && estudianteBDD.resetTokenExpire < new Date()) {
            const token = await estudianteBDD.createResetToken();
            // Enviar correo de recuperación
            sendMailRecoverPassword(email, token, estudianteBDD.name, estudianteBDD.lastName);
            return reply.code(200).send({ message: "Correo de recuperación enviado" });
        }

        // Crear un nuevo token de recuperación
        const token = await estudianteBDD.createResetToken();

        // Enviar correo de recuperación
        sendMailRecoverPassword(email, token, estudianteBDD.name, estudianteBDD.lastName);
        return reply.code(200).send({ message: "Correo de recuperación enviado" });

    } catch (error) {
        console.error("Error al recuperar contraseña:", error);
        return reply.code(500).send({ message: "Error al recuperar contraseña" });
    }
};

// Método para verificar el token de recuperación
const verifyToken = async (req, reply) => {
    try {
        const { token } = req.params;
        if (!token) {
            return reply.code(400).send({ message: "El token es obligatorio" });
        }
        const estudianteBDD = await Estudiante.findOne({ resetToken: token });
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El token no es válido" });
        }
        // Verificar si el token ha expirado
        if (estudianteBDD.resetTokenExpire < new Date()) {
            return reply.code(400).send({ message: "El token ha expirado" });
        }
        return reply.code(200).send({ message: "Token válido" });

    } catch (error) {
        console.error("Error al verificar token:", error);
        return reply.code(500).send({ message: "Error al verificar token" });
    }
};

// Método para enviar la contraseña de recuperación
const sendRecoverPassword = async (req, reply) => {
    try {
        const { token } = req.params;

        const estudianteBDD = await Estudiante.findOne({ resetToken: token });
        if (!estudianteBDD) {
            return reply.code(400).send({ message: "El token no es válido" });
        }
        // Verificar si el token ha expirado
        if (estudianteBDD.resetTokenExpire < new Date()) {
            return reply.code(400).send({ message: "El token ha expirado" });
        }
        // Generar nueva contraseña
        const newPassword = Math.random().toString(36).substring(2);
        // Encriptar la nueva contraseña
        estudianteBDD.password = await estudianteBDD.encryptPassword("Esfot" + "@" + newPassword + "-" + "1990");
        // Limpiar el token y la fecha de expiración
        estudianteBDD.resetToken = null;
        estudianteBDD.resetTokenExpire = null;

        // Limpiar los intentos de inicio de sesión
        estudianteBDD.loginAttempts = 0;
        estudianteBDD.lockUntil = null;

        // Guardar en la base de datos
        await estudianteBDD.save();
        // Enviar correo con la nueva contraseña
        sendMailNewPassword(estudianteBDD.email, newPassword, estudianteBDD.name, estudianteBDD.lastName, estudianteBDD.rol);
        return reply.code(200).send({ message: "Contraseña de recuperación enviada" });

    } catch (error) {
        console.error("Error al enviar la contraseña de recuperación:", error);
        return reply.code(500).send({ message: "Error al enviar la contraseña de recuperación" });
    }
};

// Métodoo par actualizar la contraseña
const updatePassword = async (req, reply) => {
    try {

        const { id } = req.estudianteBDD
        const { password, confirmPassword } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const estudianteBDD = await Estudiante.findById(id);
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }
        // Comprobar si los campos están vacíos o contienen solo espacios
        if (!password?.trim() || !confirmPassword?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }
        // Validar si la contraseña y la confirmación son iguales
        if (password !== confirmPassword) {
            return reply.code(400).send({ message: "Las contraseñas no coinciden" });
        }
        // Encriptar la nueva contraseña
        estudianteBDD.password = await estudianteBDD.encryptPassword(password);
        // Guardar en la base de datos
        await estudianteBDD.save();
        return reply.code(200).send({ message: "Contraseña actualizada con éxito" });

    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        return reply.code(500).send({ message: "Error al actualizar contraseña" });
    }
};

// Método para obtener todos los estudiantes
const getAllEstudiantes = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const estudiantes = await Estudiante.find().select('-__v -password');
        return reply.code(200).send(estudiantes);

    } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        return reply.code(500).send({ message: "Error al obtener estudiantes" });
    }
};

// Método para obtener un estudiante por ID
const getEstudianteById = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const estudianteBDD = await Estudiante.findById(id).select('-__v -password');
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }
        return reply.code(200).send(estudianteBDD);

    } catch (error) {
        console.error("Error al obtener estudiante:", error);
        return reply.code(500).send({ message: "Error al obtener estudiante" });
    }
};

// Método para obtener el perfil del estudiante
const getEstudianteProfile = async (req, reply) => {
    try {
        const estudianteBDD = req.estudianteBDD;

        // Verificar si el administrador existe
        if (!estudianteBDD) {
            return reply.code(404).send({ message: "El estudiante no existe" });
        }

        return reply.code(200).send({
            id: estudianteBDD._id,
            name: estudianteBDD.name,
            lastName: estudianteBDD.lastName,
            email: estudianteBDD.email,
            phone: estudianteBDD.phone,
            rol: estudianteBDD.rol,
            status: estudianteBDD.status,
            lastLoginLocal: moment(estudianteBDD.lastLogin).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
        });
    } catch (error) {
        console.error("Error al obtener perfil de estudiante:", error);
        return reply.code(500).send({ message: "Error al obtener perfil de estudiante" });
    }
};

// Exportar los métodos
export {
    loginEstudiante,
    registerEstudiante,
    updateEstudiante,
    enableEstudiante,
    disableEstudiante,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllEstudiantes,
    getEstudianteById,
    getEstudianteProfile
};