/**
 * Hook that prepares the data of the teacher panel frame.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import type { SidebarLink } from '@/components/layout'
import { courseRoutes, ROUTES } from '@/navigation/routes'
import { useCourses } from './useCourses'
import { useCurrentTeacher } from './useCurrentTeacher'

// Links that cover every course.
const GENERAL_LINKS: SidebarLink[] = [
  { to: ROUTES.courses, label: 'Mis cursos', icon: 'school', end: true },
  { to: ROUTES.students, label: 'Estudiantes', icon: 'group' },
  { to: ROUTES.invitations, label: 'Invitaciones', icon: 'forward_to_inbox' },
  { to: ROUTES.exercises, label: 'Ejercicios generados', icon: 'quiz' },
]

/**
 * Resolves the active course, the sidebar links and the course switcher actions.
 *
 * @remarks
 * A `courseId` in the URL becomes the active course; otherwise the first course of the teacher is used.
 *
 * @returns The sidebar `generalLinks` and `courseLinks`, the `activeCourse`, the `teacher`, the
 * `courses`, the switcher state (`isSwitcherOpen`, `openSwitcher`, `closeSwitcher`, `selectCourse`)
 * and `signOut`.
 *
 * @example
 * ```tsx
 * const shell = useShellNavigation();
 * ```
 */
export function useShellNavigation() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { courses } = useCourses()
  const { teacher } = useCurrentTeacher()
  const { activeCourseId, setActiveCourseId } = useActiveCourse()
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)

  useEffect(() => {
    if (courseId && courseId !== activeCourseId) setActiveCourseId(courseId)
    else if (!activeCourseId && courses.length > 0) setActiveCourseId(courses[0].id)
  }, [courseId, activeCourseId, courses, setActiveCourseId])

  const activeCourse = courses.find((course) => course.id === activeCourseId) ?? null

  const courseLinks = useMemo<SidebarLink[]>(
    () =>
      activeCourse
        ? [
            { to: courseRoutes.subtopics(activeCourse.id), label: 'Subtemas', icon: 'account_tree' },
            { to: courseRoutes.material(activeCourse.id), label: 'Material curricular', icon: 'description' },
            { to: courseRoutes.gapMap(activeCourse.id), label: 'Mapa de brechas', icon: 'insights' },
            { to: courseRoutes.indicators(activeCourse.id), label: 'Indicadores del curso', icon: 'query_stats' },
          ]
        : [],
    [activeCourse],
  )

  const selectCourse = useCallback(
    (nextCourseId: string) => {
      setActiveCourseId(nextCourseId)
      setIsSwitcherOpen(false)
      navigate(courseRoutes.subtopics(nextCourseId))
    },
    [navigate, setActiveCourseId],
  )

  // The sign-out confirmation belongs to feature/auth; until then the button goes to the sign-in route.
  const signOut = useCallback(() => navigate(ROUTES.signIn), [navigate])

  return {
    generalLinks: GENERAL_LINKS,
    courseLinks,
    activeCourse,
    teacher,
    courses,
    isSwitcherOpen,
    openSwitcher: () => setIsSwitcherOpen(true),
    closeSwitcher: () => setIsSwitcherOpen(false),
    selectCourse,
    signOut,
  }
}
