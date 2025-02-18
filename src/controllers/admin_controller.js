import Admin from "../models/Admin.js";
import generateToken from "../helpers/jwt.js";

// Método para el inicio de sesión
const login = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            return reply.code(400).send({ message: 'Todos los campos son obligatorios' });
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
        const tokenJWT = generateToken(adminBDD._id, "administrador");

        // Actualizar último inicio de sesión
        await adminBDD.updateLastLogin();

        // Extraer solo la información necesaria del usuario
        const { _id, name, lastName } = adminBDD;

        // Enviar respuesta
        return reply.status(200).send({
            tokenJWT,
            name,
            lastName,
            email: adminBDD.email,
            _id,
            rol: "administrador",
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

export { login };