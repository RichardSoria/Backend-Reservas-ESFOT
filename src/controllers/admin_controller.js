import Admin from "../models/Admin.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";


// Método para el inicio de sesión
const login = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Validar si los campos existen y no están vacíos
        if (!email?.trim() || !password?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }

        // 📌 Verificar si el usuario es el SuperAdmin
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
            return reply.code(404).send({ message: 'El usuario no existe' });
        }

        // Validar la contraseña
        const verifyPassword = await adminBDD.matchPassword(password);

        // Validar si la contraseña es correcta
        if (!verifyPassword) {
            return reply.code(400).send({ message: 'La contraseña es incorrecta' });
        }

        // Generar token JWT
        const tokenJWT = generateToken(adminBDD._id, "administrador", reply.server);

        // Actualizar último inicio de sesión
        await adminBDD.updateLastLogin();

        // Extraer solo la información necesaria del usuario
        const { _id, name, lastName } = adminBDD;

        // Convertir `lastLogin` a hora local (Ecuador UTC-5) antes de enviarlo
        const lastLoginLocal = adminBDD.lastLogin
            ? moment.utc(adminBDD.lastLogin).tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
            : null;

        // Enviar respuesta
        return reply.status(200).send({
            tokenJWT,
            name,
            lastName,
            email: adminBDD.email,
            _id,
            rol: "administrador",
            lastLoginLocal
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

const register = async (req, reply) => {
    try {
        const { cedula, name, lastName, email, password, phone } = req.body;

        // Verificar si los campos están vacíos o contienen solo espacios
        if (!cedula?.trim() || !name?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim() || !phone?.trim()) {
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

        // Crear un nuevo administrador
        const newAdmin = new Admin({ cedula, name, lastName, email, password, phone });

        // Encriptar la contraseña
        newAdmin.password = await newAdmin.encryptPassword(password);

        // Guardar en la base de datos
        await newAdmin.save();

        // Enviar respuesta exitosa
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
export { login, register };