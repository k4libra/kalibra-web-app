/**
 * Route definitions shared by browser navigation and integration flow tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { RouteObject } from 'react-router'
import { CourseIndicatorsPage } from '@/pages/CourseIndicatorsPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { GapMapPage } from '@/pages/GapMapPage'
import { StudentProgressPage } from '@/pages/StudentProgressPage'
import { StudentsPage } from '@/pages/StudentsPage'
import { CurricularMaterialPage } from '@/pages/CurricularMaterialPage'
import { CourseSubtopicsPage } from '@/pages/CourseSubtopicsPage'
import { GeneratedExercisesPage } from '@/pages/GeneratedExercisesPage'
import { InvitationsPage } from '@/pages/InvitationsPage'
import { ROUTES } from './routes'
import { ShellRoute } from './ShellRoute'
import { SessionGuard, SessionEntry, SessionResolution } from '@/navigation/SessionGuard'

import { AdminShellRoute } from '@/navigation/AdminShellRoute'
import { AdminPanelPage } from '@/pages/AdminPanelPage'
import { CriticalSubtopicsPage } from '@/pages/CriticalSubtopicsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { LoginPage } from '@/pages/LoginPage'

/** Shared route definitions used by the browser and flow tests. */
export const APP_ROUTES: RouteObject[] = [{ element: <SessionResolution />, children: [
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
            element: <GapMapPage />,
          },
          { path: 'cursos/:courseId/indicadores', element: <CourseIndicatorsPage /> },
          {
            path: ROUTES.students,
            element: <StudentsPage />,
          },
          { path: 'estudiantes/:studentId', element: <StudentProgressPage /> },
          { path: ROUTES.exercises, element: <GeneratedExercisesPage /> },
          { path: ROUTES.invitations, element: <InvitationsPage /> },
        ],
      },
    ],
  },
  { element: <SessionGuard role="ADMINISTRATOR" />, children: [{ element: <AdminShellRoute />, children: [
    { path: ROUTES.adminPanel, element: <AdminPanelPage /> },
    { path: ROUTES.criticalSubtopics, element: <CriticalSubtopicsPage /> },
  ] }] },
  { path: '*', element: <SessionEntry /> },
] }]
