export const createLaboratorioSchema = {
    body: {
        type: 'object',
        required: ['codigo', 'name', 'description', 'specialty', 'capacity', 'size', 'image'],
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
            specialty: {
                type: 'string',
                enum: [
                    'TICs',
                    'Desarrollo de Software',
                    'Redes y Telecomunicaciones',
                    'Electromecánica',
                    'Agua y Saneamiento Ambiental',
                    'Procesamiento de Alimentos',
                    'Procesamiento Industrial de la Madera'
                ],
                errorMessage: {
                    enum: 'La especialidad debe ser una de las siguientes: TICs, Desarrollo de Software, Redes y Telecomunicaciones, Electromecánica, Agua y Saneamiento Ambiental, Procesamiento de Alimentos, Procesamiento Industrial de la Madera'
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
                enum: ['pequeño', 'mediano', 'grande'],
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
            specialty: {
                type: 'string',
                enum: [
                    'TICs',
                    'Desarrollo de Software',
                    'Redes y Telecomunicaciones',
                    'Electromecánica',
                    'Agua y Saneamiento Ambiental',
                    'Procesamiento de Alimentos',
                    'Procesamiento Industrial de la Madera'
                ],
                errorMessage: {
                    enum: 'La especialidad debe ser una de las siguientes: TICs, Desarrollo de Software, Redes y Telecomunicaciones, Electromecánica, Agua y Saneamiento Ambiental, Procesamiento de Alimentos, Procesamiento Industrial de la Madera'
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
                enum: ['pequeño', 'mediano', 'grande'],
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
        additionalProperties: false
    }
};