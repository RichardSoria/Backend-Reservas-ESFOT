import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import Ajv from 'ajv';
import addErrors from "ajv-errors";
import { envSchema } from './config/envSchema.js';
import adminRoutes from "./routes/admin_routes.js";
import connectDB from './database.js';

// Configurar AJV con `errorMessage`
const ajv = new Ajv({ allErrors: true, strict: false });
addErrors(ajv);

// Crear la instancia de Fastify
const fastify = Fastify({
    logger: true,
    ajv: {
        customOptions: { allErrors: true },
        plugins: [addErrors]
    }
});

// Opciones para cargar variables de entorno
const options = {
    confKey: 'config',
    schema: envSchema,
    dotenv: true
};

// Registra el plugin @fastify/env
await fastify.register(fastifyEnv, options);

// Mostrar variables de entorno
console.log(`✅ Variables de entorno cargadas:`);
console.log(fastify.config);

// Conectar a la base de datos
await connectDB(fastify);

// Ruta principal
fastify.get('/', async (req, reply) => {
    return { message: 'Servidor en ejecución', port: fastify.config.PORT };
});

// Registrar rutas
await fastify.register(adminRoutes, { prefix: "/api" });

// Exportar la instancia de Fastify
export default fastify;
