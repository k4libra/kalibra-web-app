/**
 * Hook that loads a course and its subtopics.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service'
import { useResource } from './useResource'

/**
 * Loads a course with its counters and the list of its subtopics.
 *
 * @param courseId - Course to load.
 * @returns The `course` (`null` while loading), its `subtopics`, the `isLoading` and `error` state, and `refetch`.
 *
 * @example
 * ```tsx
 * const { course, subtopics, isLoading } = useCourseSubtopics(courseId);
 * ```
 */
export function useCourseSubtopics(courseId: string) {
  const { data, isLoading, error, refetch } = useResource(
    (signal) => Promise.all([coursesService.getCourse(courseId, signal), coursesService.listSubtopics(courseId, signal)]),
    `course-subtopics-${courseId}`,
  )
  return { course: data?.[0] ?? null, subtopics: data?.[1] ?? [], isLoading, error, refetch }
}
