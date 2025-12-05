# Backend API - Sistema de Gestión de Residencias

Backend desarrollado en Node.js + TypeScript + Express + PostgreSQL para el sistema de gestión de residencias.

## Características

- ✅ Autenticación JWT
- ✅ Control de acceso basado en roles (Admin y Residente)
- ✅ CRUD completo para todas las entidades
- ✅ PostgreSQL con Sequelize ORM
- ✅ Validación de datos con express-validator
- ✅ Manejo centralizado de errores
- ✅ TypeScript para type safety

## Entidades del Sistema

### Roles de Usuario

#### Administrador
- Crear, editar y eliminar: residencias, amenidades, actividades, usuarios, reportes y pagos
- Ver todas las entidades del sistema
- Responder y actualizar reportes
- Gestionar pagos de todos los residentes

#### Residente
- Ver: residencias, amenidades, actividades
- Crear y gestionar sus propios reportes/quejas
- Ver y pagar sus propios pagos
- Actualizar su perfil

## Requisitos Previos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

## Instalación

1. **Navegar al directorio del backend**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

El archivo `.env` ya está configurado con los valores por defecto:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=residence_management4
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
CORS_ORIGIN=http://localhost:4200
```

4. **Crear la base de datos**

Asegúrate de que PostgreSQL esté ejecutándose y crea la base de datos:

```bash
psql -U postgres
CREATE DATABASE residence_management4;
\q
```

5. **Ejecutar migraciones**
```bash
npm run db:migrate
```

6. **Poblar la base de datos con datos de prueba**
```bash
npm run db:seed
```

## Scripts Disponibles

```bash
# Desarrollo (con auto-reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start

# Ejecutar migraciones
npm run db:migrate

# Poblar base de datos
npm run db:seed
```

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (database)
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware (auth, validation, errors)
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Definición de rutas
│   ├── scripts/         # Scripts de migración y seed
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos TypeScript
│   └── index.ts         # Entrada de la aplicación
├── .env                 # Variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario por ID (Admin)
- `POST /api/users` - Crear usuario (Admin)
- `PUT /api/users/:id` - Actualizar usuario (Admin)
- `DELETE /api/users/:id` - Eliminar usuario (Admin)
- `GET /api/users/profile` - Obtener perfil del usuario actual
- `PUT /api/users/profile` - Actualizar perfil del usuario actual

### Residencias
- `GET /api/residences` - Obtener todas las residencias
- `GET /api/residences/available` - Obtener residencias disponibles
- `GET /api/residences/:id` - Obtener residencia por ID
- `POST /api/residences` - Crear residencia (Admin)
- `PUT /api/residences/:id` - Actualizar residencia (Admin)
- `DELETE /api/residences/:id` - Eliminar residencia (Admin)

### Amenidades
- `GET /api/amenities` - Obtener todas las amenidades
- `GET /api/amenities/available` - Obtener amenidades disponibles
- `GET /api/amenities/:id` - Obtener amenidad por ID
- `POST /api/amenities` - Crear amenidad (Admin)
- `PUT /api/amenities/:id` - Actualizar amenidad (Admin)
- `DELETE /api/amenities/:id` - Eliminar amenidad (Admin)

### Actividades
- `GET /api/activities` - Obtener todas las actividades
- `GET /api/activities/upcoming` - Obtener actividades próximas
- `GET /api/activities/:id` - Obtener actividad por ID
- `POST /api/activities` - Crear actividad (Admin)
- `PUT /api/activities/:id` - Actualizar actividad (Admin)
- `DELETE /api/activities/:id` - Eliminar actividad (Admin)

### Reportes/Quejas
- `GET /api/reports` - Obtener reportes (Admin: todos, Residente: propios)
- `GET /api/reports/:id` - Obtener reporte por ID
- `POST /api/reports` - Crear reporte
- `PUT /api/reports/:id` - Actualizar reporte
- `DELETE /api/reports/:id` - Eliminar reporte

### Pagos
- `GET /api/payments` - Obtener pagos (Admin: todos, Residente: propios)
- `GET /api/payments/pending` - Obtener pagos pendientes del usuario
- `GET /api/payments/:id` - Obtener pago por ID
- `POST /api/payments` - Crear pago (Admin)
- `PUT /api/payments/:id` - Actualizar pago
- `DELETE /api/payments/:id` - Eliminar pago (Admin)

## Autenticación

Todas las rutas (excepto `/api/auth/login` y `/api/auth/register`) requieren autenticación mediante JWT.

Incluir el token en el header de las peticiones:
```
Authorization: Bearer <token>
```

## Credenciales de Prueba

Después de ejecutar el seed, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@residence.com`
- Password: `admin123`

**Residentes:**
- Email: `juan.perez@example.com` / Password: `resident123`
- Email: `maria.garcia@example.com` / Password: `resident123`
- Email: `carlos.lopez@example.com` / Password: `resident123`

## Ejemplo de Uso

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@residence.com","password":"admin123"}'
```

### Obtener Residencias
```bash
curl -X GET http://localhost:3000/api/residences \
  -H "Authorization: Bearer <tu_token>"
```

## Tecnologías Utilizadas

- **Node.js** - Runtime
- **TypeScript** - Lenguaje
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación
- **cors** - CORS
- **morgan** - Logger HTTP
- **dotenv** - Variables de entorno

## Desarrollo

El servidor incluye hot-reload con nodemon. Cualquier cambio en los archivos `.ts` reiniciará automáticamente el servidor.

## Producción

1. Cambiar `NODE_ENV` a `production` en `.env`
2. Cambiar `JWT_SECRET` a un valor seguro
3. Configurar las credenciales de base de datos de producción
4. Compilar: `npm run build`
5. Ejecutar: `npm start`

## Licencia

ISC
