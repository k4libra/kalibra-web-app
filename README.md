# Kalibra Web App

Panel web del docente de Kalibra: gestiona cursos y subtemas, ejercicios generados, invitaciones, indicadores y seguimiento de estudiantes.

> Estado actual: **solo interfaz y navegación**. No hay integración con la API; los datos salen de servicios simulados (`src/mocks`).

## Stack

| Paquete | Versión |
| --- | --- |
| React / React DOM | 19.2 |
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

## Seguimiento de estudiantes

- `/estudiantes`: matrículas agrupadas por curso, incluyendo cursos sin estudiantes.
- `/estudiantes/st-1`, `/estudiantes/st-2`, `/estudiantes/st-3`: progreso con actividad o invitación aceptada sin actividad. Los enlaces anteriores `student-1/2/3` siguen funcionando.
- `/cursos/:courseId/mapa-de-brechas`: prioridades y heatmap; cada nombre o celda abre el progreso individual.
- `/estudiantes?vacio`: docente sin cursos; la acción de crear un curso conserva el escenario vacío al llegar a `/cursos`.
- `/cursos/course-2/mapa-de-brechas`: datos insuficientes en un curso existente.

Las identidades y matrículas provienen de `src/mocks/students.fixture.ts`, compartido por seguimiento, indicadores e invitaciones. Las recomendaciones usan subtemas seleccionados y respuestas recientes explícitas del mock; no se deducen respuestas incorrectas de un porcentaje de dominio. Las fechas relativas usan la fecha de la respuesta simulada, no el reloj del equipo.

El dominio sigue `masteryTone`: bajo <40%, medio desde 40% hasta antes de 70%, alto desde 70%; `null` significa sin datos. La leyenda usa ese criterio, resolviendo la discrepancia del frame de Figma en 70%.

La ruta raíz abre `/iniciar-sesion`. Auth y material curricular conservan sus placeholders hasta integrar sus respectivas ramas; esta rama no implementa credenciales de acceso.

La auditoría exige 0 errores. Sus advertencias pendientes tienen estas disposiciones:

- `ARCH-05`: los siete README por capa faltan por la política existente de mantener README solo en carpetas vacías; no se agregan como parte de este refactor.
- `TEST-02`: cinco hooks de páginas/shell heredados siguen pendientes; el contrato de seguimiento solo declara tipos y no necesita un test de ejecución. El servicio, los tres hooks de seguimiento, las composiciones y los nuevos primitivos sí tienen pruebas.

Se inspeccionaron los siete PNG de referencia de seguimiento. La comparación visual de la app a 1280×832 y 360/768 px queda pendiente: el entorno no tiene navegador conectado y rechazó el acceso a Chrome. Las pruebas DOM cubren flujos y teclado del heatmap, sin certificar la fidelidad de píxeles ni el layout responsive.
