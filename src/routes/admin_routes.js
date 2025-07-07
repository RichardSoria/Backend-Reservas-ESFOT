import {
    loginAdminSchema,
    registerAdminSchema,
    updateAdminSchema,
    enableAdminSchema,
    disableAdminSchema,
    recoverPasswordSchema,
    verifyTokenSchema,
    sendRecoverPasswordSchema,
    updatePasswordSchema,
    getAllAdminsSchema,
    getAdminByIdSchema,
    getAdminProfileSchema
} from "../schema/admin_schema.js";

import {
    loginAdmin,
    registerAdmin,
    updateAdmin,
    enableAdmin,
    disableAdmin,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllAdmins,
    getAdminById,
    getAdminProfile
} from "../controllers/admin_controller.js";

import verifyAuth from "../middlewares/authentication.js";

export default async function adminRoutes(fastify) {
    // Login sin autenticación previa
    fastify.post("/login", { schema: loginAdminSchema }, loginAdmin);

    // Registro, solo admin autenticado
    fastify.post("/register", { preHandler: verifyAuth, schema: registerAdminSchema }, registerAdmin);

    // Actualizar admin por id, solo autenticado
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateAdminSchema }, updateAdmin);

    // Habilitar admin por id, solo autenticado
    fastify.put("/enable/:id", { preHandler: verifyAuth, schema: enableAdminSchema }, enableAdmin);

    // Deshabilitar admin por id, solo autenticado
    fastify.put("/disable/:id", { preHandler: verifyAuth, schema: enableAdminSchema }, disableAdmin);

    // Solicitar recuperación de contraseña
    fastify.post("/recover-password", { schema: recoverPasswordSchema }, recoverPassword);

    // Verificar token de recuperación (por parámetro)
    fastify.get("/verify-token/:token", { schema: verifyTokenSchema }, verifyToken);

    // Enviar nueva contraseña con token (por parámetro)
    fastify.post("/send-recover-password/:token", { schema: sendRecoverPasswordSchema }, sendRecoverPassword);

    // Actualizar contraseña (requiere autenticación)
    fastify.put("/update-password", { preHandler: verifyAuth, schema: updatePasswordSchema }, updatePassword);

    // Obtener todos los admins (requiere autenticación)
    fastify.get("/admins", { preHandler: verifyAuth, schema: getAllAdminsSchema }, getAllAdmins);

    // Obtener admin por ID (requiere autenticación)
    fastify.get("/admins/:id", { preHandler: verifyAuth, schema: getAdminByIdSchema }, getAdminById);

    // Obtener perfil del admin autenticado
    fastify.get("/profile", { preHandler: verifyAuth, schema: getAdminProfileSchema }, getAdminProfile);
}
