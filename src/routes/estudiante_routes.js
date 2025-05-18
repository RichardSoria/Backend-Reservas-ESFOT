import { loginEstudiante, registerEstudiante, updateEstudiante, enableEstudiante, disableEstudiante, recoverPassword, verifyToken, sendRecoverPassword, updatePassword, getAllEstudiantes, getEstudianteById, getEstudianteProfile } from '../controllers/estudiante_controller.js';
import { loginEstudianteSchema, registerEstudianteSchema, updateEstudianteSchema, recoverPasswordSchema, updatePasswordSchema } from '../schema/estudiante_schema.js';
import verifyAuth from "../middlewares/authentication.js";


export default async function estudianteRoutes(fastify) {
    fastify.post('/login', { schema: loginEstudianteSchema }, loginEstudiante);
    fastify.post('/register', { preHandler: verifyAuth, schema: registerEstudianteSchema }, registerEstudiante);
    fastify.put('/update/:id', { preHandler: verifyAuth, schema: updateEstudianteSchema }, updateEstudiante);
    fastify.put('/enable/:id', { preHandler: verifyAuth }, enableEstudiante);
    fastify.put('/disable/:id', { preHandler: verifyAuth }, disableEstudiante);
    fastify.post('/recover-password', { schema: recoverPasswordSchema }, recoverPassword);
    fastify.get('/verify-token/:token', verifyToken);
    fastify.post('/send-recover-password/:token', sendRecoverPassword);
    fastify.put('/update-password', { preHandler: verifyAuth, schema: updatePasswordSchema }, updatePassword);
    fastify.get('/estudiantes', { preHandler: verifyAuth }, getAllEstudiantes);
    fastify.get('/estudiante/:id', { preHandler: verifyAuth }, getEstudianteById);
    fastify.get('/profile', { preHandler: verifyAuth }, getEstudianteProfile);
}