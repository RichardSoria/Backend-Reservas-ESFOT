export const createReservaSchema = {
    body: {
        type: 'object',
        required: [
            'placeID',
            'placeType',
            'purpose',
            'reservationDate',
            'startTime',
            'endTime',
            'description',
        ],
        properties: {
            placeType: {
                type: 'string',
                enum: ['Aula', 'Laboratorio'],
                errorMessage: {
                    enum: 'El tipo de lugar debe ser uno de los siguientes: Aula, Laboratorio'
                }
            },
            placeID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El placeID debe ser un ID de objeto válido de MongoDB'
                }
            },
            purpose: {
                type: 'string',
                enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro'],
                errorMessage: {
                    enum: 'El propósito debe ser uno de los siguientes: Clase, Prueba/Examen, Proyecto, Evento/Capacitación, Otro'
                }
            },
            reservationDate: {
                type: 'string',
                format: 'date',
                errorMessage: {
                    format: 'La fecha de reserva debe estar en formato YYYY-MM-DD'
                }
            },
            startTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', // Validación de formato de hora (HH:mm)
                errorMessage: {
                    pattern: 'La hora de inicio debe estar en formato HH:mm'
                }
            },
            endTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$', // Validación de formato de hora (HH:mm)
                errorMessage: {
                    pattern: 'La hora de fin debe estar en formato HH:mm'
                }
            },
            description: {
                type: "string",
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$",
                errorMessage: {
                    pattern: "La descripción puede contener letras, números y los caracteres especiales básicos (.,;:() - _ ¡! ¿? etc.)",
                    minLength: "El campo de descripción es obligatorio",
                    maxLength: "La descripción no puede tener más de 200 caracteres"
                }
            },
            additionalProperties: false
        }
    }
};

export const rejectReasonSchema = {
    body: {
        type: 'object',
        required: ['rejectReason'],
        properties: {
            rejectReason: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,200}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-) y tener hasta 200 caracteres',
                    minLength: 'El campo de descripción es obligatorio'
                }
            }
        }
    }
};