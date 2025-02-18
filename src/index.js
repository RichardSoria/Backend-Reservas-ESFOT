import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import Ajv from 'ajv';
import addErrors from "ajv-errors"; // Para habilitar `errorMessage`
import connectDB from './database.js';
import { envSchema } from './config/envSchema.js';
import adminRoutes from "./routes/admin_routes.js";

// Configurar AJV con `errorMessage`
const ajv = new Ajv({ allErrors: true, strict: false });
addErrors(ajv);

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

// Conecta a la base de datos
await connectDB(fastify);

// Ruta principal
fastify.get('/', async (req, reply) => {
    return { message: '🚀 Servidor en ejecución', port: fastify.config.PORT };
});

// Registrar rutas
await fastify.register(adminRoutes, { prefix: "/api" });

// Verificar rutas antes de iniciar
fastify.ready(err => {
    if (err) console.error("❌ Error en Fastify:", err);
    console.log("📌 Rutas activas:");
    fastify.printRoutes();
});

// Iniciar el servidor
const start = async () => {
    try {
        await fastify.listen({ port: fastify.config.PORT, host: "0.0.0.0" });
        console.log(`🚀 Servidor corriendo en http://localhost:${fastify.config.PORT}`);
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

start();
