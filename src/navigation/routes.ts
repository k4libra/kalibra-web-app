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
  adminPanel: '/admin/panel',
  criticalSubtopics: '/admin/subtemas-criticos',
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

/** Builds paths of individual student views. */
export const studentRoutes = {
  /**
   * Builds the progress path of a student.
   *
   * @param studentId - Student enrollment to open.
   * @param courseId - Course of this enrollment, avoiding ambiguous identities across courses.
   * @returns The path of the individual progress page.
   *
   * @example
   * ```ts
   * studentRoutes.progress('st-1'); // '/estudiantes/st-1'
   * ```
   */
  progress: (studentId: string, courseId?: string) => `${ROUTES.students}/${encodeURIComponent(studentId)}${courseId ? `?curso=${encodeURIComponent(courseId)}` : ''}`,
}
