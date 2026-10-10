/**
 * Defines DTOs from the REST source and the v2 integration contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { UserRole } from '@/types/auth'
/** Public account returned by the v2 contract; names are optional for older API deployments. */
export interface UserDto { id: string; email: string; firstName?: string; lastName?: string; roles: UserRole[] }
/** Paginated API representation. */
export interface ApiPage<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number }
/** Ordered curriculum label. */
export interface SubtopicDto { id: string; name: string; displayOrder: number }
/** Course representation without UI-only academic metadata. */
export interface CourseDto { id: string; name: string; code: string; subtopics: SubtopicDto[]; createdAt: string }
/** File representation; size and page count are not supplied by the API. */
export interface MaterialDto {
  id: string; courseId: string; subtopicIds: string[]; fileName: string; format: 'PDF' | 'PNG' | 'JPEG'
  status: 'PENDING_INGESTION' | 'READY' | 'INGESTION_ERROR'; failureReason: string | null; uploadedAt: string
}
/** Catalog counts, independent of the paginated exercise rows. */
export interface CatalogDto { courseId: string; courseName: string; subtopics: { subtopicId: string; subtopicName: string; generated: number; approved: number; discarded: number }[] }
/** Generated question and its actual verification verdict. */
export interface ExerciseDto {
  id: string; subtopicId: string; origin: string; statement: string; options: { key: string; text: string; correct: boolean }[]
  explanation: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD'; verdict: 'APPROVED' | 'DISCARDED'; rejectionReason: string | null; generatedAt: string
}
/** Student enrollment without inferred activity dates. */
export interface RosterStudentDto { studentId: string; email: string; firstName?: string; lastName?: string; enrolledAt: string }
/** Enrollments grouped by an owned course. */
export interface RosterDto { courseId: string; courseName: string; courseCode: string; enrolledCount: number; students: RosterStudentDto[] }
/** Invitation lifecycle supplied by the server. */
export interface InvitationDto { id: string; courseId: string; invitedEmail: string; status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'; sentAt: string; expiresAt: string }
/** Sent invitations grouped by course. */
export interface InvitationGroupDto { courseId: string; courseName: string; courseCode: string; invitations: InvitationDto[] }
/** Accuracy measurements for an enrolled student. */
export interface AccuracyDto { studentId: string; email: string; firstName?: string; lastName?: string; correct: number; submitted: number; accuracy: number | null; hasActivity: boolean }
/** Course indicators from the progress API. */
export interface IndicatorsDto {
  courseId: string; hasActivity: boolean
  accuracy: { groupAccuracy: number | null; perStudent: AccuracyDto[] }
  practice: { totalSolved: number; averagePerActiveStudent: number; activeStudents: number; enrolledStudents: number; perSubtopic: { subtopicId: string; subtopicName: string; solved: number }[] }
  evolution: { groupInitial: number | null; groupCurrent: number | null; groupDeltaPoints: number | null; perSubtopic: { subtopicId: string; subtopicName: string; initialAverage: number | null; currentAverage: number | null; deltaPoints: number | null; level: string; practiced: boolean }[] }
  verification: { approvalRate: number | null; approved: number; discarded: number; perSubtopic: { subtopicId: string; subtopicName: string; approvalRate: number }[] }
}
/** Distribution of measured and unmeasured mastery. */
export interface GapSubtopicDto { subtopicId: string; subtopicName: string; groupMastery: number | null; lowCount: number; mediumCount: number; highCount: number; noDataCount: number; reinforcementPriority: number }
/** Mastery matrix with one cell per enrolled student and subtopic. */
export interface GapMapDto { courseId: string; hasSufficientData: boolean; subtopics: GapSubtopicDto[]; students: { studentId: string; email: string; firstName?: string; lastName?: string; subtopicId: string; mastery: number | null; level: string }[] }
/** Individual progress; feedback is text, not response correctness or recommendations. */
export interface ProgressDto { studentId: string; courseId: string; hasActivity: boolean; subtopics: { subtopicId: string; subtopicName: string; mastery: number | null; level: string; solvedCount: number }[]; recentFeedback: string[] }
/** API-provided guide entry. */
export interface IndicatorGuideEntry { indicator: string; whatItMeasures: string; goodSignal: string }
/** API-provided guide. */
export interface IndicatorGuideDto { entries: IndicatorGuideEntry[] }
