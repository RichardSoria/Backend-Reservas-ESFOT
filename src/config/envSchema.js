// Variables de entorno cargadas
export const envSchema = {
    type: 'object',
    required: ['PORT', 'MONGODB_URI', 'SUPER_ADMIN', 'SUPER_ADMIN_PASSWORD', 'HOST_MAILTRAP', 'PORT_MAILTRAP', 'USER_MAILTRAP', 'PASS_MAILTRAP', 'JWT_SECRET', 'COOKIE_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET','URL_FRONTEND'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        MONGODB_URI: { type: 'string' },
        SUPER_ADMIN: { type: 'string' },
        SUPER_ADMIN_PASSWORD: { type: 'string' },
        HOST_MAILTRAP: { type: 'string' },
        PORT_MAILTRAP: { type: 'number' },
        USER_MAILTRAP: { type: 'string' },
        PASS_MAILTRAP: { type: 'string' },
        JWT_SECRET: { type: 'string' },
        COOKIE_SECRET: { type: 'string' },
        CLOUDINARY_CLOUD_NAME: { type: 'string' },
        CLOUDINARY_API_KEY: { type: 'string' },
        CLOUDINARY_API_SECRET: { type: 'string' },
        URL_FRONTEND: { type: 'string' },
    }
};
