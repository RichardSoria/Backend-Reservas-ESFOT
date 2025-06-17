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