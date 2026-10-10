/**
 * Reads exercise catalogs and requests real generated exercise batches.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ExercisesContract } from '@/services/exercises.contract'
import { apiClient } from '@/services/http/apiClient'
import { readAllPages } from '@/services/http/pagination'
import { mapCatalog } from '@/services/mappers/exercises.mapper'
import type { CatalogDto, CourseDto, ExerciseDto } from '@/types/api'
/** Reads generated questions and requests verified batches from the engine. */
export const exercisesService: ExercisesContract = {
  async listCatalogs(signal) {
    const catalogs = await apiClient.get<CatalogDto[]>('/course-exercise-catalogs', { signal })
    return Promise.all(catalogs.map(async (catalog) => mapCatalog(catalog, await readAllPages<ExerciseDto>(`/courses/${catalog.courseId}/generated-exercises`, signal))))
  },
  async generate(courseId, subtopicId) {
    const course = await apiClient.get<CourseDto>(`/courses/${courseId}`)
    const exercises = await apiClient.post<ExerciseDto[]>(`/courses/${courseId}/generated-exercises`, { subtopicId, quantity: 10 })
    return { subtopicName: course.subtopics.find((item) => item.id === subtopicId)?.name ?? '', generatedCount: exercises.length,
      approvedCount: exercises.filter((item) => item.verdict === 'APPROVED').length, discardedCount: exercises.filter((item) => item.verdict === 'DISCARDED').length }
  },
}
