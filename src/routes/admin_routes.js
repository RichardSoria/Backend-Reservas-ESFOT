import{ loginAdmin, registerAdmin, updateAdmin, enableAdmin, disableAdmin, recoverPassword, verifyToken, sendRecoverPassword } from "../controllers/admin_controller.js";
import { loginAdminSchema, registerAdminSchema } from "../schema/admin_schema.js";

export default async function adminRoutes(fastify) {
    fastify.post("/login", { schema: loginAdminSchema }, loginAdmin);
    fastify.post("/register", { schema: registerAdminSchema }, registerAdmin);
    fastify.put("/update/:id", { schema: registerAdmin }, updateAdmin);
    fastify.put("/enable/:id", enableAdmin);
    fastify.put("/disable/:id", disableAdmin);
    fastify.post("/recover-password", recoverPassword);
    fastify.get("/recover-password/:token", verifyToken);
    fastify.post("/send-recover-password/:token", sendRecoverPassword);
}
