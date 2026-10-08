/**
 * Hook that loads the profile of the signed-in teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { coursesService } from '@/services/courses.service'
import { useResource } from './useResource'

/**
 * Loads the profile of the signed-in teacher shown in the sidebar and greetings.
 *
 * @returns The `teacher` (`null` while loading), the `isLoading` and `error` state.
 *
 * @example
 * ```tsx
 * const { teacher } = useCurrentTeacher();
 * ```
 */
export function useCurrentTeacher() {
  const { data, isLoading, error } = useResource(coursesService.getCurrentTeacher, 'teacher')
  return { teacher: data, isLoading, error }
}
