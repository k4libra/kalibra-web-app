/**
 * Domain contracts of the student monitoring feature.
 *
 * @author MRamirez202210582
 * @packageDocumentation
 */

import type { CourseOverview, Subtopic } from '@/types/course'

/** Describes a student enrollment and its activity counters. */
export interface MonitoredStudent {
  /** Stable identity shared with indicators. */
  id: string
  /** Course where the student accepted an invitation. */
  courseId: string
  /** Full name shown in the roster. */
  fullName: string
  /** Email used for the invitation. */
  email: string
  /** Initials used by the avatar. */
  initials: string
  /** Enrollment date in ISO calendar format. */
  enrolledAt: string
  /** Total exercises answered. */
  resolvedExercises: number
  /** Exercises answered correctly. */
  correctAnswers: number
  /** Estimated mastery percentage, or null without practice. */
  averageMastery: number | null
  /** Last response timestamp, or null without practice. */
  lastActivityAt: string | null
}

/** Describes mastery and response counters for one subtopic. */
export interface StudentSubtopicMastery {
  /** Stable student identity. */
  studentId: string
  /** Subtopic being measured. */
  subtopicId: string
  /** Estimated mastery percentage, or null without responses. */
  mastery: number | null
  /** Number of exercises answered. */
  resolvedExercises: number
  /** Number of correct responses. */
  correctAnswers: number | null
}

/** Describes an explicit recent response used to substantiate recommendations. */
export interface RecentResponse {
  /** Subtopic of the response. */
  subtopicId: string
  /** Whether the response was correct. */
  isCorrect: boolean
}

/** Describes the progress and recommendation evidence of one student. */
export interface StudentProgress {
  /** Enrollment and aggregate activity. */
  student: MonitoredStudent
  /** Measurements per subtopic. */
  subtopics: StudentSubtopicMastery[]
  /** Feedback text returned by the progress endpoint. */
  recentFeedback?: string[]
  /** Latest responses, newest first. */
  recentResponses: RecentResponse[]
  /** Explicit reinforcement recommendations, empty when unavailable. */
  reinforcementSubtopicIds: string[]
}

/** Describes the mastery distribution of a subtopic. */
export interface SubtopicGap {
  /** Subtopic being measured. */
  subtopicId: string
  /** Group mastery percentage, or null without activity. */
  averageMastery: number | null
  /** Students at or above the high threshold. */
  highMasteryCount: number
  /** Students between the low and high thresholds. */
  mediumMasteryCount: number
  /** Students below the low threshold. */
  lowMasteryCount: number
  /** Enrolled students without responses in this subtopic. */
  noDataCount: number
  /** Students with measurements in this subtopic. */
  studentsWithActivity: number
}

/** Describes the global enrollment summary. */
export interface StudentMonitoringStats {
  /** Timestamp of the activity snapshot. */
  updatedAt: string
  /** Total enrollments across the teacher's courses. */
  totalStudents: number
  /** Enrollments with at least one response. */
  activeStudents: number
  /** Enrollments without responses. */
  inactiveStudents: number
}

/** Describes the summary metrics of one gap map. */
export interface GapMapStats {
  /** Estimated group mastery, or null without activity. */
  averageMastery: number | null
  /** Lowest measured subtopic, or null without activity. */
  weakestSubtopicId: string | null
  /** Students with at least one response. */
  activeStudents: number
  /** Students enrolled in the course. */
  totalStudents: number
}

/** Describes the aggregate gap map returned by the service. */
export interface CourseGapMap {
  /** Course being measured. */
  courseId: string
  /** Timestamp used for the update label. */
  updatedAt: string
  /** Summary metrics. */
  stats: GapMapStats
  /** Distributions per subtopic. */
  subtopics: SubtopicGap[]
}

/** Describes a course and its enrolled students. */
export interface CourseStudentGroup {
  /** Course metadata supplied by the courses service. */
  course: CourseOverview
  /** Enrolled students, in roster order. */
  students: MonitoredStudent[]
}

/** Describes the complete heatmap loaded as a single resource. */
export interface GapMapResource {
  /** Course metadata. */
  course: CourseOverview
  /** Subtopic labels in course order. */
  courseSubtopics: Subtopic[]
  /** Group summary and distributions. */
  gapMap: CourseGapMap
  /** Individual measurements for each enrolled student. */
  progress: StudentProgress[]
}
