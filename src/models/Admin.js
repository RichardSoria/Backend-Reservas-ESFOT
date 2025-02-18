import mongoose from "mongoose";
import bcrypt from "bcrypt";


// Esquema del administrador
const adminSchema = new mongoose.Schema({
    cedula: {
        type: String,
        required: [true, 'La cédula es requerida'],
        unique: [true, 'La cédula ya está registrada'],
        match: [/^\d{10}$/, 'La cédula debe tener 10 dígitos']
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [20, 'El nombre no puede tener más de 20 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        maxlength: [20, 'El apellido no puede tener más de 20 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: [true, 'El correo ya está registrado'],
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'El correo no es válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'La contraseña debe tener al menos una minúscula, una mayúscula y un número']
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        match: [/^\d{10}$/, 'El teléfono debe tener 10 dígitos']
    },
    status: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Método para encriptar la contraseña antes de guardar
adminSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salt);
    return passwordEncrypted;
};

// Método para comparar la contraseña ingresada con la almacenada
adminSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

// Método para actualizar el último inicio de sesión
adminSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
};

// Método para manejar intentos fallidos de inicio de sesión
adminSchema.methods.failedLoginAttempt = async function () {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 5) {
        this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    }
    await this.save();
};

// Método para crear un token de autenticación
adminSchema.methods.createToken = function () {
    const token = this.token = Math.random().toString(36).substring(2);
    return token;
};

// Crear el modelo de administrador
export default model('Admin', adminSchema);