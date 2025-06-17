import { createReserva, generateReserva, approveReserva, rejectReserva, cancelReserva, getAllReservas, getReservaById } from '../controllers/reserva_controller.js';
import { createReservaSchema, rejectReasonSchema } from '../schema/reserva_schema.js';
import verifyAuth from '../middlewares/authentication.js';

export default async function reservaRoutes(fastify) {
    fastify.post('/create', { preHandler: verifyAuth, schema: createReservaSchema }, createReserva);
    fastify.post('/generate', { preHandler: verifyAuth, schema: createReservaSchema }, generateReserva);
    fastify.post('/approve/:id', { preHandler: verifyAuth }, approveReserva);
    fastify.post('/reject/:id', { preHandler: verifyAuth, schema: rejectReasonSchema }, rejectReserva);
    fastify.post('/cancel/:id', { preHandler: verifyAuth }, cancelReserva);
    fastify.get('/reservas', { preHandler: verifyAuth }, getAllReservas);
    fastify.get('/reservas/:id', { preHandler: verifyAuth }, getReservaById);
}