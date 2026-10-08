# Kalibra Web App

Panel web del docente de Kalibra: gestiona cursos y subtemas, ejercicios generados, invitaciones e indicadores.

> Estado actual: **solo interfaz y navegación**. No hay integración con la API; los datos salen de servicios simulados (`src/mocks`).

## Stack

| Paquete | Versión |
| --- | --- |
| React / React DOM | 19.3 |
| Vite | 7.3 |
| TypeScript | 5.9 |
| Tailwind CSS (`@tailwindcss/vite`) | 4.3.3 |
| React Router | 8.4.0 |
| Vitest + Testing Library + jsdom | 5.0.3 / 16.3.3 / 29.1.1 |

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

Para ver los estados vacíos (docente sin cursos, sin invitaciones, sin ejercicios) agrega `?vacio` a la URL.

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
