export const createAulaSchema = {
    body: {
        type: 'object',
        required: ['codigo','name','description','capacity','size'],
        properties: {
            codigo: {
                type: 'string',
                minLength: 1,
                pattern: '^E\\d{2}/PB\\d/E\\d{3}$',
                errorMessage: {
                    minLength: 'El campo de código es obligatorio',
                    pattern: 'El código debe seguir el formato E00/PB0/E000'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z]{1,20}$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de nombre es obligatorio'
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,100}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-) y tener hasta 100 caracteres',
                    minLength: 'El campo de descripción es obligatorio'
                }
            },
            capacity: {
                type: 'number',
                minimum: 1,
                errorMessage: {
                    minimum: 'La capacidad debe ser al menos 1'
                }
            },
            size: {
                type: 'string',
                enum: ['Pequeño', 'Mediano', 'Grande'],
                errorMessage: {
                    enum: 'El tamaño debe ser pequeño, mediano o grande'
                }
            },
            image: {
                type: 'string',
                minLength: 1,
                format: 'uri',
                errorMessage: {
                    minLength: 'El campo de imagen es obligatorio',
                    format: 'La imagen debe ser una URL válida'
                }
            }
        },
        additionalProperties:false
    }
};

export const updateAulaSchema = {
    body: {
        type: 'object',
        properties: {
            codigo: {
                type: 'string',
                pattern: '^E\\d{2}/PB\\d/E\\d{3}$',
                errorMessage: {
                    pattern: 'El código debe seguir el formato E00/PB0/E000'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z]{1,20}$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de nombre es obligatorio'
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,100}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-) y tener hasta 100 caracteres',
                    minLength: 'El campo de descripción es obligatorio'
                }
            },
            capacity: {
                type: 'number',
                minimum: 1,
                errorMessage: {
                    minimum: 'La capacidad debe ser al menos 1'
                }
            },
            size: {
                type: 'string',
                enum: ['Pequeño', 'Mediano', 'Grande'],
                errorMessage: {
                    enum: 'El tamaño debe ser pequeño, mediano o grande'
                }
            },
            image: {
                type: 'string',
                minLength: 1,
                format: 'uri',
                errorMessage: {
                    minLength: 'El campo de imagen es obligatorio',
                    format: 'La imagen debe ser una URL válida'
                }
            }
        },
        additionalProperties:false
    }
};