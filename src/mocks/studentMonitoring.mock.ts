
/**
 * Simulated data for student monitoring.
 *
 * @remarks
 * Uses course and subtopic identifiers from develop.
 * All information is illustrative and based on Figma.
 *
 * @packageDocumentation
 */

import { COURSES, SUBTOPICS } from './courses.mock'

import type {
    CourseGapMap,
    MonitoredStudent,
    StudentMonitoringStats,
    StudentProgress,
    StudentSubtopicMastery,
    SubtopicGap,
} from '@/types/studentMonitoring'

/**
 * Students displayed in the monitoring screens.
 */
export const MONITORED_STUDENTS: MonitoredStudent[] = [
    {
        id: 'student-1',
        courseId: 'course-1',
        fullName: 'Valentina Morales Rivera',
        email: 'v.morales@upc.edu.pe',
        initials: 'VM',
        enrolledAt: '2025-09-04',
        resolvedExercises: 42,
        correctAnswers: 31,
        averageMastery: 62,
        lastActivityAt: '2025-09-15T09:48:00',
    },
    {
        id: 'student-2',
        courseId: 'course-1',
        fullName: 'Diego Paredes Luna',
        email: 'd.paredes@upc.edu.pe',
        initials: 'DP',
        enrolledAt: '2025-09-05',
        resolvedExercises: 27,
        correctAnswers: 17,
        averageMastery: 50,
        lastActivityAt: '2025-09-14T18:20:00',
    },
    {
        id: 'student-3',
        courseId: 'course-1',
        fullName: 'Lucía Ramos Soto',
        email: 'l.ramos@upc.edu.pe',
        initials: 'LR',
        enrolledAt: '2025-09-04',
        resolvedExercises: 0,
        correctAnswers: 0,
        averageMastery: null,
        lastActivityAt: null,
    },
]

/**
 * Mastery by student and subtopic.
 *
 * @remarks
 * Values reproduce the individual progress examples
 * in Figma. No activity is represented by null.
 */
export const STUDENT_SUBTOPIC_MASTERY: StudentSubtopicMastery[] = [
    // Valentina Morales
    {
        studentId: 'student-1',
        subtopicId: 'sub-1',
        mastery: 72,
        resolvedExercises: 18,
        correctAnswers: 15,
    },
    {
        studentId: 'student-1',
        subtopicId: 'sub-2',
        mastery: 81,
        resolvedExercises: 14,
        correctAnswers: 13,
    },
    {
        studentId: 'student-1',
        subtopicId: 'sub-3',
        mastery: 33,
        resolvedExercises: 10,
        correctAnswers: 3,
    },
    {
        studentId: 'student-1',
        subtopicId: 'sub-4',
        mastery: null,
        resolvedExercises: 0,
        correctAnswers: 0,
    },

    // Diego Paredes
    {
        studentId: 'student-2',
        subtopicId: 'sub-1',
        mastery: 58,
        resolvedExercises: 12,
        correctAnswers: 8,
    },
    {
        studentId: 'student-2',
        subtopicId: 'sub-2',
        mastery: 63,
        resolvedExercises: 9,
        correctAnswers: 7,
    },
    {
        studentId: 'student-2',
        subtopicId: 'sub-3',
        mastery: 29,
        resolvedExercises: 6,
        correctAnswers: 2,
    },
    {
        studentId: 'student-2',
        subtopicId: 'sub-4',
        mastery: null,
        resolvedExercises: 0,
        correctAnswers: 0,
    },
]

/**
 * Lists the students enrolled in a course.
 */
export async function listMonitoredStudents(
    courseId: string,
): Promise<MonitoredStudent[]> {
    const courseExists = COURSES.some((course) => course.id === courseId)

    if (!courseExists) {
        throw new Error('El curso seleccionado no existe.')
    }

    return MONITORED_STUDENTS.filter(
        (student) => student.courseId === courseId,
    ).map((student) => ({ ...student }))
}

/**
 * Returns the progress of one student.
 */
export async function getStudentProgress(
    studentId: string,
): Promise<StudentProgress> {
    const student = MONITORED_STUDENTS.find(
        (item) => item.id === studentId,
    )

    if (!student) {
        throw new Error('No se encontró al estudiante.')
    }

    const subtopics = STUDENT_SUBTOPIC_MASTERY.filter(
        (item) => item.studentId === studentId,
    ).map((item) => ({ ...item }))

    return {
        student: { ...student },
        subtopics,
    }
}

/**
 * Returns the summary of enrolled students.
 */
export async function getStudentMonitoringStats():
    Promise<StudentMonitoringStats> {
    return {
        totalStudents: MONITORED_STUDENTS.length,
        activeStudents: MONITORED_STUDENTS.filter(
            (student) => student.resolvedExercises > 0,
        ).length,
        inactiveStudents: MONITORED_STUDENTS.filter(
            (student) => student.resolvedExercises === 0,
        ).length,
    }
}

/**
 * Builds the gap map for a selected course.
 *
 * @remarks
 * The course and subtopic mastery averages come from
 * the existing develop mocks. The distribution is
 * calculated from the individual Figma examples.
 */
export async function getCourseGapMap(
    courseId: string,
): Promise<CourseGapMap> {
    const course = COURSES.find((item) => item.id === courseId)

    if (!course) {
        throw new Error('El curso seleccionado no existe.')
    }

    const students = MONITORED_STUDENTS.filter(
        (student) => student.courseId === courseId,
    )

    const courseSubtopics = SUBTOPICS.filter(
        (subtopic) => subtopic.courseId === courseId,
    )

    const subtopics: SubtopicGap[] = courseSubtopics.map((subtopic) => {
        const records = STUDENT_SUBTOPIC_MASTERY.filter(
            (record) =>
                record.subtopicId === subtopic.id &&
                students.some((student) => student.id === record.studentId),
        )

        const highMasteryCount = records.filter(
            (record) => record.mastery !== null && record.mastery >= 70,
        ).length

        const mediumMasteryCount = records.filter(
            (record) =>
                record.mastery !== null &&
                record.mastery >= 40 &&
                record.mastery < 70,
        ).length

        const lowMasteryCount = records.filter(
            (record) => record.mastery !== null && record.mastery < 40,
        ).length

        const studentsWithActivity =
            highMasteryCount + mediumMasteryCount + lowMasteryCount

        return {
            subtopicId: subtopic.id,
            averageMastery: studentsWithActivity > 0
                ? subtopic.averageMastery
                : null,
            highMasteryCount,
            mediumMasteryCount,
            lowMasteryCount,
            noDataCount: students.length - studentsWithActivity,
            studentsWithActivity,
        }
    })

    const measuredSubtopics = subtopics.filter(
        (subtopic) => subtopic.averageMastery !== null,
    )

    const weakestSubtopic = [...measuredSubtopics].sort(
        (a, b) =>
            (a.averageMastery ?? 0) - (b.averageMastery ?? 0),
    )[0]

    return {
        courseId,
        stats: {
            averageMastery: students.length > 0
                ? course.averageMastery
                : null,
            weakestSubtopicId: weakestSubtopic?.subtopicId ?? null,
            activeStudents: students.filter(
                (student) => student.resolvedExercises > 0,
            ).length,
            totalStudents: students.length,
        },
        subtopics,
    }
}
