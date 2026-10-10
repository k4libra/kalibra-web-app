/**
 * Simulated courses endpoints with sample data taken from the Figma mockups.
 *
 * @remarks
 * The data is only an example: every screen renders whatever courses and subtopics the teacher creates.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { CoursesContract } from '@/services/courses.contract'
import type { CourseOverview, Subtopic, Teacher } from '@/types/course'
import { isEmptyScenario, respond } from '@/mocks/scenario'
import { readCourseMaterials } from '@/mocks/courseMaterialsStore.mock'
import { getMockSession, sessionCollection } from '@/mocks/session'

/**
 * Sample courses of the signed-in teacher.
 */
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

// Empty teachers hide the reference courses while retaining courses they create in this session.
const REFERENCE_COURSE_IDS = new Set(COURSES.map((course) => course.id))

/**
 * Checks whether a course belongs to the current mock teacher scenario.
 *
 * @param courseId - Identifier of the existing or newly created course.
 * @returns Whether course and material endpoints may expose this course.
 */
export function hasMockCourse(courseId: string): boolean {
  return sessionCollection('courses', COURSES).some((course) => course.id === courseId) && (!isEmptyScenario() || !REFERENCE_COURSE_IDS.has(courseId))
}

/**
 * Sample signed-in teacher.
 */
export const TEACHER: Teacher = {
  fullName: 'Ricardo Salas Vega',
  firstName: 'Ricardo',
  email: 'ricardo.salas@upc.edu.pe',
  initials: 'RS',
}

/**
 * Simulated implementation of {@link CoursesContract}.
 */
export const coursesMock: CoursesContract = {
  listCourses: () =>
    respond(
      sessionCollection('courses', COURSES)
        .filter((course) => hasMockCourse(course.id))
        .map((course) => ({ ...course, materialCount: readCourseMaterials(course.id).length })),
    ),
  getCourse: (courseId) => {
    const course = sessionCollection('courses', COURSES).find((item) => item.id === courseId)
    return course && hasMockCourse(courseId)
      ? respond({ ...course, materialCount: readCourseMaterials(courseId).length })
      : Promise.reject(new Error('El curso no existe.'))
  },
  listSubtopics: (courseId) =>
    respond(
      !hasMockCourse(courseId)
        ? []
        : sessionCollection('subtopics', SUBTOPICS)
            .filter((item) => item.courseId === courseId)
            .map((subtopic) => ({
              ...subtopic,
              materialStatus:
                readCourseMaterials(courseId).find((material) => material.subtopicId === subtopic.id)?.status ?? 'missing',
            })),
    ),
  createCourse: (input) => {
    const courses = sessionCollection('courses', COURSES)
    const subtopics = sessionCollection('subtopics', SUBTOPICS)
    const id = `course-${getMockSession()?.user.id ?? 'demo'}-${courses.length + 1}`
    const course: CourseOverview = {
      id,
      name: input.name,
      code: input.code,
      term: input.term,
      faculty: 'Facultad de Ingeniería',
      semester: '',
      icon: 'school',
      subtopicCount: input.subtopics.length,
      materialCount: 0,
      approvedExerciseCount: 0,
      studentCount: 0,
      pendingInvitationCount: 0,
      averageMastery: null,
    }
    courses.push(course)
    input.subtopics.forEach((name, index) =>
      subtopics.push({
        id: `${id}-sub-${index + 1}`,
        courseId: id,
        order: index + 1,
        name,
        description: '',
        materialStatus: 'missing',
        approvedExerciseCount: 0,
        averageMastery: null,
      }),
    )
    return respond(course)
  },
  getCurrentTeacher: () => {
    const user = getMockSession()?.user
    return respond(
      user
        ? {
            fullName: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            email: user.email,
            initials: `${user.firstName[0]}${user.lastName[0]}`,
          }
        : TEACHER,
    )
  },
}
