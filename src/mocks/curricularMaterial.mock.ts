/**
 * Implements material endpoints over the shared course material store.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { CurricularMaterialServiceContract } from '@/services/curricularMaterial.contract'
import type { CurricularMaterial, CurricularMaterialStats, UploadCurricularMaterialRequest } from '@/types/curricularMaterial'
import { materialFileType, validateMaterialFile } from '@/utils/materialFile'
import { hasMockCourse, SUBTOPICS } from '@/mocks/courses.mock'
import { readCourseMaterials, resetCourseMaterials, saveCourseMaterial } from '@/mocks/courseMaterialsStore.mock'
import { isEmptyScenario, respond } from '@/mocks/scenario'

function assertCourse(courseId: string): void {
  if (!hasMockCourse(courseId)) throw new Error('El curso no existe.')
}

/**
 * Lists metadata for an existing course and honors the teacher-without-courses scenario.
 *
 * @param courseId - Course whose materials are requested.
 * @returns Cloned metadata, or an empty list for the empty scenario.
 * @throws Error when the course is unknown in the populated scenario.
 */
export async function listCurricularMaterials(courseId: string): Promise<CurricularMaterial[]> {
  if (isEmptyScenario() && !hasMockCourse(courseId)) return respond([])
  assertCourse(courseId)
  return respond(readCourseMaterials(courseId))
}

/**
 * Computes material counters from the same store used by course projections.
 *
 * @param courseId - Course whose counters are requested.
 * @returns Total, ready, processing and error counts.
 * @throws Error when the course is unknown in the populated scenario.
 */
export async function getCurricularMaterialStats(courseId: string): Promise<CurricularMaterialStats> {
  const materials = await listCurricularMaterials(courseId)
  return {
    total: materials.length,
    ready: materials.filter((item) => item.status === 'ready').length,
    processing: materials.filter((item) => item.status === 'processing').length,
    error: materials.filter((item) => item.status === 'error').length,
  }
}

/**
 * Validates an upload and replaces the single material of its subtopic.
 *
 * @param request - Course, subtopic and native file selected by the teacher.
 * @returns Metadata in the shared `processing` state; unknown page counts remain absent.
 * @throws Error when the course, subtopic, format or file size is invalid.
 */
export async function uploadCurricularMaterial(request: UploadCurricularMaterialRequest): Promise<CurricularMaterial> {
  const { courseId, subtopicId, file } = request
  assertCourse(courseId)
  if (!SUBTOPICS.some((item) => item.id === subtopicId && item.courseId === courseId)) {
    throw new Error('El subtema seleccionado no pertenece al curso.')
  }
  const validation = validateMaterialFile(file)
  if (validation) throw new Error(validation.message)
  const fileType = materialFileType(file.name)
  if (!fileType) throw new Error('Formato no soportado.')
  const previous = readCourseMaterials(courseId).find((item) => item.subtopicId === subtopicId)
  const material: CurricularMaterial = {
    id: previous?.id ?? `material-${courseId}-${subtopicId}`,
    courseId, subtopicId, fileName: file.name, fileType, fileSize: file.size,
    uploadedAt: new Date().toISOString(), status: 'processing',
  }
  saveCourseMaterial(material)
  return respond(material)
}

/**
 * Implements the same contract that the future HTTP material service will implement.
 */
export const curricularMaterialMock: CurricularMaterialServiceContract = {
  getByCourse: listCurricularMaterials,
  getStats: getCurricularMaterialStats,
  upload: uploadCurricularMaterial,
}

/**
 * Restores the initial shared material metadata for deterministic feature tests.
 */
export function resetCurricularMaterialsMock(): void {
  resetCourseMaterials()
}
