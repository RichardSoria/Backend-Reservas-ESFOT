import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Docente from '../models/Docente.js';
import Estudiante from '../models/Estudiante.js';

const verifyAuth = async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return reply.code(401).send({ message: 'Se debe proporcionar un token' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const { id, rol } = jwt.verify(token, req.server.config.JWT_SECRET);

        if (rol === 'administrador') {
            req.adminBDD = await Admin.findById(id).select('-password -__v');
        } else if (rol === 'docente') {
            req.docenteBDD = await Docente.findById(id).select('-password -__v');
        } else if (rol === 'estudiante') {
            req.estudianteBDD = await Estudiante.findById(id).select('-password -__v');
        } else {
            return reply.code(401).send({ message: 'No tienes permisos para acceder a esta ruta' });
        }
    } catch (error) {
        return reply.code(401).send({ message: 'Token inválido' });
    }
};

export default verifyAuth;
