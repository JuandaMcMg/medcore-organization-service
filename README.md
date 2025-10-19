# MedCore Organization Service

Este microservicio gestiona la estructura organizativa del sistema MedCore, incluyendo departamentos, especialidades y afiliaciones de usuarios.

## Características

- Gestión de departamentos médicos
- Gestión de especialidades médicas
- Asignación de profesionales a departamentos/especialidades
- Afiliación de usuarios a roles organizacionales
- Estructura jerárquica organizacional

## Tecnologías

- Node.js
- Express
- MongoDB (con Prisma ORM)
- JWT para verificación de identidad

## Requisitos

- Node.js 14.x o superior
- MongoDB
- NPM o Yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd organization-service
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar Prisma:
```bash
npx prisma generate
```

4. Crear archivo `.env` con las siguientes variables:
```
PORT=3004
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:3003
AUDIT_SERVICE_URL=http://localhost:3006
```

5. Iniciar el servicio:
```bash
npm run dev
```

## Despliegue en Vercel

1. Asegúrate de tener una cuenta en [Vercel](https://vercel.com/) y el CLI instalado:
```bash
npm i -g vercel
```

2. Iniciar sesión en Vercel:
```bash
vercel login
```

3. Configurar variables de entorno en Vercel:
   - Ve a la configuración de tu proyecto en Vercel
   - Añade las variables de entorno mencionadas en el archivo `.env`

4. Desplegar el servicio:
```bash
vercel --prod
```

## Estructura del Proyecto

- `src/index.js`: Punto de entrada de la aplicación
- `src/controllers/`: Controladores para departamentos, especialidades y afiliaciones
- `src/routes/`: Definiciones de rutas
- `src/middlewares/`: Middleware de autenticación, validación, etc.
- `prisma/`: Esquemas de Prisma para la base de datos

## API Endpoints

- `GET/POST/PUT/DELETE /api/v1/departments`: CRUD de departamentos
- `GET/POST/PUT/DELETE /api/v1/specialities`: CRUD de especialidades
- `GET/POST /api/v1/affiliations`: Gestión de afiliaciones de usuarios
- `GET /health`: Estado del servicio