import { login, register } from "../controllers/admin_controller.js";
import { loginAdminSchema, registerAdminSchema } from "../schema/admin_schema.js";

export default async function adminRoutes(fastify) {
    fastify.post("/login", { schema: loginAdminSchema }, login);
    fastify.post("/register", { schema: registerAdminSchema }, register);
}
