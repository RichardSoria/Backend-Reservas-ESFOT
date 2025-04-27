import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Método para proteger rutas
const verifyAuth = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: 'Se debe proporcionar un token' });
    }

    // Desconstruir el token del header
    const { authorization } = req.headers;

    // Capturar errores
    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], req.server.config.JWT_SECRET);
        // Verificar el rol
        if (rol === 'administrador') {
            req.adminBDD = await Admin.findById(id).select('-password -__v');
            next();
        }
        else if (rol === 'docente') {
            req.profBDD = await Admin.findById(id).select('-password -__v');
            next();
        }
        else if (rol === 'estudiante') {
            req.estuBDD = await Admin.findById(id).select('-password -__v');
            next();
        }
        else {
            return res.status(401).send({ message: 'No tienes permisos para acceder a esta ruta' });
        }

    } catch (error) {
        return res.status(401).send({ message: 'Token inválido' });
    }
};

// Exportar el middleware
export default verifyAuth;