export const loginEstudianteSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
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

export const registerEstudianteSchema = {
    body: {
        type: 'object',
        required: ['cedula', 'name', 'lastName', 'email', 'phone', 'career'],
        properties: {
            cedula: {
                type: 'string',
                minLength: 1,
                pattern: '^[0-9]{10}$',
                errorMessage: {
                    pattern: 'La cédula debe tener exactamente 10 dígitos numéricos',
                    minLength: 'El campo de cédula es obligatorio'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                pattern: '^[\\p{L}]{1,20}$',                
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de nombre es obligatorio'
                }
            },
            lastName: {
                type: 'string',
                minLength: 1,
                pattern: '^[\\p{L}]{1,20}$',                
                errorMessage: {
                    pattern: 'El apellido solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de apellido es obligatorio'
                }
            },
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            phone: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '09[89][0-9]{7}$',
                errorMessage: {
                    pattern: 'El número debe empezar con 098 o 099 y tener 10 dígitos',
                    minLength: 'El campo de teléfono es obligatorio',
                    maxLength: 'El teléfono debe tener exactamente 10 dígitos'
                }
            },
            career: {
                type: 'string',
                enum: [
                    'Tecnología Superior en Agua y Saneamiento Ambiental',
                    'Tecnología Superior en Desarrollo de Software',
                    'Tecnología Superior en Electromecánica',
                    'Tecnología Superior en Redes y Telecomunicaciones',
                    'Tecnología Superior en Procesamiento de Alimentos',
                    'Tecnología Superior en Procesamiento Industrial de la Madera'
                ],
                errorMessage: {
                    enum: 'La carrera debe ser una de las opciones disponibles'
                }
            }
        }
        ,
        additionalProperties: false
    }
};

export const updateEstudianteSchema = {
    body: {
        type: 'object',
        properties: {
            cedula: {
                type: 'string',
                minLength: 1,
                pattern: '^[0-9]{10}$',
                errorMessage: {
                    pattern: 'La cédula debe tener exactamente 10 dígitos numéricos',
                    minLength: 'El campo de cédula es obligatorio'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                pattern: '^[\\p{L}]{1,20}$',                
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de nombre es obligatorio'
                }
            },
            lastName: {
                type: 'string',
                minLength: 1,
                pattern: '^[\\p{L}]{1,20}$',                
                errorMessage: {
                    pattern: 'El apellido solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de apellido es obligatorio'
                }
            },
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            phone: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '09[89][0-9]{7}$',
                errorMessage: {
                    pattern: 'El número debe empezar con 098 o 099 y tener 10 dígitos',
                    minLength: 'El campo de teléfono es obligatorio',
                    maxLength: 'El teléfono debe tener exactamente 10 dígitos'
                }
            },
            career: {
                type: 'string',
                enum: [
                    'Tecnología Superior en Agua y Saneamiento Ambiental',
                    'Tecnología Superior en Desarrollo de Software',
                    'Tecnología Superior en Electromecánica',
                    'Tecnología Superior en Redes y Telecomunicaciones',
                    'Tecnología Superior en Procesamiento de Alimentos',
                    'Tecnología Superior en Procesamiento Industrial de la Madera'
                ],
                errorMessage: {
                    enum: 'La carrera debe ser una de las opciones disponibles'
                }
            },
        },
        additionalProperties: false
    }
};

export const updatePasswordSchema = {
    body: {
        type: 'object',
        required: ['password', 'confirmPassword'],
        properties: {
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: "La contraseña debe tener al menos 8 caracteres"
                }
            },
            confirmPassword: {
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

export const recoverPasswordSchema = {
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            }
        },
        additionalProperties: false
    }
};