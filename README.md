
# Backend - Sistema de Reservas ESFOT

Este proyecto corresponde al **backend del Sistema de Reservas de Aulas y Laboratorios** de la Escuela de Formación de Tecnólogos (ESFOT) de la Escuela Politécnica Nacional.  
El objetivo es proveer una API robusta y segura que gestione **usuarios, espacios académicos y reservas**, integrando validaciones dinámicas, autenticación basada en roles y despliegue en contenedores.

---

## 🚀 Tecnologías Utilizadas

- **Node.js** + **Fastify** (Framework backend)
- **MongoDB** (Base de datos con soporte de réplicas)
- **Mongoose** (Modelado de datos)
- **JWT** (Autenticación)
- **Bcrypt** (Hashing de contraseñas)
- **Nodemailer** (Notificaciones por correo)
- **Docker** (Contenedorización y despliegue)
- **CORS y HTTPS** (Seguridad en producción)

---

## 📂 Estructura del Proyecto

```
src/
│── config/         # Configuración general (conexión DB, variables, CORS, etc.)
│── controllers/    # Lógica de negocio de cada módulo
│── helpers/        # Funciones utilitarias
│── middlewares/    # Validaciones, autenticación, control de acceso
│── models/         # Modelos Mongoose
│── routes/         # Definición de endpoints y rutas
│── schema/         # Validaciones de datos (schemas)
│── database.js     # Conexión a MongoDB
│── server.js       # Inicialización del servidor Fastify
│── index.js        # Configuración inicial y carga de módulos
```

---

## ⚙️ Configuración del Entorno

Antes de ejecutar el backend, crea un archivo `.env` basado en `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://mongo-primary:27017,mongo-secondary1:27017,mongo-secondary2:27017/reservas-esfot?replicaSet=rs0

HOST_MAILTRAP=smtp.gmail.com
PORT_MAILTRAP=465
USER_MAILTRAP=tu_correo@gmail.com
PASS_MAILTRAP=tu_password

JWT_SECRET=clave_secreta
COOKIE_SECRET=otra_clave_secreta

URL_FRONTEND=http://localhost:5173
```

---

## ▶️ Ejecución Local

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/RichardSoria/Backend-Reservas-ESFOT.git
   cd Backend-Reservas-ESFOT
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Levantar el servidor**
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:3000`.

---

## 📌 Endpoints Principales

| Módulo              | Descripción                                       |
|---------------------|---------------------------------------------------|
| Autenticación       | Registro, login, recuperación de contraseña        |
| Gestión de Usuarios | CRUD completo de usuarios (Admin, Docente, Est.)   |
| Espacios Académicos | CRUD de aulas y laboratorios                       |
| Reservas            | Creación, aprobación, rechazo, cancelación         |
| Correos             | Notificaciones automáticas por cambios de estado   |

La documentación completa de endpoints está disponible en Swagger/OpenAPI.

---

## 🔒 Seguridad

- **JWT** para autenticación y autorización.
- **CORS configurado** para entornos de producción.
- **Validaciones dinámicas** en backend y frontend.
- **Roles de usuario** con control de acceso a rutas protegidas.

---

## 📌 Despliegue

El backend se encuentra desplegado en:

https://backend-reservas-esfot.onrender.com/api/docs

---

## 👨‍💻 Autor

**Richard Soria**  
Desarrollador Backend - Sistema de Reservas ESFOT  
