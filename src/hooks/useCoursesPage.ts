/**
 * Hook of the courses page.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '@/context/ToastContext'
import { courseRoutes } from '@/navigation/routes'
import type { CreateCourseInput } from '@/types/course'
import { plural } from '@/utils/plural'
import { useCourses } from './useCourses'
import { useCreateCourse } from './useCreateCourse'
import { useCurrentTeacher } from './useCurrentTeacher'

/**
 * Loads the courses of the teacher and drives the create course dialog.
 *
 * @returns The `courses`, the `teacher`, the summary counters (`studentCount`, `pendingInvitationCount`),
 * the `isLoading` and `error` state, the dialog state (`isCreateOpen`, `openCreate`, `closeCreate`),
 * `isSubmitting`, `createCourse` and `manageCourse`.
 *
 * @example
 * ```tsx
 * const page = useCoursesPage();
 * ```
 */
export function useCoursesPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { courses, isLoading, error } = useCourses()
  const { teacher } = useCurrentTeacher()
  const { createCourse: submitCourse, isSubmitting } = useCreateCourse()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const manageCourse = useCallback((courseId: string) => navigate(courseRoutes.subtopics(courseId)), [navigate])

  const createCourse = useCallback(
    async (input: CreateCourseInput) => {
      const course = await submitCourse(input)
      if (!course) return
      setIsCreateOpen(false)
      showToast({
        title: 'Curso creado',
        message: `${course.name} quedó registrado con ${plural(course.subtopicCount, 'subtema', 'subtemas')}.`,
      })
      navigate(courseRoutes.subtopics(course.id))
    },
    [navigate, showToast, submitCourse],
  )

  return {
    courses,
    teacher,
    studentCount: courses.reduce((total, course) => total + course.studentCount, 0),
    pendingInvitationCount: courses.reduce((total, course) => total + course.pendingInvitationCount, 0),
    isLoading,
    error,
    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),
    isSubmitting,
    createCourse,
    manageCourse,
  }
}
