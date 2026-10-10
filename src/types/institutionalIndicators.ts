/**
 * Defines administrator-only institutional analytics models.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/** Institution-wide counts and percentages, with null for missing measurements. */
export interface InstitutionalTotals {
  /** Courses in the institution. */
  courses: number
  /** Teachers in the institution. */
  teachers: number
  /** Distinct enrolled students in the institution. */
  enrolledStudents: number
  /** Distinct students with solved exercises. */
  activeStudents: number
  /** Total solved exercises. */
  totalSolved: number
  /** Correct answers as a percentage, or null without practice. */
  groupAccuracy: number | null
  /** Mastery change in percentage points, or null without practice. */
  groupDeltaPoints: number | null
  /** Verification approval percentage, or null without generation. */
  verificationApprovalRate: number | null
}
/** Anonymized course-level analytics, without individual student identities. */
export interface InstitutionalCourse extends Omit<InstitutionalTotals, 'courses' | 'teachers'> {
  /** Stable course identity. */
  courseId: string
  /** Course label. */
  name: string
  /** Institutional code. */
  code: string
  /** Teacher display name supplied by the API. */
  teacherName: string | null
}
/** Institutional response with the optional activity flag supplied by API v2. */
export interface InstitutionalIndicatorsDto extends Omit<InstitutionalIndicators, 'courses'> {
  /** Course aggregates; older responses may omit the activity flag. */
  courses: (InstitutionalCourse & { hasActivity?: boolean })[]
}
/** Institutional report available only to administrators. */
export interface InstitutionalIndicators {
  /** Institution summary. */
  totals: InstitutionalTotals
  /** Per-course measurements. */
  courses: InstitutionalCourse[]
}
/** Critical mastery distribution of one course subtopic. */
export interface CriticalSubtopic {
  /** Course identity. */
  courseId: string
  /** Course label. */
  courseName: string
  /** Subtopic identity. */
  subtopicId: string
  /** Subtopic label. */
  subtopicName: string
  /** Estimated mastery percentage, or null without measurements. */
  groupMastery: number | null
  /** Students below forty percent mastery. */
  lowCount: number
  /** Students from forty to below seventy percent mastery. */
  mediumCount: number
  /** Students at or above seventy percent mastery. */
  highCount: number
  /** Students without estimates. */
  noDataCount: number
}
