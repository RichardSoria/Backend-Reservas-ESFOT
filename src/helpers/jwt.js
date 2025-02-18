import jwt from 'jsonwebtoken';
import { envSchema } from '../config/envSchema.js';

const generateToken = (id, rol) => {
    return jwt.sign({ id, rol }, envSchema.properties.JWT_SECRET.default, { expiresIn: '1d' });
}

export default generateToken;