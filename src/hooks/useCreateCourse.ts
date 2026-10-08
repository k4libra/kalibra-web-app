/**
 * Hook that creates a course.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useState } from 'react'
import { coursesService } from '@/services/courses.service'
import type { CourseOverview, CreateCourseInput } from '@/types/course'

/**
 * Sends a new course to the courses service and exposes the request state.
 *
 * @returns `createCourse`, which resolves with the created course or `null` on failure, and the
 * `isSubmitting` and `error` state.
 *
 * @example
 * ```tsx
 * const { createCourse, isSubmitting } = useCreateCourse();
 * ```
 */
export function useCreateCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCourse = useCallback(async (input: CreateCourseInput): Promise<CourseOverview | null> => {
    setIsSubmitting(true)
    setError(null)
    try {
      return await coursesService.createCourse(input)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'No se pudo crear el curso.')
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { createCourse, isSubmitting, error }
}
