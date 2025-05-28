import jwt from 'jsonwebtoken';


const generateToken = (id, rol, name, lastName, fastify) => {
    return jwt.sign({ id, rol, name, lastName }, fastify.config.JWT_SECRET, { expiresIn: '1d' });
}

export default generateToken;