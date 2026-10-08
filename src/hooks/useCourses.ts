/**
 * Hook that loads the courses of the signed-in teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service'
import { useResource } from './useResource'

/**
 * Loads the courses of the signed-in teacher with their counters.
 *
 * @returns The `courses` (empty while loading), the `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { courses, isLoading } = useCourses();
 * ```
 */
export function useCourses() {
  const { data, isLoading, error, refetch } = useResource(coursesService.listCourses, 'courses')
  return { courses: data ?? [], isLoading, error, refetch }
}
