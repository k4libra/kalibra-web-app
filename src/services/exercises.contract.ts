/**
 * Contract of the generated exercises endpoints, implemented by the HTTP service.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseExerciseCatalog, GenerationResult } from '@/types/exercise'

/**
 * Operations the frontend needs to audit and request generated exercises.
 */
export interface ExercisesContract {
  /** Lists the generated exercises of every course of the teacher, grouped by course and subtopic. */
  listCatalogs: (signal?: AbortSignal) => Promise<CourseExerciseCatalog[]>
  /** Generates and verifies a batch of exercises for a subtopic with ready material. */
  generate: (courseId: string, subtopicId: string) => Promise<GenerationResult>
}
