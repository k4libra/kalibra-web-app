/**
 * Hook that prepares the data of the teacher panel frame.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useActiveCourse } from '@/context/ActiveCourseContext'
import type { SidebarLink } from '@/components/layout'
import { courseRoutes, ROUTES } from '@/navigation/routes'
import { useCourses } from './useCourses'
import { useCurrentTeacher } from './useCurrentTeacher'
import { coursesService } from '@/services/courses.service'
import { useResource } from '@/hooks/useResource'
import { useLogout } from '@/hooks/useLogout'

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
 * A `courseId` in the URL takes precedence over the local selection, persisted workspace and first course.
 *
 * @returns The sidebar `generalLinks` and `courseLinks`, the `activeCourse`, the `teacher`, the
 * `courses`, the switcher state (`isSwitcherOpen`, `openSwitcher`, `closeSwitcher`, `selectCourse`)
 * and `logout` confirmation actions.
 *
 * @example
 * ```tsx
 * const shell = useShellNavigation();
 * ```
 */
export function useShellNavigation() {
  const navigate = useNavigate()
  const logout = useLogout()
  const { courseId } = useParams()
  const { courses, isLoading: isLoadingCourses, refetch: refetchCourses } = useCourses()
  const { teacher } = useCurrentTeacher()
  const workspace = useResource(coursesService.getWorkspace, 'teacher-workspace')
  const [workspaceError, setWorkspaceError] = useState<string | null>(null)
  const { activeCourseId, setActiveCourseId } = useActiveCourse()
  const refreshedCourseId = useRef<string | null>(null)
  const persistedCourseId = useRef<string | null>(null)
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false)

  useEffect(() => {
    if (isLoadingCourses || workspace.isLoading || workspace.error || !workspace.data) return
    const next = courseId || activeCourseId || workspace.data.activeCourseId || courses[0]?.id
    if (!next || (next === activeCourseId && next === persistedCourseId.current)) return
    let current = true
    void coursesService.selectActiveCourse(next).then((selected) => {
      if (current) {
        persistedCourseId.current = selected.activeCourseId
        setWorkspaceError(null)
        if (selected.activeCourseId !== activeCourseId) setActiveCourseId(selected.activeCourseId)
      }
    }).catch((reason: unknown) => {
      if (current) setWorkspaceError(reason instanceof Error ? reason.message : 'No se pudo seleccionar el curso.')
    })
    return () => { current = false }
  }, [courseId, activeCourseId, courses, isLoadingCourses, workspace.isLoading, workspace.error, workspace.data, setActiveCourseId])

  // A course created after the list was loaded is not in it yet: reload once it becomes active.
  const isActiveCourseMissing =
    Boolean(activeCourseId) && !isLoadingCourses && !courses.some((course) => course.id === activeCourseId)
  useEffect(() => {
    if (isActiveCourseMissing && refreshedCourseId.current !== activeCourseId) {
      refreshedCourseId.current = activeCourseId
      refetchCourses()
    }
  }, [isActiveCourseMissing, activeCourseId, refetchCourses])

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
    async (nextCourseId: string) => {
      try {
        const selected = await coursesService.selectActiveCourse(nextCourseId)
        persistedCourseId.current = selected.activeCourseId
        setWorkspaceError(null)
        setActiveCourseId(selected.activeCourseId)
        setIsSwitcherOpen(false)
        navigate(courseRoutes.subtopics(nextCourseId))
      } catch (reason) { setWorkspaceError(reason instanceof Error ? reason.message : 'No se pudo seleccionar el curso.') }
    },
    [navigate, setActiveCourseId],
  )

  return {
    workspaceError: workspace.error ?? workspaceError,
    retryWorkspace: workspace.refetch,
    generalLinks: GENERAL_LINKS,
    courseLinks,
    activeCourse,
    teacher,
    courses,
    isSwitcherOpen,
    openSwitcher: () => setIsSwitcherOpen(true),
    closeSwitcher: () => setIsSwitcherOpen(false),
    selectCourse,
    logout,
  }
}
