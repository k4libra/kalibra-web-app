/**
 * Route table of the teacher web app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { CourseIndicatorsPage } from '@/pages/CourseIndicatorsPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { CourseSubtopicsPage } from '@/pages/CourseSubtopicsPage'
import { GeneratedExercisesPage } from '@/pages/GeneratedExercisesPage'
import { InvitationsPage } from '@/pages/InvitationsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ROUTES } from './routes'
import { ShellRoute } from './ShellRoute'

import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'

// Each feature branch replaces the placeholder of the routes it owns.
const router = createBrowserRouter([
  { path: ROUTES.signUp, element: <RegisterPage /> },
  { path: ROUTES.signIn, element: <LoginPage /> },
  {
    element: <ShellRoute />,
    children: [
      { index: true, element: <Navigate to={ROUTES.courses} replace /> },
      { path: ROUTES.courses, element: <CoursesPage /> },
      { path: 'cursos/:courseId/subtemas', element: <CourseSubtopicsPage /> },
      { path: 'cursos/:courseId/material', element: <PlaceholderPage title="Material curricular" branch="feature/curricular-material" /> },
      { path: 'cursos/:courseId/mapa-de-brechas', element: <PlaceholderPage title="Mapa de brechas" branch="feature/student-monitoring" /> },
      { path: 'cursos/:courseId/indicadores', element: <CourseIndicatorsPage /> },
      { path: ROUTES.students, element: <PlaceholderPage title="Estudiantes" branch="feature/student-monitoring" /> },
      { path: ROUTES.exercises, element: <GeneratedExercisesPage /> },
      { path: ROUTES.invitations, element: <InvitationsPage /> },
    ],
  },
  { path: '*', element: <Navigate to={ROUTES.courses} replace /> },
])

/**
 * Mounts the router of the app.
 */
export function AppRouter() {
  return <RouterProvider router={router} />
}
