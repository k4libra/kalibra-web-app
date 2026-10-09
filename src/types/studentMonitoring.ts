
/**
 * Domain types for the student monitoring feature.
 *
 * @remarks
 * Defines the data required by the student list,
 * individual progress and course gap map.
 *
 * @packageDocumentation
 */

/**
 * Estimated mastery level based on answered exercises.
 */
export type MasteryLevel = 'high' | 'medium' | 'low' | 'no-data'

/**
 * A student enrolled in a course.
 */
export interface MonitoredStudent {
    id: string
    courseId: string
    fullName: string
    email: string
    initials: string
    enrolledAt: string
    resolvedExercises: number
    correctAnswers: number
    averageMastery: number | null
    lastActivityAt: string | null
}

/**
 * Estimated mastery for one student in one subtopic.
 */
export interface StudentSubtopicMastery {
    studentId: string
    subtopicId: string
    mastery: number | null
    resolvedExercises: number
    correctAnswers: number
}

/**
 * Complete progress information of a student.
 */
export interface StudentProgress {
    student: MonitoredStudent
    subtopics: StudentSubtopicMastery[]
}

/**
 * Group-level mastery information for one subtopic.
 */
export interface SubtopicGap {
    subtopicId: string
    averageMastery: number | null
    highMasteryCount: number
    mediumMasteryCount: number
    lowMasteryCount: number
    noDataCount: number
    studentsWithActivity: number
}

/**
 * Summary metrics for the student list.
 */
export interface StudentMonitoringStats {
    totalStudents: number
    activeStudents: number
    inactiveStudents: number
}

/**
 * Summary metrics for the course gap map.
 */
export interface GapMapStats {
    averageMastery: number | null
    weakestSubtopicId: string | null
    activeStudents: number
    totalStudents: number
}

/**
 * Data used by the course gap map.
 */
export interface CourseGapMap {
    courseId: string
    stats: GapMapStats
    subtopics: SubtopicGap[]
}
