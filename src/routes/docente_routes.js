import { loginDocente, registerDocente, updateDocente } from "../controllers/docente_controller.js";
import { loginDocenteSchema, registerDocenteSchema, updateDocenteSchema } from "../schema/docente_schema.js";
import verifyAuth from "../middlewares/authentication.js";

export default async function docenteRoutes(fastify) {
    fastify.post("/login", { schema: loginDocenteSchema }, loginDocente);
    fastify.post("/register", { preHandler: verifyAuth, schema: registerDocenteSchema }, registerDocente);
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateDocenteSchema }, updateDocente);
}