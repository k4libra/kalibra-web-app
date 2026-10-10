/**
 * Test-only typed fixtures for existing UI behaviors.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CourseOverview, Subtopic } from '@/types/course'
import type { MonitoredStudent, StudentSubtopicMastery } from '@/types/studentMonitoring'

/** Courses used by isolated UI tests. */
export const COURSES: CourseOverview[] = [
  {
    id: 'course-1',
    name: 'Algoritmos y Estructuras de Datos',
    code: 'CS-204',
    term: '2025-I',
    faculty: 'Facultad de Ingeniería',
    semester: 'Semestre IV',
    icon: 'account_tree',
    subtopicCount: 4,
    materialCount: 0,
    approvedExerciseCount: 36,
    studentCount: 3,
    pendingInvitationCount: 1,
    averageMastery: 56,
  },
  {
    id: 'course-2',
    name: 'Álgebra Lineal',
    code: 'MA-201',
    term: '2025-I',
    faculty: 'Facultad de Ingeniería',
    semester: 'Semestre III',
    icon: 'functions',
    subtopicCount: 4,
    materialCount: 0,
    approvedExerciseCount: 0,
    studentCount: 0,
    pendingInvitationCount: 0,
    averageMastery: null,
  },
]

/**
 * Sample subtopics of every course.
 */
export const SUBTOPICS: Subtopic[] = [
  {
    id: 'sub-1',
    courseId: 'course-1',
    order: 1,
    name: 'Recursividad y Backtracking',
    description: 'Pila de llamadas, casos base y ramificación.',
    materialStatus: 'ready',
    approvedExerciseCount: 18,
    averageMastery: 65,
  },
  {
    id: 'sub-2',
    courseId: 'course-1',
    order: 2,
    name: 'Árboles Binarios de Búsqueda',
    description: 'Recorridos, inserción balanceada y rotaciones AVL.',
    materialStatus: 'ready',
    approvedExerciseCount: 18,
    averageMastery: 72,
  },
  {
    id: 'sub-3',
    courseId: 'course-1',
    order: 3,
    name: 'Programación Dinámica',
    description: 'Memoización, tabulación y subestructura óptima.',
    materialStatus: 'error',
    approvedExerciseCount: 0,
    averageMastery: 31,
  },
  {
    id: 'sub-4',
    courseId: 'course-1',
    order: 4,
    name: 'Grafos y Caminos Mínimos',
    description: 'Listas de adyacencia, Dijkstra y Bellman-Ford.',
    materialStatus: 'missing',
    approvedExerciseCount: 0,
    averageMastery: null,
  },
  {
    id: 'sub-5',
    courseId: 'course-2',
    order: 1,
    name: 'Espacios Vectoriales',
    description: 'Subespacios, bases y dimensión.',
    materialStatus: 'missing',
    approvedExerciseCount: 0,
    averageMastery: null,
  },
  {
    id: 'sub-6',
    courseId: 'course-2',
    order: 2,
    name: 'Transformaciones Lineales',
    description: 'Núcleo, imagen y matriz asociada.',
    materialStatus: 'missing',
    approvedExerciseCount: 0,
    averageMastery: null,
  },
  {
    id: 'sub-7',
    courseId: 'course-2',
    order: 3,
    name: 'Autovalores y Autovectores',
    description: 'Polinomio característico y diagonalización.',
    materialStatus: 'missing',
    approvedExerciseCount: 0,
    averageMastery: null,
  },
  {
    id: 'sub-8',
    courseId: 'course-2',
    order: 4,
    name: 'Ortogonalidad y Gram-Schmidt',
    description: 'Producto interno y bases ortonormales.',
    materialStatus: 'missing',
    approvedExerciseCount: 0,
    averageMastery: null,
  },
]


/** Generic enrollments used by isolated UI tests. */
export const STUDENTS: MonitoredStudent[] = [
    {
        id: 'st-1',
        courseId: 'course-1',
        fullName: 'Estudiante Test 1',
        email: 'estudiante.test1@upc.edu.pe',
        initials: 'ET',
        enrolledAt: '2025-09-04',
        resolvedExercises: 42,
        correctAnswers: 31,
        averageMastery: 62,
        lastActivityAt: '2025-09-15T09:48:00',
    },
    {
        id: 'st-2',
        courseId: 'course-1',
        fullName: 'Estudiante Test 2',
        email: 'estudiante.test2@upc.edu.pe',
        initials: 'ET',
        enrolledAt: '2025-09-05',
        resolvedExercises: 27,
        correctAnswers: 17,
        averageMastery: 50,
        lastActivityAt: '2025-09-14T18:20:00',
    },
    {
        id: 'st-3',
        courseId: 'course-1',
        fullName: 'Estudiante Test 3',
        email: 'estudiante.test3@upc.edu.pe',
        initials: 'ET',
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
