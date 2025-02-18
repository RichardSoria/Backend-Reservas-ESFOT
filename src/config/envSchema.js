// Variables de entorno cargadas
export const envSchema = {
    type: 'object',
    required: ['PORT', 'MONGODB_URI', 'SUPER_ADMIN', 'SUPER_ADMIN_PASSWORD'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        MONGODB_URI: { type: 'string' },
        SUPER_ADMIN: { type: 'string' },
        SUPER_ADMIN_PASSWORD: { type: 'string' }
    }
};
