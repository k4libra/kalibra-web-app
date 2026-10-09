
/**
 * Simulated curricular material data and operations.
 *
 * @remarks
 * Reuses the course and subtopic identifiers from develop.
 * All changes are kept in memory for frontend testing.
 * No files are uploaded to a real server.
 *
 * @packageDocumentation
 */

import type {
    CurricularMaterial,
    CurricularMaterialStats,
    MaterialFileType,
    UploadCurricularMaterialRequest,
} from '@/types/curricularMaterial'

import { COURSES, SUBTOPICS } from './courses.mock'

/**
 * Initial materials displayed in the Figma examples.
 */
export const INITIAL_CURRICULAR_MATERIALS: CurricularMaterial[] = [
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
        fileSize: 5.8 * 1024 * 1024,
        uploadedAt: '2025-09-10',
        status: 'error',
        errorMessage:
            'La imagen tiene baja resolución y el texto de los problemas es ilegible. ' +
            'Por ello no se pudo extraer su contenido.',
    },
]

/**
 * In-memory material collection.
 *
 * @remarks
 * Refreshing the browser restores the initial examples.
 */
let materials: CurricularMaterial[] = INITIAL_CURRICULAR_MATERIALS.map(
    (material) => ({ ...material }),
)

/**
 * Simulates a short asynchronous API response.
 */
function respond<T>(data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), 250)
    })
}

/**
 * Returns materials belonging to an existing course.
 */
export function listCurricularMaterials(
    courseId: string,
): Promise<CurricularMaterial[]> {
    const courseExists = COURSES.some((course) => course.id === courseId)

    if (!courseExists) {
        return Promise.reject(new Error('El curso no existe.'))
    }

    const result = materials
        .filter((material) => material.courseId === courseId)
        .map((material) => ({ ...material }))

    return respond(result)
}

/**
 * Returns material counters for a course.
 */
export function getCurricularMaterialStats(
    courseId: string,
): Promise<CurricularMaterialStats> {
    const courseMaterials = materials.filter(
        (material) => material.courseId === courseId,
    )

    return respond({
        total: courseMaterials.length,
        ready: courseMaterials.filter(
            (material) => material.status === 'ready',
        ).length,
        processing: courseMaterials.filter(
            (material) => material.status === 'processing',
        ).length,
        error: courseMaterials.filter(
            (material) => material.status === 'error',
        ).length,
    })
}

/**
 * Simulates uploading or replacing a curricular material.
 *
 * @remarks
 * The selected file is not stored or sent anywhere.
 * Its metadata is used to create a processing record.
 */
export async function uploadCurricularMaterial(
    request: UploadCurricularMaterialRequest,
): Promise<CurricularMaterial> {
    const { courseId, subtopicId, file } = request

    const subtopicExists = SUBTOPICS.some(
        (subtopic) =>
            subtopic.id === subtopicId &&
            subtopic.courseId === courseId,
    )

    if (!subtopicExists) {
        throw new Error('El subtema seleccionado no pertenece al curso.')
    }

    const extension = file.name.split('.').pop()?.toLowerCase()

    if (
        extension !== 'pdf' &&
        extension !== 'png' &&
        extension !== 'jpg'
    ) {
        throw new Error('Formato no soportado. Usa PDF, PNG o JPG.')
    }

    if (file.size === 0) {
        throw new Error('El archivo está vacío.')
    }

    if (file.size > 20 * 1024 * 1024) {
        throw new Error('El archivo supera el límite de 20 MB.')
    }

    const previousMaterial = materials.find(
        (material) =>
            material.courseId === courseId &&
            material.subtopicId === subtopicId,
    )

    const uploadedMaterial: CurricularMaterial = {
        id: previousMaterial?.id ?? `material-${Date.now()}`,
        courseId,
        subtopicId,
        fileName: file.name,
        fileType: extension as MaterialFileType,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
    }

    materials = [
        ...materials.filter(
            (material) =>
                !(
                    material.courseId === courseId &&
                    material.subtopicId === subtopicId
                ),
        ),
        uploadedMaterial,
    ]

    return respond({ ...uploadedMaterial })
}

/**
 * Restores the initial Figma sample data.
 *
 * @remarks
 * Useful for local development and future tests.
 */
export function resetCurricularMaterialsMock(): void {
    materials = INITIAL_CURRICULAR_MATERIALS.map(
        (material) => ({ ...material }),
    )
}
