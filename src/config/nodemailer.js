import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

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

// Enviar correo al nuevo administrador
const sendMailNewUser = async (email, password, name, lastName) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Bienvenido a la plataforma',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>Credenciales de acceso:</strong></p>
            <ul>
                <li><strong>Correo:</strong> ${email}</li>
                <li><strong>Contraseña:</strong> Esfot@${password}-1990</li>
            </ul>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

const sendMailUpdateUser = async (email, name, lastName) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Actualización de cuenta',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Tu cuenta ha sido actualizada con éxito.</p>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

const sendMailEnableUser = async (email, name, lastName) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Activación de cuenta',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Tu cuenta ha sido activada con éxito.</p>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

const sendMailDisableUser = async (email, name, lastName) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Desactivación de cuenta',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Tu cuenta ha sido desactivada.</p>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

const sendMailRecoverPassword = async (email, token, name, lastName, resetTokenDate) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <a href="${process.env.URL_FRONTEND}/enviar-contrasena-recuperacion/${token}">Restablecer contraseña</a>
            <p>Este enlace es válido hasta las ${resetTokenDate}</p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

const sendMailNewPassword = async (email, password, name, lastName) => {
    try {
        const mailOptions = {
            from: process.env.USER_MAILTRAP,
            to: email,
            subject: 'Nueva contraseña',
            html: `
            <p>Hola <strong>${name} ${lastName}</strong>,</p>
            <p>Tu contraseña ha sido restablecida con éxito.</p>
            <p><strong>Tu nueva contraseña es:</strong> Esfot@${password}-1990</p>
            <p>Saludos,<br/>Equipo de soporte.</p>
        `
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

export { sendMailNewUser, sendMailRecoverPassword, sendMailNewPassword, sendMailUpdateUser, sendMailEnableUser, sendMailDisableUser };