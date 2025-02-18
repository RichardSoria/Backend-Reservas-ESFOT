import { login } from "../controllers/admin_controller.js";
import { loginAdminSchema } from "../schema/admin_schema.js";

export default async function adminRoutes(fastify, options) {
    console.log("📌 Registrando rutas de admin...");

    fastify.post("/login", { schema: loginAdminSchema }, login);
}
