# Material curricular: verificación del refactor

Se integra `feature/ui-integration` conservando sus pantallas de cursos, subtemas, ejercicios, invitaciones e indicadores. Solo se sustituye el placeholder de material. La raíz abre `/iniciar-sesion`; una ruta desconocida conserva el fallback a `/cursos`. Autenticación y seguimiento siguen perteneciendo a sus respectivas ramas.

## Criterios cubiertos

- Página → hooks → contratos/servicios → mocks. Los componentes reciben datos y callbacks por props; la página no importa servicios ni fixtures.
- `useResource` carga el curso, sus subtemas y material. Se ocultan datos de otro curso y se descartan lecturas/cargas que terminan tras cambiar de curso o desmontar.
- `courseMaterialsStore.mock.ts` es la fuente de metadata. Los servicios de cursos derivan el contador y `MaterialStatus` de ese almacén; reemplazar conserva una fila por subtema.
- Los archivos nuevos y las modificaciones llevan TSDoc. Los archivos originales de material conservan `MRamirez202210582`; los nuevos usan la identidad de Git.
- `FileDropzone` encapsula el input nativo, selección repetida, drag/drop y quitar archivo. Formato, tamaño y archivo vacío se validan con el mismo helper en el hook y el mock.
- Flujo poblado: dropdown con los cuatro subtemas y sus descripciones/estados, formato inválido sin registro y con envío bloqueado, recuperación, reemplazo y aviso persistente de extracción con toast.
- Flujo vacío: sin estadísticas de cero; primer subtema seleccionado, quitar archivo conserva el subtema, primera carga muestra una fila y contadores 1/0/0.
- Se prueban los accesos desde sidebar, Subtemas, Ejercicios generados e Indicadores, y el retorno a Cursos/Subtemas/generación después de subir material.
- No se agregan dependencias, colores, integración HTTP ni procesamiento de documentos.

## Decisiones de presentación

- La tabla usa `Pendiente` y el reloj de arena de Figma; los demás usos de `MaterialStatusChip` conservan `En ingestión`. Ambos representan el mismo estado `processing`.
- La recuperación inválida usa `Seleccionar otro archivo`, como exige el wireflow, frente a la etiqueta más corta del PNG 05.3.
- La selección válida conserva el picker en el curso poblado (05.2/05.6); la primera carga usa la presentación compacta y `Archivo listo para subir` (05.9).
- Solo los fixtures tienen conteos de páginas verificados. Los archivos nativos nuevos muestran extensión y tamaño reales; las páginas permanecen ausentes hasta que un procesador las entregue. No se deducen páginas del tamaño o del nombre.
- `?vacio` oculta cursos de referencia, manteniendo disponibles los cursos creados durante la sesión y sus subtemas/material.
- La tabla se apila en anchos pequeños y medianos; desde `lg` utiliza columnas.

## Evidencia automática

Los comandos requeridos pasan con salida 0: `npm run lint`, `npx tsc -b`, `npm test`, `npm run build` y la auditoría `audit_frontend.py .`. La suite incluye pruebas nuevas de servicios, validadores, ambos hooks, selector de archivos, estado de material, página y rutas integradas, además de todos los tests heredados.

La auditoría reporta cero errores. Se mantienen las dos categorías de advertencias heredadas: ARCH-05 (siete README de capas, según la política registrada en MEMORY.md) y TEST-02 (cinco hooks de otras funcionalidades sin test propio: `useCourseIndicatorsPage`, `useCoursesPage`, `useGeneratedExercisesPage`, `useInvitationsPage`, `useShellNavigation`). La navegación integrada los ejercita indirectamente; no se presentan como pruebas unitarias completas ni se desactiva el scanner.

## Verificación pendiente

Se abrieron y revisaron los 11 PNG 05–05.10 a 1280×832. No se pudo comparar el render de la app en navegador ni comprobar visualmente 360/768/1280: el navegador integrado no está disponible y la aprobación automática rechazó Brave. Las pruebas DOM comprueban transiciones y teclado (selector/Escape), pero no prueban dimensiones, desbordamientos, carga de fuentes ni paridad de píxeles. Esa comprobación manual sigue siendo un criterio de aceptación pendiente.
