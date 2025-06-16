export const createLaboratorioSchema = {
    body: {
        type: 'object',
        required: ['codigo', 'name', 'description', 'capacity', 'equipmentPC', 'equipmentProyector', 'equipmentInteractiveScreen'],
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
                maxLength: 20,
                pattern: '^[\\p{L}0-9\\s-]+$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras, números y espacios',
                    minLength: 'El campo de nombre es obligatorio',
                    maxLength: 'El nombre no puede tener más de 20 caracteres',
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,100}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-)',
                    minLength: 'El campo de descripción es obligatorio',
                    maxLength: 'La descripción no puede tener más de 100 caracteres',
                }
            },
            capacity: {
                type: 'number',
                minimum: 1,
                errorMessage: {
                    minimum: 'La capacidad debe ser al menos 1'
                }
            },
            equipmentPC: {
                type: 'boolean',
                default: null,
                errorMessage: {
                    type: 'El campo de PC debe ser un booleano'
                }
            },
            equipmentProyector: {
                type: 'boolean',
                default: null,
                errorMessage: {
                    type: 'El campo de proyector debe ser un booleano'
                }
            },
            equipmentInteractiveScreen: {
                type: 'boolean',
                default: null,
                errorMessage: {
                    type: 'El campo de pantalla interactiva debe ser un booleano'
                }
            },
        },
        additionalProperties: false
    }
};

export const updateLaboratorioSchema = {
    body: {
        type: 'object',
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
                maxLength: 20,
                pattern: '^[\\p{L}0-9\\s-]+$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras, números y espacios',
                    minLength: 'El campo de nombre es obligatorio',
                    maxLength: 'El nombre no puede tener más de 20 caracteres',
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,100}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-)',
                    minLength: 'El campo de descripción es obligatorio',
                    maxLength: 'La descripción no puede tener más de 100 caracteres',
                }
            },
            capacity: {
                type: 'number',
                minimum: 1,
                errorMessage: {
                    minimum: 'La capacidad debe ser al menos 1'
                }
            },
            equipmentPC: {
                type: 'boolean',
                default: false,
                errorMessage: {
                    type: 'El campo de PC debe ser un booleano'
                }
            },
            equipmentProyector: {
                type: 'boolean',
                default: false,
                errorMessage: {
                    type: 'El campo de proyector debe ser un booleano'
                }
            },
            equipmentInteractiveScreen: {
                type: 'boolean',
                default: false,
                errorMessage: {
                    type: 'El campo de pantalla interactiva debe ser un booleano'
                }
            },
        },
        additionalProperties: false
    }
};