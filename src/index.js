import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import connectDB from './database.js';
import { envSchema } from './config/envSchema.js';

// Crea una instancia de Fastify
const fastify = Fastify(/*{ logger: true }*/);

// Opciones para cargar las variables de entorno
const options = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true
};

// Registra el plugin @fastify/env
await fastify.register(fastifyEnv, options);

console.log('Variables de entorno cargadas:', fastify.config);

// Conecta a la base de datos
connectDB(fastify);

// Ruta principal
fastify.get('/', (req, reply) => {
    reply.send({ message: 'Servidor en ejecución', port: fastify.config.PORT });
});

// Inicia el servidor
fastify.listen({ port: fastify.config.PORT }, () => {
    console.log(`Servidor corriendo en http://localhost:${fastify.config.PORT}`);
});
