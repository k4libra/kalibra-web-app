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
import { isEmptyScenario, respond } from './scenario'

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
    materialCount: 3,
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
  { id: 'sub-1', courseId: 'course-1', order: 1, name: 'Recursividad y Backtracking', description: 'Pila de llamadas, casos base y ramificación.', materialStatus: 'ready', approvedExerciseCount: 18, averageMastery: 65 },
  { id: 'sub-2', courseId: 'course-1', order: 2, name: 'Árboles Binarios de Búsqueda', description: 'Recorridos, inserción balanceada y rotaciones AVL.', materialStatus: 'ready', approvedExerciseCount: 18, averageMastery: 72 },
  { id: 'sub-3', courseId: 'course-1', order: 3, name: 'Programación Dinámica', description: 'Memoización, tabulación y subestructura óptima.', materialStatus: 'error', approvedExerciseCount: 0, averageMastery: 31 },
  { id: 'sub-4', courseId: 'course-1', order: 4, name: 'Grafos y Caminos Mínimos', description: 'Listas de adyacencia, Dijkstra y Bellman-Ford.', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null },
  { id: 'sub-5', courseId: 'course-2', order: 1, name: 'Espacios Vectoriales', description: 'Subespacios, bases y dimensión.', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null },
  { id: 'sub-6', courseId: 'course-2', order: 2, name: 'Transformaciones Lineales', description: 'Núcleo, imagen y matriz asociada.', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null },
  { id: 'sub-7', courseId: 'course-2', order: 3, name: 'Autovalores y Autovectores', description: 'Polinomio característico y diagonalización.', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null },
  { id: 'sub-8', courseId: 'course-2', order: 4, name: 'Ortogonalidad y Gram-Schmidt', description: 'Producto interno y bases ortonormales.', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null },
]

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
  listCourses: () => respond(isEmptyScenario() ? [] : COURSES),
  getCourse: (courseId) => {
    const course = COURSES.find((item) => item.id === courseId)
    return course ? respond(course) : Promise.reject(new Error(`Course ${courseId} not found`))
  },
  listSubtopics: (courseId) => respond(SUBTOPICS.filter((item) => item.courseId === courseId)),
  createCourse: (input) => {
    const id = `course-${COURSES.length + 1}`
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
    COURSES.push(course)
    input.subtopics.forEach((name, index) =>
      SUBTOPICS.push({ id: `${id}-sub-${index + 1}`, courseId: id, order: index + 1, name, description: '', materialStatus: 'missing', approvedExerciseCount: 0, averageMastery: null }),
    )
    return respond(course)
  },
  getCurrentTeacher: () => respond(TEACHER),
}
