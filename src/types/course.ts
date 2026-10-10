/**
 * Domain types of the courses a teacher manages.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { IconName } from './ui'

/**
 * Describes a course created by the teacher.
 */
export interface Course {
  /** Unique identifier assigned by the server. */
  id: string
  /** Name shown in lists, headers and the sidebar. */
  name: string
  /** Institutional code, for example `CS-204`. */
  code: string
  /** Academic term, for example `2025-I`. */
  term: string
  /** Faculty that offers the course. */
  faculty: string
  /** Semester label, for example `Semestre IV`. */
  semester: string
  /** Icon chosen to identify the course. */
  icon: IconName
}

/**
 * Describes a course together with the counters shown in its card.
 */
export interface CourseOverview extends Course {
  /** Number of subtopics defined. */
  subtopicCount: number
  /** Number of curricular materials uploaded. */
  materialCount: number
  /** Number of generated exercises that passed verification. */
  approvedExerciseCount: number
  /** Number of enrolled students. */
  studentCount: number
  /** Enrolled identities used to count distinct students across courses. */
  studentIds: string[]
  /** Number of invitations sent and not answered yet. */
  pendingInvitationCount: number
  /** Average mastery of the group from 0 to 100; `null` while there is no activity. */
  averageMastery: number | null
}

/**
 * Processing state of the curricular material of a subtopic.
 *
 * @remarks
 * - `ready`: extracted and available to generate exercises.
 * - `processing`: uploaded and pending ingestion.
 * - `error`: ingestion failed; the teacher must replace the file.
 * - `missing`: nothing uploaded yet.
 */
export type MaterialStatus = 'ready' | 'processing' | 'error' | 'missing'

/**
 * Describes a subtopic of a course and its teaching status.
 */
export interface Subtopic {
  /** Unique identifier assigned by the server. */
  id: string
  /** Course the subtopic belongs to. */
  courseId: string
  /** Position in the course, starting at 1. */
  order: number
  /** Name of the subtopic. */
  name: string
  /** One-line summary of what it covers. */
  description: string
  /** State of its curricular material. */
  materialStatus: MaterialStatus
  /** Number of generated exercises that passed verification. */
  approvedExerciseCount: number
  /** Average mastery of the group from 0 to 100; `null` while there is no activity. */
  averageMastery: number | null
}

/**
 * Describes the signed-in teacher shown in the sidebar.
 */
export interface Teacher {
  /** Full name. */
  fullName: string
  /** First name used in greetings. */
  firstName: string
  /** Institutional email. */
  email: string
  /** Initials for the avatar. */
  initials: string
}

/**
 * Data the teacher enters to create a course.
 */
export interface CreateCourseInput {
  /** Name of the course. */
  name: string
  /** Institutional code. */
  code: string
  /** Academic term. */
  term?: string
  /** Names of the subtopics, in the order they were added; at least one. */
  subtopics: string[]
}
