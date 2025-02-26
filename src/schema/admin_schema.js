export const loginAdminSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-zA-Z]+\\.[a-zA-Z]+[0-9]*@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: "La contraseña debe tener al menos 8 caracteres"
                }
            }
        },
        additionalProperties: false
    }
};

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
                minLength: 1,
                pattern: "^[a-zA-Z]+\\.[a-zA-Z]+[0-9]*@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: "La contraseña debe tener al menos 8 caracteres"
                }
            },
            phone: {
                type: 'string',
                pattern: '^[0-9]{10}$',
                errorMessage: 'El teléfono debe tener exactamente 10 dígitos numéricos'
            }
        }
    }
};
