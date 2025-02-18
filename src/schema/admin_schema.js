export const registerAdminSchema = {
    body: {
        type: 'object',
        required: ['cedula', 'name', 'lastName', 'email', 'password', 'phone'],
        properties: {
            cedula: {
                type: 'string',
                pattern: '^[0-9]{10}$',
                errorMessage: 'La cédula debe tener exactamente 10 dígitos numéricos'
            },
            name: {
                type: 'string',
                minLength: 2,
                maxLength: 20,
                errorMessage: 'El nombre debe tener entre 2 y 20 caracteres'
            },
            lastName: {
                type: 'string',
                minLength: 2,
                maxLength: 20,
                errorMessage: 'El apellido debe tener entre 2 y 20 caracteres'
            },
            email: {
                type: 'string',
                pattern: "^[a-zA-Z]+\\.[a-zA-Z]+[0-9]*@epn\\.edu\\.ec$",
                errorMessage: "El correo debe ser institucional."
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
                errorMessage: 'La contraseña debe tener al menos una minúscula, una mayúscula y un número'
            },
            phone: {
                type: 'string',
                pattern: '^[0-9]{10}$',
                errorMessage: 'El teléfono debe tener exactamente 10 dígitos numéricos'
            },
            status: {
                type: 'boolean',
                default: true,
                errorMessage: 'El estado debe ser un valor booleano'
            }
        }
    }
};

export const loginAdminSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { 
                type: 'string',
                pattern: "^[a-zA-Z]+\\.[a-zA-Z]+[0-9]*@epn\\.edu\\.ec$",
                errorMessage: "El correo debe ser institucional."
            },
            password: { 
                type: 'string', 
                minLength: 8, 
                errorMessage: "La contraseña debe tener al menos 8 caracteres" 
            }
        },
        additionalProperties: false
    }
};
