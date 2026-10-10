# Kalibra Web App

Panel web de Kalibra para docentes y administradores, integrado con `kalibra-api` mediante HTTP y sesión por cookie `httpOnly`.

## Stack

React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, React Router 8 y Vitest 5 con Testing Library.

## Ejecución con la API

Se requiere una API que implemente el contrato v2 de integración. Los adaptadores se comprobaron contra la API local; consulta los [endpoints por pantalla y el alcance de validación](docs/api-integration.md).

En `kalibra-api`, prepara su archivo `.env` a partir de `.env.example` y completa `DB_PASSWORD` y `JWT_SECRET` según su README. Para desarrollo local por HTTP, configura también:

```dotenv
KALIBRA_SEED_GENERIC_USERS=true
JWT_COOKIE_SECURE=false
MATERIALS_MAX_FILE_SIZE=10MB
```

El formulario y la API admiten archivos de hasta 10 MB; ese es también el límite predeterminado de la API.

Desde el directorio de la API, inicia PostgreSQL, Redis, el motor adaptativo y la API:

```bash
docker compose up --build
```

El compose construye el motor desde el repositorio hermano `kalibra-adaptive-engine`. Las claves de proveedores y las credenciales R2 se configuran en el backend; sin ellas, las funciones dependientes pueden responder 503. La interfaz muestra «Servicio no disponible por el momento» y permite conservar la selección para reintentar.

En este repositorio:

```bash
npm ci
cp .env.example .env
npm run dev
```

Vite redirige `/api` a `http://localhost:8080`; `VITE_API_BASE_URL` usa `/api/v1` por defecto. Si apuntas directamente a otro origen, configura en la API el origen permitido y CORS con credenciales. El frontend envía `credentials: 'include'` en cada solicitud y nunca almacena tokens ni contraseñas.

La variable `KALIBRA_SEED_GENERIC_USERS=true` habilita estas cuentas genéricas:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Docente | `profesor.test1@upc.edu.pe` | `@profesortest1` |
| Docente | `profesor.test2@upc.edu.pe` | `@profesortest2` |
| Estudiante | `estudiante.test1@upc.edu.pe` | `@estudiantetest1` |
| Estudiante | `estudiante.test2@upc.edu.pe` | `@estudiantetest2` |
| Estudiante | `estudiante.test3@upc.edu.pe` | `@estudiantetest3` |
| Administrador | `admin.test1@upc.edu.pe` | `@admintest1` |

Los estudiantes acceden mediante la aplicación móvil. El docente entra a `/cursos`; el administrador, a `/admin/panel`, con acceso exclusivo a indicadores institucionales y al ranking `/admin/subtemas-criticos`.

La sesión se restaura con `GET /users/me`; la aplicación muestra un estado de carga hasta resolverla. El registro crea la cuenta y luego inicia sesión para obtener la cookie. Cerrar sesión requiere confirmación y ejecuta `POST /authentication/sign-out`. Una respuesta 401 de una solicitud protegida elimina la identidad local y vuelve a inicio de sesión.

## Validación

```bash
npm run lint
npx tsc -b
npx vitest run
npm run build
```

Los tests usan un stub de `fetch` exclusivo de `src/test/`, con fixtures tipadas y usuarios genéricos. La aplicación no incluye servicios simulados ni escenarios vacíos por URL: los estados vacíos provienen de las respuestas de la API.

## Arquitectura por capas

```text
src/
├── components/ui        primitivos reutilizables
├── components/layout    shells, sidebar y selector de curso
├── components/<feature> presentación de cada funcionalidad
├── pages                composición de pantallas
├── hooks                carga, estado y acciones mediante useResource
├── services             contratos, adaptadores HTTP y mappers puros
├── context              curso activo y notificaciones
├── navigation           rutas y guards por rol
├── types                modelos de UI, DTO y errores
├── utils                validación y formateo
└── test                 fixtures y stub HTTP, solo para pruebas
```

Los tokens de diseño viven en `src/index.css`. Las pantallas son mobile-first. Los campos que la API no entrega se ocultan o muestran sin datos; el frontend no inventa ciclo, facultad, tamaño de archivo, páginas, fechas de actividad ni recomendaciones.
