import { loginDocente, registerDocente, updateDocente, enableDocente, disableDocente, recoverPassword, verifyToken, sendRecoverPassword, getAllDocentes, getDocenteById, getDocenteProfile } from "../controllers/docente_controller.js";
import { loginDocenteSchema, registerDocenteSchema, updateDocenteSchema } from "../schema/docente_schema.js";
import verifyAuth from "../middlewares/authentication.js";

export default async function docenteRoutes(fastify) {
    fastify.post("/login", { schema: loginDocenteSchema }, loginDocente);
    fastify.post("/register", { preHandler: verifyAuth, schema: registerDocenteSchema }, registerDocente);
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateDocenteSchema }, updateDocente);
    fastify.put("/enable/:id", { preHandler: verifyAuth }, enableDocente);
    fastify.put("/disable/:id", { preHandler: verifyAuth }, disableDocente);
    fastify.post("/recover-password", recoverPassword);
    fastify.get("/recover-password/:token", verifyToken);
    fastify.post("/send-recover-password/:token", sendRecoverPassword);
    fastify.get("/docentes", { preHandler: verifyAuth }, getAllDocentes);
    fastify.get("/docente/:id", { preHandler: verifyAuth }, getDocenteById);
    fastify.get("/profile", { preHandler: verifyAuth }, getDocenteProfile);
}