import Admin from "../models/Admin.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendMailNewAdmin } from "../config/nodemailer.js";


// Método para el inicio de sesión
const loginAdmin = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Validar si los campos existen y no están vacíos
        if (!email?.trim() || !password?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si el usuario es el SuperAdmin
        if (email === req.server.config.SUPER_ADMIN) {
            if (password !== req.server.config.SUPER_ADMIN_PASSWORD) {
                return reply.code(400).send({ message: "La contraseña es incorrecta" });
            }

            // Generar token para el SuperAdmin
            const tokenJWT = generateToken("superadmin", "superadmin", req.server);

            // Enviar respuesta del SuperAdmin
            return reply.status(200).send({
                tokenJWT,
                name: "Super",
                lastName: "Admin",
                email,
                rol: "superadmin",
                lastLoginLocal: moment().tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
            });
        }

        // Buscar el usuario en la base de datos
        const adminBDD = await Admin.findOne({ email }).select('-lastLogin -resetToken -resetTokenExpire -__v -updatedAt -createdAt');

        // Validar si el usuario existe
        if (!adminBDD) {
            return reply.code(404).send({ message: 'Credenciales Incorrectas' });
        }

        // Si el usuario está bloqueado y ya pasó el tiempo, desbloquear
        if (adminBDD.lockUntil && adminBDD.lockUntil < new Date()) {
            adminBDD.loginAttempts = 0;
            adminBDD.lockUntil = null;
            await adminBDD.save();
        }

        // Validar la contraseña
        const verifyPassword = await adminBDD.matchPassword(password);

        // Si la cuenta sigue bloqueada
        if (adminBDD.lockUntil && adminBDD.lockUntil > new Date()) {
            return reply.code(401).send({
                message: `El usuario está bloqueado. Intente nuevamente en ${moment(adminBDD.lockUntil).tz("America/Guayaquil").format("HH:mm:ss")}`
            });
        }

        // Si la contraseña es incorrecta
        if (!verifyPassword) {
            adminBDD.loginAttempts += 1;

            // Si llegó al límite, bloquear
            if (adminBDD.loginAttempts >= 5) {
                adminBDD.lockUntil = moment().add(30, 'minutes').toDate();
            }

            await adminBDD.save();
            return reply.code(400).send({ message: 'Credenciales Incorrectas' });
        }

        // Si la contraseña es correcta
        if (verifyPassword) {
            await adminBDD.resetLoginAttempts();
            await adminBDD.updateLastLogin();

            const lastLoginLocal = adminBDD.lastLogin
                ? moment.utc(adminBDD.lastLogin).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
                : null;

            const tokenJWT = generateToken(adminBDD._id, adminBDD.rol, req.server);

            return reply.status(200).send({
                tokenJWT,
                lastLoginLocal
            });
        }


    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

const registerAdmin = async (req, reply) => {
    try {
        const { cedula, name, lastName, email, phone } = req.body;

        // Verificar si los campos están vacíos o contienen solo espacios
        if (!cedula?.trim() || !name?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }

        // Verificar si la cédula ya está registrada
        const existingCedula = await Admin.findOne({ cedula });
        if (existingCedula) {
            return reply.code(400).send({ message: "La cédula ya está registrada" });
        }

        // Verificar si el correo ya está registrado
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return reply.code(400).send({ message: "El correo ya está registrado" });
        }

        // Verificar si el teléfono ya está registrado
        const existingPhone = await Admin.findOne({ phone });
        if (existingPhone) {
            return reply.code(400).send({ message: "El teléfono ya está registrado" });
        }

        // Crear contraseña aleatoria
        const password = Math.random().toString(36).substring(2);

        // Crear un nuevo administrador
        const newAdmin = new Admin({ cedula, name, lastName, email, phone });

        // Encriptar la contraseña
        newAdmin.password = await newAdmin.encryptPassword("Admin@" + password + "-1990");

        // Enviar correo al nuevo administrador
        sendMailNewAdmin(email, password, name, lastName);

        // Guardar en la base de datos
        await newAdmin.save();

        return reply.code(201).send({ message: "Administrador registrado con éxito" });

    } catch (error) {
        console.error("Error al registrar administrador:", error);

        // Manejar error de clave duplicada en MongoDB
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return reply.code(400).send({ message: `El ${field} ya está registrado` });
        }

        return reply.code(500).send({ message: "Error al registrar administrador" });
    }
};

// Método para actualizar administrador
const updateAdmin = async (req, reply) => {
    const { id } = req.params;

    // Validar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "El ID no es válido" });
    }

    const adminBDD = await Admin.findById(id);

    // Validar si el administrador existe
    if (!adminBDD) {
        return reply.code(404).send({ message: "El administrador no existe" });
    }

    // Validar si el correo, teléfono o cédula ya están registrados
    if (adminBDD.email != req.body.email) {
        const existingEmail = await Admin.findOne({ email: req.body.email });
        if (existingEmail) {
            return reply.code(400).send({ message: "El correo ya está registrado" });
        }
    }

    // Validar si el teléfono ya está registrado
    if (adminBDD.phone != req.body.phone) {
        const existingPhone = await Admin.findOne({ phone: req.body.phone });
        if (existingPhone) {
            return reply.code(400).send({ message: "El teléfono ya está registrado" });
        }
    }

    // Validar si la cédula ya está registrada
    if (adminBDD.cedula != req.body.cedula) {
        const existingCedula = await Admin.findOne({ cedula: req.body.cedula });
        if (existingCedula) {
            return reply.code(400).send({ message: "La cédula ya está registrada" });
        }
    }

    // Crear contraseña aleatoria
    const password = Math.random().toString(36).substring(2);


    // Actualizar los campos del administrador
    adminBDD.name = req.body.name || adminBDD?.name;
    adminBDD.lastName = req.body.lastName || adminBDD?.lastName;
    adminBDD.email = req.body.email || adminBDD?.email;
    adminBDD.phone = req.body.phone || adminBDD?.phone;
    adminBDD.password = await adminBDD.encryptPassword("Admin" + "@" + password + "-" + "1990") || adminBDD?.password;
    adminBDD.updatedDate = new Date();
    await adminBDD.save();
    return reply.code(200).send({ message: "Administrador actualizado con éxito" });
};

// Método para habilitar administrador
const enableAdmin = async (req, reply) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "El ID no es válido" });
    }
    const adminBDD = await Admin.findById(id);
    if (!adminBDD) {
        return reply.code(404).send({ message: "El administrador no existe" });
    }
    if (adminBDD.status) {
        return reply.code(400).send({ message: "El administrador ya está habilitado" });
    }
    adminBDD.status = true;
    await adminBDD.save();
    return reply.code(200).send({ message: "Administrador habilitado con éxito" });
};

// Método para deshabilitar administrador
const disableAdmin = async (req, reply) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return reply.code(400).send({ message: "El ID no es válido" });
    }
    const adminBDD = await Admin.findById(id);
    if (!adminBDD) {
        return reply.code(404).send({ message: "El administrador no existe" });
    }
    if (!adminBDD.status) {
        return reply.code(400).send({ message: "El administrador ya está deshabilitado" });
    }
    adminBDD.status = false;
    adminBDD.disableDate = new Date();
    await adminBDD.save();
    return reply.code(200).send({ message: "Administrador deshabilitado con éxito" });
};

export { loginAdmin, registerAdmin, updateAdmin, enableAdmin, disableAdmin };