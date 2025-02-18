import nodemailer from 'nodemailer';
import { envSchema } from './config/envSchema.js';

// Crea un transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    }
});

// Enviar correo electrónico	
