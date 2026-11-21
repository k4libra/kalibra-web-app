/**
 * Hook that loads the courses of the signed-in teacher.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useSyncExternalStore } from 'react'
import { coursesService } from '@/services/courses.service'
import { useResource } from './useResource'

let revision = 0
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
const getRevision = () => revision

/** Refreshes mounted course projections after a successful metadata change. */
export function refreshCourses() {
  revision += 1
  listeners.forEach((listener) => listener())
}

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
  const currentRevision = useSyncExternalStore(subscribe, getRevision)
  const { data, isLoading, error, refetch } = useResource(coursesService.listCourses, `courses-${currentRevision}`)
  return { courses: data ?? [], isLoading, error, refetch }
}
