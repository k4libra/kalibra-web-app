# Integración HTTP de la aplicación web

Implementada en `feature/api-integration`, contra el contrato v2 y los controladores REST de `kalibra-api`. No se modificaron la API ni el motor adaptativo.

Todas las rutas de esta tabla llevan el prefijo `/api/v1`. Las lecturas son `GET`, salvo cuando se indica otro método. `:id` es el curso seleccionado y `:invitationId`, una invitación devuelta por la API.

| Pantalla / flujo | Endpoints consumidos |
| --- | --- |
| Arranque y sesión | `/users/me`; `POST /authentication/sign-in`, `POST /authentication/sign-up`, `POST /authentication/sign-out` |
| Shell docente / curso activo | `/courses`, `/course-rosters`, `/course-exercise-catalogs`, `/course-invitation-groups`, `/courses/:id/curricular-materials`, `/courses/:id/mastery-gap-map`; `/teachers/me/workspace`, `PUT /teachers/me/workspace/active-course`; identidad de la sesión restaurada |
| Mis cursos / creación | Los mismos recursos de proyección del shell; `POST /courses` con `name`, `code` y `subtopicNames` |
| Subtemas | `/courses/:id`, `/courses/:id/curricular-materials`, `/course-exercise-catalogs`, `/courses/:id/mastery-gap-map`; recursos de proyección para los contadores del curso |
| Material curricular | Lecturas de curso y subtemas; `/courses/:id/curricular-materials` paginado; `POST` al mismo endpoint como multipart con archivo, `subtopicIds`, `fileName` y `format` |
| Ejercicios generados | Cursos y subtemas; `/course-exercise-catalogs`; `/courses/:id/generated-exercises` paginado; `POST` al mismo endpoint con `subtopicId` y `quantity: 10` |
| Invitaciones | Cursos; `/course-invitation-groups`; `POST /invitations` con `courseId` y `studentEmail`; `POST /invitations/:invitationId/cancellations`; `POST /invitations/:invitationId/renewals` |
| Indicadores del curso | Curso; `/courses/:id/indicators`; `/course-exercise-catalogs`; `/courses/:id/indicators/guide`; indicadores con `Accept: text/csv` para exportar |
| Estudiantes | Cursos; `/course-rosters`; `/courses/:id/indicators`; `/courses/:id/mastery-gap-map`; `/courses/:id/student-progress?studentId=…` por estudiante para la última actividad |
| Mapa de brechas | Curso y subtemas; `/courses/:id/mastery-gap-map`; `/course-rosters`; `/courses/:id/indicators`; `/courses/:id/student-progress?studentId=…` para las filas individuales |
| Progreso individual | `/course-rosters`; `/courses/:id/student-progress?studentId=…`; indicadores y mapa del curso; curso y subtemas |
| Panel institucional | `/institutional-indicators`; el mismo endpoint con `Accept: text/csv` para exportar |
| Subtemas críticos | `/institutional-indicators/critical-subtopics` |

Las páginas administrativas no solicitan endpoints de docente. Los guards redirigen a cada rol hacia su propio shell. Los enlaces de progreso incluyen el curso de la matrícula mediante `?curso=…`, para distinguir estudiantes inscritos en varios cursos. Un enlace antiguo sin contexto se resuelve si existe una única matrícula; ante varias, solicita seleccionar desde la lista.

## Adaptación de datos

- Contadores de cursos: matrículas desde rosters; el total de estudiantes en Mis cursos cuenta IDs únicos entre todos los cursos; ejercicios desde catálogos; invitaciones pendientes desde grupos; materiales desde todas las páginas; dominio desde las mediciones del mapa.
- Los listados paginados recorren todas las páginas, sin limitar artificialmente filas o contadores a los primeros veinte registros.
- La UI conserva los totales y la evolución que entrega la API. Los mappers mantienen `null` para porcentajes sin datos y usan el umbral compartido: bajo <40, medio 40–<70, alto ≥70.
- Los agregados institucionales normalizan precisión y evolución a `null` cuando `hasActivity` o `totalSolved` confirman ausencia de práctica. Verificación conserva el valor recibido: este endpoint no entrega el denominador para distinguir un 0 % de ausencia de generación.
- La guía se solicita a la API y localiza sus tipos de indicador con la copia existente en español, sin depender del orden de las entradas. Actualmente el backend entrega esa guía en inglés.
- Ciclo, facultad, semestre y descripciones sin fuente quedan vacíos. La creación no solicita un ciclo que la API no guarda. El icono genérico es `school`.
- El material conserva todas las asociaciones de subtemas. No se infieren tamaño, páginas o condición de escaneo. El estado del subtema deriva del material más reciente asociado.
- Los ejercicios muestran opciones, explicación, dificultad, veredicto y motivo real. No se fabrican fragmentos de código, documentos de origen ni checks individuales de verificación.
- El progreso conserva `recentFeedback` y `lastActivityAt`: la última actividad se muestra en la lista y el detalle, o como «Sin actividad» cuando es `null`. La API no entrega recomendaciones, últimas respuestas clasificadas ni aciertos por subtema; esos datos permanecen vacíos o no disponibles. No se deducen a partir del dominio.
- Los errores ProblemDetail se conservan para diagnóstico, con mensajes de UI en español. Un 422 al invitar representa la cuenta de estudiante inexistente; 404 y 409 mantienen su error diferenciado.
- CSV se descarga como blob desde la API, sin construir datos ni anonimizar localmente. Los nombres de descarga usan el identificador del curso o un nombre institucional neutral.

## Dependencias del backend y alcance de verificación

La API local disponible al cerrar la integración implementa `/users/me`, los endpoints institucionales, nombres de perfiles y proyecciones, validación de `application` y recepción del archivo multipart. No fue necesario modificar sus fuentes desde este repositorio. Los nombres siguen siendo opcionales en los DTO: ante su ausencia se muestra el correo real.

El backend y la UI limitan las cargas a 10 MB. Una respuesta HTTP 413 muestra un error en español que indica el límite. Motor y almacenamiento pueden responder 503 hasta configurar sus proveedores.

La validación automatizada cubre cliente HTTP, paginación y cancelación, mappers puros, servicios, hooks, formularios, rutas, restauración, aislamiento por rol, panel administrativo, ranking y CSV mediante respuestas HTTP simuladas exclusivamente en tests.

Resultado de cierre: `npm run lint`, `npx tsc -b`, `npx vitest run` (256 tests) y `npm run build` sin errores.

Además, se ejecutaron los adaptadores reales del frontend contra `http://localhost:8080/api/v1`, con cookies conservadas solo en memoria: docente con dos cursos, catálogos, invitaciones, matrículas y workspace; materiales, indicadores, guía, mapa de brechas y progreso individual de ambos cursos; administrador con panel institucional, ranking y CSV. La API rechazó el sign-in web de estudiante con 403 y el acceso del administrador a cursos docentes con 403. Los cierres de sesión respondieron 204. La semilla usada no tenía material ni actividad de práctica; no se validaron datos de generación o ingestión reales ni escrituras funcionales contra proveedores externos.

La auditoría del frontend no detectó errores. Sus advertencias incluyen la política explícita de omitir README en capas ocupadas y cobertura directa pendiente de algunos hooks. No se pudo revisar visualmente en navegador: el navegador integrado no estaba disponible y la revisión automática de permisos rechazó Computer Use para Brave.

Los cambios quedaron sin commits: `git add` fue rechazado al intentar crear `.git/index.lock`, porque el sandbox concede lectura de `.git` pero no escritura. No se realizó push ni se cambiaron ramas protegidas.
