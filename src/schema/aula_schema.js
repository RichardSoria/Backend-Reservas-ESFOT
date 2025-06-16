export const createAulaSchema = {
    body: {
        type: 'object',
        required: ['name', 'description', 'capacity'],
        properties: {
            name: {
                type: 'string',
                minLength: 1,
                pattern: '^E\\d{2}/PB\\d/E\\d{3}$',
                errorMessage: {
                    minLength: 'El campo de código es obligatorio',
                    pattern: 'El código debe seguir el formato E00/PB0/E000'
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
        },
        additionalProperties: false
    }
};

export const updateAulaSchema = {
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 12,
                maxLength: 12,
                pattern: '^E\\d{2}/PB\\d{1}/E\\d{3}$',
                errorMessage: {
                    pattern: 'El nombre debe seguir exactamente el formato E00/PB0/E000',
                    minLength: 'El campo de nombre debe tener exactamente 12 caracteres',
                    maxLength: 'El campo de nombre debe tener exactamente 12 caracteres',
                },
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '^[\\p{L}\\p{N}\\s.,;:()¿?¡!-]+$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números, espacios y algunos caracteres especiales (.,;:()¿?¡!-)',
                    minLength: 'El campo de descripción es obligatorio',
                    maxLength: 'La descripción no puede exceder los 100 caracteres'
                }
            },
            capacity: {
                type: 'number',
                minimum: 1,
                errorMessage: {
                    minimum: 'La capacidad debe ser al menos 1'
                }
            },
        },
        additionalProperties: false
    }
};