/**
 * Owns material metadata shared by course and material mock projections.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CurricularMaterial } from '@/types/curricularMaterial'

// Reference fixtures preserve metadata provided by the design, never inferred from size.
const INITIAL_CURRICULAR_MATERIALS: CurricularMaterial[] = [
    {
        id: 'material-1',
        courseId: 'course-1',
        subtopicId: 'sub-1',
        fileName: 'recursividad.pdf',
        fileType: 'pdf',
        fileSize: 2.4 * 1024 * 1024,
        pageCount: 18,
        uploadedAt: '2025-09-02',
        status: 'ready',
    },
    {
        id: 'material-2',
        courseId: 'course-1',
        subtopicId: 'sub-2',
        fileName: 'arboles_avl.pdf',
        fileType: 'pdf',
        fileSize: 3.1 * 1024 * 1024,
        pageCount: 24,
        uploadedAt: '2025-09-04',
        status: 'ready',
    },
    {
        id: 'material-3',
        courseId: 'course-1',
        subtopicId: 'sub-3',
        fileName: 'prog_dinamica.jpg',
        fileType: 'jpg',
        isScan: true,
        fileSize: 5.8 * 1024 * 1024,
        uploadedAt: '2025-09-10',
        status: 'error',
        errorMessage:
            'La imagen tiene baja resolución y el texto de la pizarra no es legible, ' +
            'por lo que no se pudo extraer su contenido.',
    },
]


let materials = structuredClone(INITIAL_CURRICULAR_MATERIALS)

/**
 * Reads an isolated snapshot of a course's material metadata.
 *
 * @param courseId - Course whose material projection is requested.
 * @returns Cloned material records in table order.
 */
export function readCourseMaterials(courseId: string): CurricularMaterial[] {
  return structuredClone(materials.filter((material) => material.courseId === courseId))
}

/**
 * Replaces the single record of a subtopic or appends its first upload.
 *
 * @param material - Validated metadata returned by the mock upload endpoint.
 * @returns Nothing; subsequent course and material reads share the updated store.
 */
export function saveCourseMaterial(material: CurricularMaterial): void {
  const index = materials.findIndex((item) => item.courseId === material.courseId && item.subtopicId === material.subtopicId)
  if (index < 0) materials.push(structuredClone(material))
  else materials[index] = structuredClone(material)
}

/**
 * Restores only the reference material fixtures between isolated tests.
 */
export function resetCourseMaterials(): void {
  materials = structuredClone(INITIAL_CURRICULAR_MATERIALS)
}
