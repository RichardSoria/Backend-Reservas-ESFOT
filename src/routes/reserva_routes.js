import { createReserva, assignReserva, approveReserva, rejectReserva, cancelReserva, getAllReservas, getReservaById } from '../controllers/reserva_controller.js';
import { createReservaSchema, assignReservaSchema, reasonReservaSchema } from '../schema/reserva_schema.js';
import verifyAuth from '../middlewares/authentication.js';

export default async function reservaRoutes(fastify) {
    fastify.post('/create', { preHandler: verifyAuth, schema: createReservaSchema }, createReserva);
    fastify.post('/assign', { preHandler: verifyAuth, schema: assignReservaSchema }, assignReserva);
    fastify.patch('/approve/:id', { preHandler: verifyAuth, schema: reasonReservaSchema }, approveReserva);
    fastify.patch('/reject/:id', { preHandler: verifyAuth, schema: reasonReservaSchema }, rejectReserva);
    fastify.patch('/cancel/:id', { preHandler: verifyAuth, schema: reasonReservaSchema }, cancelReserva);
    fastify.get('/reservas', { preHandler: verifyAuth }, getAllReservas);
    fastify.get('/reservas/:id', { preHandler: verifyAuth }, getReservaById);
}