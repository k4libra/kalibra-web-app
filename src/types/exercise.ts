/**
 * Domain types of the exercises generated for the courses of the teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Result of the automatic verification of a generated exercise.
 *
 * @remarks
 * - `approved`: passed every check and is shown to students.
 * - `discarded`: failed a check, was never shown and was replaced.
 */
export type VerificationStatus = 'approved' | 'discarded'

/**
 * Describes one answer option of a multiple-choice exercise.
 */
export interface ExerciseOption {
  /** Letter shown before the option, for example `A`. */
  letter: string
  /** Text of the option. */
  text: string
  /** Whether it is the correct answer. */
  isCorrect: boolean
}

/**
 * Describes one check of the verification.
 */
export interface VerificationCheck {
  /** Name of the check, for example `Corrección técnica`. */
  label: string
  /** Whether the exercise passed it. */
  passed: boolean
  /** Explanation of the outcome. */
  detail: string
}

/**
 * Describes a generated exercise with its verification result.
 */
export interface GeneratedExercise {
  /** Unique identifier assigned by the server. */
  id: string
  /** Subtopic the exercise belongs to. */
  subtopicId: string
  /** Question asked to the student. */
  statement: string
  /** Code snippet that accompanies the question; empty when there is none. */
  code: string
  /** Format and difficulty summary, for example `Opción múltiple · Dificultad media`. */
  summary: string
  /** Difficulty label shown as a chip. */
  difficulty: string
  /** Human-readable generation time, for example `Hoy, 10:12`. */
  generatedAt: string
  /** Name of the curricular material the exercise is anchored to. */
  sourceMaterial: string
  /** Verification result. */
  status: VerificationStatus
  /** Answer options in display order. */
  options: ExerciseOption[]
  /** Outcome of each verification check. */
  checks: VerificationCheck[]
}

/**
 * Describes the generated exercises of one subtopic with its counters.
 */
export interface SubtopicExerciseGroup {
  /** Subtopic of the group. */
  subtopicId: string
  /** Name of the subtopic. */
  subtopicName: string
  /** Total exercises generated. */
  generatedCount: number
  /** Exercises that passed verification. */
  approvedCount: number
  /** Exercises discarded by verification. */
  discardedCount: number
  /** Most recent exercises of the subtopic. */
  exercises: GeneratedExercise[]
}

/**
 * Describes the generated exercises of one course, grouped by subtopic.
 */
export interface CourseExerciseCatalog {
  /** Course of the catalog. */
  courseId: string
  /** Total exercises generated for the course. */
  generatedCount: number
  /** Groups of the subtopics that have exercises. */
  subtopics: SubtopicExerciseGroup[]
}

/**
 * Describes the outcome of a generation request.
 */
export interface GenerationResult {
  /** Name of the subtopic the exercises were generated for. */
  subtopicName: string
  /** Exercises generated. */
  generatedCount: number
  /** Exercises that passed verification. */
  approvedCount: number
  /** Exercises discarded by verification. */
  discardedCount: number
}
