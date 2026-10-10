# Kalibra Web App

Panel web del docente de Kalibra: gestiona cursos y subtemas, ejercicios generados, invitaciones e indicadores.

> Estado actual: **solo interfaz y navegación**. No hay integración con la API; los datos salen de servicios simulados (`src/mocks`).

## Stack

| Paquete | Versión |
| --- | --- |
| React / React DOM | 19.3.0 (lockfile; rango declarado `^19.2.0`) |
| Vite | 7.3 |
| TypeScript | 5.9 |
| Tailwind CSS (`@tailwindcss/vite`) | 4.3.3 |
| React Router | 8.4.0 |
| Vitest + Testing Library + jsdom | 5.0.3 / 16.3.3 / 29.1.1 |

La tabla refleja `package-lock.json`: React está instalado en 19.3.0 dentro del rango `^19.2.0` del manifiesto.

`jsdom` se fija en 29.x porque la 30.x exige Node ≥ 24.15.

## Scripts

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm test
npm run build
```

Para ver los estados vacíos (docente sin cursos, sin invitaciones, sin ejercicios) agrega `?vacio` a la URL. Los cursos que crees durante esa sesión siguen disponibles.

Material curricular: permite cargar PDF, PNG o JPG de hasta 20 MB por subtema. Las cargas quedan en ingestión en el mock; al reemplazar, se sincronizan el contador del curso y el estado de material de los subtemas. [Criterios y verificación del refactor](docs/curricular-material-refactor.md).

La raíz abre `/iniciar-sesion`. La autenticación sigue siendo un placeholder hasta integrar `feature/auth`; esta rama no define credenciales de inicio de sesión.

## Material curricular

- Ruta: `/cursos/:courseId/material`. Se llega desde el sidebar, Subtemas, Ejercicios generados e Indicadores.
- PDF, PNG y JPG, con contenido y hasta 20 MB. La validación se comparte entre el hook y el servicio simulado.
- Una carga reemplaza el material del subtema y queda en ingestión. Los contadores del curso, Subtemas y el diálogo de generación leen la misma fuente; solo `ready` habilita la generación.
- Los cursos creados en la sesión también funcionan con `?vacio`; los cursos de ejemplo permanecen ocultos en ese escenario.
- El mock conserva metadatos, no archivos. Las páginas solo se muestran cuando la fuente las proporciona; una carga nueva no inventa ese dato ni simula que la ingestión terminó.
- `/` abre inicio de sesión; las rutas desconocidas conservan el retorno a Mis cursos. Auth y seguimiento conservan sus placeholders hasta integrar sus ramas.

La auditoría exige cero errores. Se mantienen dos observaciones heredadas de `feature/ui-integration`: `ARCH-05` (los siete README por capa, omitidos según la política registrada en `MEMORY.md`) y `TEST-02` (cinco hooks de páginas/shell sin tests propios). La cobertura nueva incluye servicios, utilidades, hooks, selección de archivos y los flujos de página y navegación; esas observaciones quedan como seguimiento de la integración, sin ampliar este refactor.


## Acceso de demostración

La aplicación abre `/iniciar-sesion`; las rutas del panel requieren una sesión mock.

- Correo: `docente@kalibra.com`.
- Contraseña: `Kalibra123`.

Estas credenciales son públicas y ficticias. El inicio de sesión abre Mis cursos con datos de ejemplo.
El registro usa nombre completo, correo y una contraseña de al menos ocho caracteres con letras y números;
al finalizar abre Mis cursos vacío. Cada cuenta mantiene sus propios cursos, subtemas, invitaciones,
ejercicios e indicadores durante la sesión del navegador. Cerrar sesión pide confirmación y conserva esos
datos en memoria para el siguiente acceso. Recargar la página reinicia las cuentas, los datos y la sesión;
no se guardan contraseñas ni tokens en almacenamiento del navegador.

`?vacio` sigue forzando los listados vacíos y se conserva al pasar del formulario al panel.
Las nuevas integraciones mock deben usar `sessionCollection` de `src/mocks/session.ts` para proyectar las
colecciones de la cuenta activa, junto con `isEmptyScenario` para el escenario explícito.

El error de correo duplicado conserva el aviso de Figma e incorpora **Usar otro correo**, la recuperación
adicional requerida por el wireflow. La validación y los resultados de sesión viven en hooks; el shell
solo compone los componentes.

## Arquitectura por capas

```
src/
├── components/ui       primitivos del sistema de diseño (Button, Modal, Select, Chip…)
├── components/layout   AppShell, Sidebar, selector de curso activo
├── components/<feature> componentes de cada funcionalidad
├── pages               una página por ruta
├── hooks               estado de cada vista; único puente hacia services
├── services            contratos y servicios (hoy apuntan a mocks)
├── mocks               datos de ejemplo y servicios simulados
├── context             curso activo y toasts
├── navigation          rutas y layout de rutas
├── types               modelos de dominio y variantes de UI
└── utils               funciones puras
```

- Tokens del sistema de diseño (Figma `kalibra_design_system`) en `src/index.css` (`@theme`). Mismo contenido que `src/theme/tokens.ts` de la app móvil.
- Diseño **mobile-first**: clases base para 375 px; `md:`/`lg:` amplían. El menú lateral es un drawer bajo `lg`.
- Los cursos y subtemas son datos: ninguna pantalla depende de un curso concreto.

## Ramas

Toda rama nace de `develop`.

| Rama | Responsable |
| --- | --- |
| `feature/auth` | compañero |
| `feature/course-management` | Gonzalo |
| `feature/curricular-material` | compañero |
| `feature/exercise-management` | Gonzalo |
| `feature/student-monitoring` | compañero |
| `feature/invitations-indicators` | Gonzalo |

Las rutas de otras ramas muestran `PlaceholderPage` hasta que se integran.
