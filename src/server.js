import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import Ajv from 'ajv';
import addErrors from "ajv-errors";
import { envSchema } from './config/envSchema.js';
import adminRoutes from "./routes/admin_routes.js";
import docenteRoutes from "./routes/docente_routes.js";
import estudianteRoutes from "./routes/estudiante_routes.js";
import laboratorioRoutes from './routes/laboratorio_routes.js';
import aulaRoutes from './routes/aula_routes.js';
import reservaRoutes from './routes/reserva_routes.js';
import connectDB from './database.js';
import cloudinary from 'cloudinary';
import fastifyMultipart from 'fastify-multipart';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';


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

// Registrar el plugin Multipart con validación para imágenes
await fastify.register(fastifyMultipart, {
    addToBody: true, // Para agregar los archivos al body
    limits: {
        fileSize: 5 * 1024 * 1024 // Limitar tamaño de archivo a 5MB
    },
    onFile: (field, file) => {
        // Validar el tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Formatos permitidos
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, JPEG o PNG');
        }
    }
});

// Configurar Cloudinary
cloudinary.config({
    cloud_name: fastify.config.CLOUDINARY_CLOUD_NAME,
    api_key: fastify.config.CLOUDINARY_API_KEY,
    api_secret: fastify.config.CLOUDINARY_API_SECRET
});

// Mostrar variables de entorno
console.log(`Variables de entorno cargadas:`);
console.log(fastify.config);

// Conectar a la base de datos
await connectDB(fastify);

// Ruta principal
fastify.get('/', async (req, reply) => {
    return { message: 'Servidor en ejecución', port: fastify.config.PORT };
});

// Registrar el plugin de Swagger
await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'API RESTful Reservas-ESFOT',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });
  
  // Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: '/api/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
  

// Registrar rutas
await fastify.register(adminRoutes, { prefix: "/api/admin" });
await fastify.register(docenteRoutes, { prefix: "/api/docente" });
await fastify.register(estudianteRoutes, { prefix: "/api/estudiante" });
await fastify.register(aulaRoutes, { prefix: "/api/aula" });
await fastify.register(laboratorioRoutes, { prefix: "/api/laboratorio"})
await fastify.register(reservaRoutes, { prefix: "/api/reserva" });

// Exportar la instancia de Fastify
export default fastify;
