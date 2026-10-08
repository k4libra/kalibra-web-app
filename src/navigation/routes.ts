/**
 * Paths of the teacher web app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

/**
 * Static paths of the app.
 */
export const ROUTES = {
  signIn: '/iniciar-sesion',
  signUp: '/registro',
  courses: '/cursos',
  students: '/estudiantes',
  invitations: '/invitaciones',
  exercises: '/ejercicios',
} as const

/**
 * Builds the paths of the sections that belong to one course.
 */
export const courseRoutes = {
  /**
   * Path of the subtopics of a course.
   *
   * @param courseId - Course to open.
   * @returns The path of the subtopics page.
   */
  subtopics: (courseId: string) => `/cursos/${courseId}/subtemas`,
  /**
   * Path of the curricular material of a course.
   *
   * @param courseId - Course to open.
   * @returns The path of the curricular material page.
   */
  material: (courseId: string) => `/cursos/${courseId}/material`,
  /**
   * Path of the gap map of a course.
   *
   * @param courseId - Course to open.
   * @returns The path of the gap map page.
   */
  gapMap: (courseId: string) => `/cursos/${courseId}/mapa-de-brechas`,
  /**
   * Path of the indicators of a course.
   *
   * @param courseId - Course to open.
   * @returns The path of the indicators page.
   */
  indicators: (courseId: string) => `/cursos/${courseId}/indicadores`,
}
