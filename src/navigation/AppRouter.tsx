/**
 * Route table of the teacher web app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ROUTES } from './routes'
import { ShellRoute } from './ShellRoute'

import { StudentsPage } from '@/pages/StudentsPage'
import { StudentProgressPage } from '@/pages/StudentProgressPage'
import { GapMapPage } from '@/pages/GapMapPage'


// Each feature branch replaces the placeholder of the routes it owns.
const router = createBrowserRouter([
  { path: ROUTES.signUp, element: <PlaceholderPage title="Registro de docente" branch="feature/auth" /> },
  { path: ROUTES.signIn, element: <PlaceholderPage title="Inicio de sesión" branch="feature/auth" /> },
  {
    element: <ShellRoute />,
    children: [
      { index: true, element: <Navigate to={ROUTES.courses} replace /> },
      { path: ROUTES.courses, element: <PlaceholderPage title="Mis cursos" branch="feature/course-management" /> },
      { path: 'cursos/:courseId/subtemas', element: <PlaceholderPage title="Subtemas del curso" branch="feature/course-management" /> },
      { path: 'cursos/:courseId/material', element: <PlaceholderPage title="Material curricular" branch="feature/curricular-material" /> },
      { path: 'cursos/:courseId/mapa-de-brechas', element: <GapMapPage /> },
      { path: 'cursos/:courseId/indicadores', element: <PlaceholderPage title="Indicadores del curso" branch="feature/invitations-indicators" /> },
      { path: ROUTES.students, element: <StudentsPage /> },
      { path: 'estudiantes/:studentId', element: <StudentProgressPage /> },
      { path: ROUTES.invitations, element: <PlaceholderPage title="Invitaciones" branch="feature/invitations-indicators" /> },
      { path: ROUTES.exercises, element: <PlaceholderPage title="Ejercicios generados" branch="feature/exercise-management" /> },
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
