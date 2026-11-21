/**
 * Domain types of the indicators of a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Describes the answers of one student.
 */
export interface StudentAccuracy {
  /** Student identifier. */
  studentId: string
  /** Full name of the student. */
  fullName: string
  /** Initials for the avatar. */
  initials: string
  /** Answers submitted. */
  answeredCount: number
  /** Correct answers among the submitted ones. */
  correctCount: number
}

/**
 * Describes the practice and mastery of the group in one subtopic.
 */
export interface SubtopicIndicator {
  /** Subtopic identifier. */
  subtopicId: string
  /** Name of the subtopic. */
  subtopicName: string
  /** Exercises solved by the group. */
  solvedCount: number
  /** Group mastery when practice started, from 0 to 100; `null` without practice. */
  initialMastery: number | null
  /** Current group mastery, from 0 to 100; `null` without practice. */
  currentMastery: number | null
  /** Integer percentage-point change supplied by the API. */
  deltaPoints?: number | null
  /** Generated exercises; `0` when none were generated. */
  generatedCount: number
  /** Generated exercises that passed verification. */
  approvedCount: number
}

/** Describes authoritative course-level indicator summaries. */
export interface IndicatorSummary {
  /** Correct-answer percentage, or null without activity. */
  groupAccuracy: number | null
  /** Initial mastery percentage, or null without activity. */
  groupInitial: number | null
  /** Current mastery percentage, or null without activity. */
  groupCurrent: number | null
  /** Change in integer percentage points, or null without activity. */
  groupDeltaPoints: number | null
  /** Total answered exercises. */
  totalSolved: number
  /** Mean practice count of active students. */
  averagePerActiveStudent: number
  /** Students with practice. */
  activeStudents: number
  /** Verification approval percentage, or null without generation. */
  approvalRate: number | null
  /** Approved exercises. */
  approved: number
  /** Discarded exercises. */
  discarded: number
}

/**
 * Describes the indicators that Kalibra calculates for a course.
 */
export interface CourseIndicators {
  /** Authoritative API summary, when supplied. */
  summary?: IndicatorSummary
  /** Course the indicators belong to. */
  courseId: string
  /** Students enrolled in the course. */
  enrolledCount: number
  /** Answers of each enrolled student. */
  students: StudentAccuracy[]
  /** Indicators of each subtopic, in course order. */
  subtopics: SubtopicIndicator[]
}

/**
 * Describes the file produced by an export.
 */
export interface IndicatorsExport {
  /** Name of the downloaded file. */
  fileName: string
}
