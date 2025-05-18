import{ loginAdmin, registerAdmin, updateAdmin, enableAdmin, disableAdmin, recoverPassword, verifyToken, sendRecoverPassword, updatePassword, getAllAdmins, getAdminById, getAdminProfile  } from "../controllers/admin_controller.js";
import { loginAdminSchema, registerAdminSchema, updateAdminSchema, recoverPasswordSchema, updatePasswordSchema } from "../schema/admin_schema.js";
import verifyAuth from "../middlewares/authentication.js";

export default async function adminRoutes(fastify) {
    fastify.post("/login", { schema: loginAdminSchema }, loginAdmin);
    fastify.post("/register", { preHandler: verifyAuth, schema: registerAdminSchema }, registerAdmin);
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateAdminSchema }, updateAdmin);
    fastify.put("/enable/:id", { preHandler: verifyAuth},  enableAdmin);
    fastify.put("/disable/:id", { preHandler: verifyAuth}, disableAdmin);
    fastify.post("/recover-password", { schema: recoverPasswordSchema }, recoverPassword);
    fastify.get("/verify-token/:token", verifyToken);
    fastify.post("/send-recover-password/:token", sendRecoverPassword);
    fastify.put("/update-password", { preHandler: verifyAuth, schema: updatePasswordSchema }, updatePassword);
    fastify.get("/admins", { preHandler: verifyAuth}, getAllAdmins);
    fastify.get("/admin/:id", { preHandler: verifyAuth}, getAdminById);
    fastify.get("/profile", { preHandler: verifyAuth }, getAdminProfile);
}
