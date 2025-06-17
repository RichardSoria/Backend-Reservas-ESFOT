export const createReservaSchema = {
    body: {
        type: 'object',
        required: [
            'userID',
            'userRol',
            'placeID',
            'placeType',
            'purpose',
            'description',
            'startTime',
            'endTime'
        ],
        properties: {
            userID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El userID debe ser un ID de objeto válido de MongoDB'
                }
            },
            userRol: {
                type: 'string',
                enum: ['Estudiante', 'Docente', 'Admin'],
                errorMessage: {
                    enum: 'El rol del usuario debe ser uno de los siguientes: Estudiante, Docente, Admin'
                }
            },
            placeID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El placeID debe ser un ID de objeto válido de MongoDB'
                }
            },
            placeType: {
                type: 'string',
                enum: ['Aula', 'Laboratorio'],
                errorMessage: {
                    enum: 'El tipo de lugar debe ser uno de los siguientes: Aula, Laboratorio'
                }
            },
            purpose: {
                type: 'string',
                enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro'],
                errorMessage: {
                    enum: 'El propósito debe ser uno de los siguientes: Clase, Prueba/Examen, Proyecto, Evento/Capacitación, Otro'
                }
            },
            description: {
                type: 'string',
                minLength: 1,
                pattern: '^[a-zA-Z0-9\\s.,;:-]{1,200}$',
                errorMessage: {
                    pattern: 'La descripción puede contener letras, números y algunos caracteres especiales (.,;:-) y tener hasta 200 caracteres',
                    minLength: 'El campo de descripción es obligatorio'
                }
            },
            status: {
                type: 'string',
                enum: ['Pendiente', 'Aprobada', 'Rechazada', 'Cancelada'],
                default: 'Pendiente',
                errorMessage: {
                    enum: 'El estado debe ser uno de los siguientes: Pendiente, Aprobada, Rechazada, Cancelada'
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