/**
 * Route definitions shared by browser navigation and integration flow tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { RouteObject } from 'react-router'
import { CourseIndicatorsPage } from '@/pages/CourseIndicatorsPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { CurricularMaterialPage } from '@/pages/CurricularMaterialPage'
import { CourseSubtopicsPage } from '@/pages/CourseSubtopicsPage'
import { GeneratedExercisesPage } from '@/pages/GeneratedExercisesPage'
import { InvitationsPage } from '@/pages/InvitationsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ROUTES } from './routes'
import { ShellRoute } from './ShellRoute'
import { SessionGuard, SessionEntry } from '@/navigation/SessionGuard'

import { RegisterPage } from '@/pages/RegisterPage'
import { LoginPage } from '@/pages/LoginPage'

/** Shared route definitions used by the browser and flow tests. */
export const APP_ROUTES: RouteObject[] = [
  { path: '/', element: <SessionEntry /> },
  { path: ROUTES.signUp, element: <RegisterPage /> },
  { path: ROUTES.signIn, element: <LoginPage /> },
  {
    element: <SessionGuard />,
    children: [
      {
        element: <ShellRoute />,
        children: [
          { path: ROUTES.courses, element: <CoursesPage /> },
          { path: 'cursos/:courseId/subtemas', element: <CourseSubtopicsPage /> },
          {
            path: 'cursos/:courseId/material',
            element: <CurricularMaterialPage />,
          },
          {
            path: 'cursos/:courseId/mapa-de-brechas',
            element: <PlaceholderPage title="Mapa de brechas" branch="feature/student-monitoring" />,
          },
          { path: 'cursos/:courseId/indicadores', element: <CourseIndicatorsPage /> },
          {
            path: ROUTES.students,
            element: <PlaceholderPage title="Estudiantes" branch="feature/student-monitoring" />,
          },
          { path: ROUTES.exercises, element: <GeneratedExercisesPage /> },
          { path: ROUTES.invitations, element: <InvitationsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <SessionEntry /> },
]
