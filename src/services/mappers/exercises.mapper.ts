/**
 * Maps exercise verdicts and combines catalog counts with paginated questions.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CatalogDto, ExerciseDto } from '@/types/api'
import type { CourseExerciseCatalog, GeneratedExercise } from '@/types/exercise'
/** Uses only the verdict and reason actually supplied by verification. */
export function mapExercise(dto: ExerciseDto): GeneratedExercise {
  const difficulty = { EASY: 'Fácil', MEDIUM: 'Media', HARD: 'Difícil' }[dto.difficulty]
  return { id: dto.id, subtopicId: dto.subtopicId, statement: dto.statement, code: '', summary: `Opción múltiple · Dificultad ${difficulty.toLowerCase()}`,
    difficulty, generatedAt: new Date(dto.generatedAt).toLocaleString('es-PE'), sourceMaterial: '',
    status: dto.verdict === 'APPROVED' ? 'approved' : 'discarded',
    options: dto.options.map((option) => ({ letter: option.key, text: option.text, isCorrect: option.correct })),
    checks: [{ label: 'Verificación automática', passed: dto.verdict === 'APPROVED', detail: dto.rejectionReason ?? (dto.verdict === 'APPROVED' ? 'Aprobado por la verificación automática.' : 'El servicio no proporcionó el motivo del descarte.') }], explanation: dto.explanation }
}
/** Combines authoritative counters with the complete exercise list. */
export function mapCatalog(dto: CatalogDto, exercises: ExerciseDto[]): CourseExerciseCatalog {
  return { courseId: dto.courseId, generatedCount: dto.subtopics.reduce((sum, subtopic) => sum + subtopic.generated, 0),
    subtopics: dto.subtopics.filter((subtopic) => subtopic.generated > 0).map((subtopic) => ({ subtopicId: subtopic.subtopicId, subtopicName: subtopic.subtopicName,
      generatedCount: subtopic.generated, approvedCount: subtopic.approved, discardedCount: subtopic.discarded,
      exercises: exercises.filter((exercise) => exercise.subtopicId === subtopic.subtopicId).map(mapExercise) })) }
}
