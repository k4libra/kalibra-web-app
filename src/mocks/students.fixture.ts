/**
 * Canonical student enrollments and sample mastery measurements.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { MonitoredStudent, StudentSubtopicMastery } from '@/types/studentMonitoring'

/** Canonical student enrollments shared by monitoring, indicators and invitations. */
export const STUDENTS: MonitoredStudent[] = [
    {
        id: 'st-1',
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
        id: 'st-2',
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
        id: 'st-3',
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
        studentId: 'st-1',
        subtopicId: 'sub-1',
        mastery: 72,
        resolvedExercises: 18,
        correctAnswers: 15,
    },
    {
        studentId: 'st-1',
        subtopicId: 'sub-2',
        mastery: 81,
        resolvedExercises: 14,
        correctAnswers: 13,
    },
    {
        studentId: 'st-1',
        subtopicId: 'sub-3',
        mastery: 33,
        resolvedExercises: 10,
        correctAnswers: 3,
    },
    {
        studentId: 'st-1',
        subtopicId: 'sub-4',
        mastery: null,
        resolvedExercises: 0,
        correctAnswers: 0,
    },

    // Diego Paredes
    {
        studentId: 'st-2',
        subtopicId: 'sub-1',
        mastery: 58,
        resolvedExercises: 12,
        correctAnswers: 8,
    },
    {
        studentId: 'st-2',
        subtopicId: 'sub-2',
        mastery: 63,
        resolvedExercises: 9,
        correctAnswers: 7,
    },
    {
        studentId: 'st-2',
        subtopicId: 'sub-3',
        mastery: 29,
        resolvedExercises: 6,
        correctAnswers: 2,
    },
    {
        studentId: 'st-2',
        subtopicId: 'sub-4',
        mastery: null,
        resolvedExercises: 0,
        correctAnswers: 0,
    },
]
